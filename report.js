/* Экомун — PDF ва Word (DOCX) ҳисобот ясовчи. Ташқи кутубхонасиз: PDF га DejaVu Sans
   шрифтининг фақат ишлатилган ҳарфлари (subset) жойланади, DOCX — оддий ZIP + WordprocessingML.
   server.js ва analytics.js томонидан ишлатилади:  const { pdf, docx } = require("./report");

   Ҳужжат тузилиши (иккала формат учун битта):
     { title, subtitle, note, meta: [[номи, қиймати]], blocks: [
         { t: "h1" | "h2" | "p", text },
         { t: "list", items: [матн] },
         { t: "kpis", items: [[қиймат, изоҳ]] },
         { t: "bars", items: [{ n, v, label }] },
         { t: "table", head: [..], rows: [[..]], widths: [улуш], align: ["l"|"r"|"c"], size },
         { t: "pagebreak" } ] } */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const zlib = require("node:zlib");

const GREEN = [4 / 255, 120 / 255, 87 / 255];
const GREEN_LIGHT = [236 / 255, 253 / 255, 245 / 255];
const GREY = [100 / 255, 116 / 255, 139 / 255];
const INK = [15 / 255, 23 / 255, 42 / 255];
const LINE = [226 / 255, 232 / 255, 240 / 255];
const ZEBRA = [248 / 255, 250 / 255, 252 / 255];
const BAR = [16 / 255, 185 / 255, 129 / 255];
const TRACK = [226 / 255, 240 / 255, 234 / 255];

/* ---------- TrueType шрифтни ўқиш ---------- */
const fontCache = {};
function loadFont(file) {
  if (fontCache[file]) return fontCache[file];
  const buf = fs.readFileSync(path.join(__dirname, "fonts", file));
  const tables = {};
  const n = buf.readUInt16BE(4);
  for (let i = 0; i < n; i++) {
    const o = 12 + i * 16;
    tables[buf.toString("latin1", o, o + 4)] = { off: buf.readUInt32BE(o + 8), len: buf.readUInt32BE(o + 12) };
  }
  const head = tables.head.off, hhea = tables.hhea.off;
  const upem = buf.readUInt16BE(head + 18), locFmt = buf.readInt16BE(head + 50);
  const numGlyphs = buf.readUInt16BE(tables.maxp.off + 4);
  const numHM = buf.readUInt16BE(hhea + 34);
  const adv = new Uint16Array(numGlyphs);
  for (let g = 0; g < numGlyphs; g++) adv[g] = buf.readUInt16BE(tables.hmtx.off + 4 * Math.min(g, numHM - 1));
  const loca = new Uint32Array(numGlyphs + 1);
  for (let g = 0; g <= numGlyphs; g++) loca[g] = locFmt ? buf.readUInt32BE(tables.loca.off + 4 * g) : buf.readUInt16BE(tables.loca.off + 2 * g) * 2;
  /* cmap: Unicode → ҳарф рақами (format 12 бўлса шуни, бўлмаса format 4) */
  const cmap = new Map();
  const c = tables.cmap.off, nsub = buf.readUInt16BE(c + 2);
  let f4 = 0, f12 = 0;
  for (let i = 0; i < nsub; i++) {
    const pid = buf.readUInt16BE(c + 4 + i * 8), eid = buf.readUInt16BE(c + 6 + i * 8), so = c + buf.readUInt32BE(c + 8 + i * 8);
    const fmt = buf.readUInt16BE(so);
    if (fmt === 12 && pid === 3 && eid === 10) f12 = so;
    if (fmt === 4 && (pid === 3 || pid === 0)) f4 = f4 || so;
  }
  if (f12) {
    const groups = buf.readUInt32BE(f12 + 12);
    for (let i = 0; i < groups; i++) {
      const o = f12 + 16 + i * 12, s = buf.readUInt32BE(o), e = buf.readUInt32BE(o + 4), g0 = buf.readUInt32BE(o + 8);
      for (let cp = s; cp <= e && cp < 0x30000; cp++) cmap.set(cp, g0 + cp - s);
    }
  } else if (f4) {
    const seg = buf.readUInt16BE(f4 + 6) / 2;
    const ends = f4 + 14, starts = ends + seg * 2 + 2, deltas = starts + seg * 2, ranges = deltas + seg * 2;
    for (let i = 0; i < seg; i++) {
      const e = buf.readUInt16BE(ends + i * 2), s = buf.readUInt16BE(starts + i * 2), d = buf.readInt16BE(deltas + i * 2), ro = buf.readUInt16BE(ranges + i * 2);
      for (let cp = s; cp <= e && cp !== 0xffff; cp++) {
        let g;
        if (!ro) g = (cp + d) & 0xffff;
        else { const gi = buf.readUInt16BE(ranges + i * 2 + ro + (cp - s) * 2); g = gi ? (gi + d) & 0xffff : 0; }
        if (g) cmap.set(cp, g);
      }
    }
  }
  const font = { file, buf, tables, upem, numGlyphs, adv, loca, cmap,
    ascent: buf.readInt16BE(hhea + 4), descent: buf.readInt16BE(hhea + 6),
    bbox: [buf.readInt16BE(head + 36), buf.readInt16BE(head + 38), buf.readInt16BE(head + 40), buf.readInt16BE(head + 42)] };
  fontCache[file] = font;
  return font;
}

/* Фақат ишлатилган ҳарфлар қолган шрифт: ҳарф рақамлари ўзгармайди, қолганлари бўш */
function subsetFont(font, used) {
  const { buf, tables, loca, numGlyphs } = font;
  const glyf = tables.glyf.off;
  const all = new Set([0, ...used]);
  const stack = [...all];
  while (stack.length) {
    const g = stack.pop();
    if (loca[g + 1] <= loca[g]) continue;
    const o = glyf + loca[g];
    if (buf.readInt16BE(o) >= 0) continue;
    let p = o + 10, flags;
    do {
      flags = buf.readUInt16BE(p);
      const comp = buf.readUInt16BE(p + 2);
      if (!all.has(comp)) { all.add(comp); stack.push(comp); }
      p += 4 + (flags & 1 ? 4 : 2) + (flags & 8 ? 2 : flags & 0x40 ? 4 : flags & 0x80 ? 8 : 0);
    } while (flags & 0x20);
  }
  const parts = [], newLoca = Buffer.alloc((numGlyphs + 1) * 4);
  let off = 0;
  for (let g = 0; g < numGlyphs; g++) {
    newLoca.writeUInt32BE(off, g * 4);
    if (all.has(g) && loca[g + 1] > loca[g]) {
      const data = buf.subarray(glyf + loca[g], glyf + loca[g + 1]);
      const pad = (4 - (data.length % 4)) % 4;
      parts.push(data, Buffer.alloc(pad));
      off += data.length + pad;
    }
  }
  newLoca.writeUInt32BE(off, numGlyphs * 4);
  const copy = (tag) => (tables[tag] ? Buffer.from(buf.subarray(tables[tag].off, tables[tag].off + tables[tag].len)) : null);
  const head = copy("head");
  head.writeUInt32BE(0, 8); // checkSumAdjustment
  head.writeInt16BE(1, 50); // узун loca
  const out = { head, hhea: copy("hhea"), maxp: copy("maxp"), hmtx: copy("hmtx"), "cvt ": copy("cvt "), fpgm: copy("fpgm"), prep: copy("prep"), loca: newLoca, glyf: Buffer.concat(parts) };
  const tags = Object.keys(out).filter((t) => out[t]).sort();
  const nt = tags.length;
  let sr = 1, es = 0;
  while (sr * 2 <= nt) { sr *= 2; es++; }
  const dir = Buffer.alloc(12 + nt * 16);
  dir.writeUInt32BE(0x00010000, 0); dir.writeUInt16BE(nt, 4); dir.writeUInt16BE(sr * 16, 6); dir.writeUInt16BE(es, 8); dir.writeUInt16BE(nt * 16 - sr * 16, 10);
  const body = [];
  let pos = dir.length;
  tags.forEach((t, i) => {
    const data = out[t], pad = Buffer.alloc((4 - (data.length % 4)) % 4), padded = Buffer.concat([data, pad]);
    let sum = 0;
    for (let k = 0; k < padded.length; k += 4) sum = (sum + padded.readUInt32BE(k)) >>> 0;
    const o = 12 + i * 16;
    dir.write(t, o, 4, "latin1"); dir.writeUInt32BE(sum, o + 4); dir.writeUInt32BE(pos, o + 8); dir.writeUInt32BE(data.length, o + 12);
    body.push(padded);
    pos += padded.length;
  });
  return Buffer.concat([dir, ...body]);
}

/* ---------- PDF ---------- */
const A4 = { w: 595.28, h: 841.89 };
const M = { l: 40, r: 40, t: 46, b: 50 };
const num = (x) => (Math.round(x * 100) / 100).toString();
const rgb = (c) => c.map(num).join(" ");
const cleanStr = (s) => String(s == null ? "" : s).replace(/[\u0000-\u001f\u007f]/g, " ");

class Pdf {
  constructor() {
    this.fonts = [loadFont("DejaVuSans.ttf"), loadFont("DejaVuSans-Bold.ttf")];
    this.used = [new Map(), new Map()]; // ҳарф → Unicode (ToUnicode учун)
    this.pages = [];
    this.newPage();
  }
  newPage(land = this.land) {
    this.land = !!land;
    this.W = land ? A4.h : A4.w; this.H = land ? A4.w : A4.h; this.CW = this.W - M.l - M.r;
    this.ops = []; this.pages.push({ ops: this.ops, w: this.W, h: this.H }); this.y = M.t;
  }
  glyphs(str, b) {
    const f = this.fonts[b], out = [];
    for (const ch of cleanStr(str)) {
      const cp = ch.codePointAt(0);
      let g = f.cmap.get(cp);
      if (!g) { if (cp >= 0x2000 && !/[‐-‧‰-⁞]/.test(ch)) continue; g = f.cmap.get(0x3f) || 0; } // эмодзи ва бошқа белгилар ташланади
      out.push(g);
      if (!this.used[b].has(g)) this.used[b].set(g, cp);
    }
    return out;
  }
  width(str, size, b = 0) {
    const f = this.fonts[b];
    let w = 0;
    for (const g of this.glyphs(str, b)) w += f.adv[g];
    return (w * size) / f.upem;
  }
  wrap(str, size, maxW, b = 0) {
    const lines = [];
    for (const para of cleanStr(str).split(/\s*\n\s*/)) {
      let cur = "";
      for (const word of para.split(/\s+/).filter(Boolean)) {
        const test = cur ? cur + " " + word : word;
        if (this.width(test, size, b) <= maxW) { cur = test; continue; }
        if (cur) lines.push(cur);
        if (this.width(word, size, b) <= maxW) { cur = word; continue; }
        /* жуда узун сўз (почта, код) — бўлиб ташланади */
        let piece = "";
        for (const ch of word) { if (this.width(piece + ch, size, b) > maxW && piece) { lines.push(piece); piece = ""; } piece += ch; }
        cur = piece;
      }
      lines.push(cur);
    }
    return lines.length ? lines : [""];
  }
  text(x, y, str, size, { b = 0, color = INK, align = "l", w = 0 } = {}) {
    const gs = this.glyphs(str, b);
    if (!gs.length) return;
    let tx = x;
    if (align !== "l") { const tw = this.width(str, size, b); tx = align === "r" ? x + w - tw : x + (w - tw) / 2; }
    const hex = gs.map((g) => g.toString(16).padStart(4, "0")).join("");
    this.ops.push(`BT /F${b + 1} ${num(size)} Tf ${rgb(color)} rg 1 0 0 1 ${num(tx)} ${num(this.H - y)} Tm <${hex}> Tj ET`);
  }
  rect(x, y, w, h, color) { this.ops.push(`${rgb(color)} rg ${num(x)} ${num(this.H - y - h)} ${num(w)} ${num(h)} re f`); }
  line(x1, y1, x2, y2, color = LINE, lw = 0.6) { this.ops.push(`${rgb(color)} RG ${num(lw)} w ${num(x1)} ${num(this.H - y1)} m ${num(x2)} ${num(this.H - y2)} l S`); }
  need(h) { if (this.y + h > this.H - M.b) { this.newPage(); return true; } return false; }

  /* --- блоклар --- */
  header(doc) {
    this.rect(0, 0, this.W, 108, GREEN);
    this.text(M.l, 34, "EKOMUN · БОШҚАРУВ МАРКАЗИ", 8.5, { b: 1, color: [0.75, 0.95, 0.85] });
    const tl = this.wrap(doc.title, 20, this.CW, 1);
    tl.slice(0, 2).forEach((l, i) => this.text(M.l, 60 + i * 24, l, 20, { b: 1, color: [1, 1, 1] }));
    if (doc.subtitle) this.text(M.l, 60 + Math.min(2, tl.length) * 24 - 2, doc.subtitle, 10, { color: [0.85, 0.97, 0.92] });
    this.y = 128;
    if (doc.meta && doc.meta.length) {
      const colW = this.CW / 2, kw = Math.max(...doc.meta.map(([k]) => this.width(k + ":", 8.5))) + 8;
      doc.meta.forEach(([k, v], i) => {
        const x = M.l + (i % 2) * colW, y = this.y + Math.floor(i / 2) * 15;
        this.text(x, y, k + ":", 8.5, { color: GREY });
        this.text(x + kw, y, v, 8.5, { b: 1 });
      });
      this.y += Math.ceil(doc.meta.length / 2) * 15 + 4;
    }
    if (doc.note) {
      const ls = this.wrap(doc.note, 8, this.CW - 16);
      this.rect(M.l, this.y, this.CW, ls.length * 11 + 10, [1, 0.97, 0.9]);
      ls.forEach((l, i) => this.text(M.l + 8, this.y + 14 + i * 11, l, 8, { color: [0.55, 0.35, 0.05] }));
      this.y += ls.length * 11 + 18;
    }
  }
  h1(text) {
    this.need(48);
    this.y += 12;
    this.rect(M.l, this.y - 1, 4, 16, GREEN);
    this.text(M.l + 10, this.y + 12, text, 14, { b: 1, color: GREEN });
    this.y += 26;
  }
  h2(text) { this.need(32); this.y += 6; this.text(M.l, this.y + 10, text, 11, { b: 1 }); this.y += 18; }
  para(text, size = 9.5, color = INK) {
    for (const l of this.wrap(text, size, this.CW)) { this.need(size * 1.45); this.text(M.l, this.y + size, l, size, { color }); this.y += size * 1.45; }
    this.y += 4;
  }
  list(items) {
    for (const it of items) {
      const ls = this.wrap(it, 9.5, this.CW - 14);
      this.need(ls.length * 13.5);
      this.rect(M.l + 2, this.y + 5, 4, 4, BAR);
      ls.forEach((l, i) => this.text(M.l + 14, this.y + 9.5 + i * 13.5, l, 9.5));
      this.y += ls.length * 13.5 + 3;
    }
    this.y += 4;
  }
  kpis(items) {
    const cols = 4, gap = 8, w = (this.CW - gap * (cols - 1)) / cols, h = 50;
    for (let i = 0; i < items.length; i += cols) {
      this.need(h + gap);
      items.slice(i, i + cols).forEach(([v, l], j) => {
        const x = M.l + j * (w + gap);
        this.rect(x, this.y, w, h, GREEN_LIGHT);
        this.rect(x, this.y, 3, h, BAR);
        this.text(x + 10, this.y + 21, String(v), 14, { b: 1, color: GREEN });
        this.wrap(l, 7.5, w - 16).slice(0, 2).forEach((s, k) => this.text(x + 10, this.y + 34 + k * 9, s, 7.5, { color: GREY }));
      });
      this.y += h + gap;
    }
    this.y += 4;
  }
  bars(items) {
    if (!items.length) return this.para("Маълумот йўқ.", 9, GREY);
    const max = Math.max(1, ...items.map((i) => i.v));
    const lw = this.CW * 0.36, bw = this.CW * 0.44, vw = this.CW - lw - bw - 8;
    for (const it of items) {
      this.need(15);
      const ls = this.wrap(it.n, 8.5, lw - 6);
      this.text(M.l, this.y + 9, ls[0] + (ls.length > 1 ? "…" : ""), 8.5);
      this.rect(M.l + lw, this.y + 2, bw, 8, TRACK);
      if (it.v > 0) this.rect(M.l + lw, this.y + 2, Math.max(1.5, (it.v / max) * bw), 8, it.color || BAR);
      this.text(M.l + lw + bw + 8, this.y + 9, it.label != null ? it.label : String(it.v), 8.5, { b: 1, align: "r", w: vw });
      this.y += 14;
    }
    this.y += 6;
  }
  table(t) {
    const size = t.size || 8, lh = size * 1.3, pad = 4;
    const tw = t.widths ? t.widths.reduce((a, b) => a + b, 0) : t.head.length;
    const ws = t.head.map((_, i) => ((t.widths ? t.widths[i] : 1) / tw) * this.CW);
    const al = (i) => (t.align && t.align[i]) || "l";
    const drawHead = () => {
      const hl = t.head.map((h, i) => this.wrap(h, size, ws[i] - pad * 2, 1));
      const hh = Math.max(...hl.map((l) => l.length)) * lh + pad * 2;
      this.rect(M.l, this.y, this.CW, hh, GREEN);
      let x = M.l;
      hl.forEach((ls, i) => { ls.forEach((l, k) => this.text(x + pad, this.y + pad + size + k * lh, l, size, { b: 1, color: [1, 1, 1], align: al(i), w: ws[i] - pad * 2 })); x += ws[i]; });
      this.y += hh;
    };
    if (!t.rows.length) { this.para(t.empty || "Маълумот йўқ.", 9, GREY); return; }
    this.need(40);
    drawHead();
    t.rows.forEach((row, ri) => {
      const cl = row.map((c, i) => this.wrap(c == null ? "" : String(c), size, ws[i] - pad * 2, t.boldFirst && i === 0 ? 1 : 0));
      const rh = Math.max(...cl.map((l) => l.length)) * lh + pad * 2;
      if (this.need(rh)) drawHead();
      if (ri % 2) this.rect(M.l, this.y, this.CW, rh, ZEBRA);
      let x = M.l;
      cl.forEach((ls, i) => { ls.forEach((l, k) => this.text(x + pad, this.y + pad + size + k * lh - 1, l, size, { align: al(i), w: ws[i] - pad * 2, b: t.boldFirst && i === 0 ? 1 : 0 })); x += ws[i]; });
      this.y += rh;
      this.line(M.l, this.y, M.l + this.CW, this.y);
    });
    this.y += 10;
  }

  render(doc) {
    this.header(doc);
    for (const b of doc.blocks) {
      if (b.t === "h1") this.h1(b.text);
      else if (b.t === "h2") this.h2(b.text);
      else if (b.t === "p") this.para(b.text, b.size, b.muted ? GREY : INK);
      else if (b.t === "list") this.list(b.items);
      else if (b.t === "kpis") this.kpis(b.items);
      else if (b.t === "bars") this.bars(b.items);
      else if (b.t === "table") this.table(b);
      else if (b.t === "pagebreak") this.newPage();
      else if (b.t === "landscape") this.newPage(true);
    }
    const foot = doc.footer || "Ekomun";
    this.pages.forEach((pg, i) => {
      this.ops = pg.ops; this.W = pg.w; this.H = pg.h; this.CW = pg.w - M.l - M.r;
      this.line(M.l, this.H - 34, this.W - M.r, this.H - 34);
      this.text(M.l, this.H - 22, foot, 7.5, { color: GREY });
      this.text(M.l, this.H - 22, `${i + 1} / ${this.pages.length}`, 7.5, { color: GREY, align: "r", w: this.CW });
    });
    return this.build(doc);
  }

  build(doc) {
    const objs = [];
    const add = (s) => { objs.push(s); return objs.length; };
    const stream = (dict, data) => { const z = zlib.deflateSync(data); return Buffer.concat([Buffer.from(`<< ${dict} /Length ${z.length} /Filter /FlateDecode >>\nstream\n`, "latin1"), z, Buffer.from("\nendstream", "latin1")]); };
    const fontRefs = this.fonts.map((f, b) => {
      const used = this.used[b];
      const tag = "EKOM" + (b ? "BD" : "RG") + "+" + (b ? "DejaVuSans-Bold" : "DejaVuSans");
      const file = add(stream("", subsetFont(f, used.keys())));
      const sc = (v) => Math.round((v * 1000) / f.upem);
      const desc = add(`<< /Type /FontDescriptor /FontName /${tag} /Flags 32 /FontBBox [${f.bbox.map(sc).join(" ")}] /ItalicAngle 0 /Ascent ${sc(f.ascent)} /Descent ${sc(f.descent)} /CapHeight ${sc(f.ascent)} /StemV ${b ? 120 : 80} /FontFile2 ${file} 0 R >>`);
      const gids = [...used.keys()].sort((a, c) => a - c);
      const W = gids.map((g) => `${g} [${sc(f.adv[g])}]`).join(" ");
      const cid = add(`<< /Type /Font /Subtype /CIDFontType2 /BaseFont /${tag} /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${desc} 0 R /DW 600 /W [${W}] /CIDToGIDMap /Identity >>`);
      const map = gids.filter((g) => used.get(g) <= 0xffff).map((g) => `<${g.toString(16).padStart(4, "0")}> <${used.get(g).toString(16).padStart(4, "0")}>`);
      let cm = "/CIDInit /ProcSet findresource begin\n12 dict begin\nbegincmap\n/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def\n/CMapName /Adobe-Identity-UCS def\n/CMapType 2 def\n1 begincodespacerange\n<0000> <FFFF>\nendcodespacerange\n";
      for (let i = 0; i < map.length; i += 100) cm += `${map.slice(i, i + 100).length} beginbfchar\n${map.slice(i, i + 100).join("\n")}\nendbfchar\n`;
      cm += "endcmap\nCMapName currentdict /CMap defineresource pop\nend\nend";
      const tu = add(stream("", Buffer.from(cm, "latin1")));
      return add(`<< /Type /Font /Subtype /Type0 /BaseFont /${tag} /Encoding /Identity-H /DescendantFonts [${cid} 0 R] /ToUnicode ${tu} 0 R >>`);
    });
    const pagesId = objs.length + 1 + this.pages.length * 2;
    const kids = [];
    for (const pg of this.pages) {
      const c = add(stream("", Buffer.from(pg.ops.join("\n"), "latin1")));
      kids.push(add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${pg.w} ${pg.h}] /Resources << /Font << /F1 ${fontRefs[0]} 0 R /F2 ${fontRefs[1]} 0 R >> >> /Contents ${c} 0 R >>`));
    }
    add(`<< /Type /Pages /Kids [${kids.map((k) => k + " 0 R").join(" ")}] /Count ${kids.length} >>`);
    const utf16 = (s) => "<FEFF" + Buffer.from(cleanStr(s), "utf16le").swap16().toString("hex").toUpperCase() + ">";
    const d = new Date(), pd = `D:${d.getUTCFullYear()}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}${String(d.getUTCHours()).padStart(2, "0")}${String(d.getUTCMinutes()).padStart(2, "0")}00Z`;
    const info = add(`<< /Title ${utf16(doc.title)} /Producer (Ekomun) /Creator (Ekomun) /CreationDate (${pd}) >>`);
    const cat = add(`<< /Type /Catalog /Pages ${pagesId} 0 R /Lang (uz) >>`);
    const chunks = [Buffer.from("%PDF-1.7\n%\xe2\xe3\xcf\xd3\n", "latin1")];
    let len = chunks[0].length;
    const xref = [];
    objs.forEach((o, i) => {
      const b = Buffer.concat([Buffer.from(`${i + 1} 0 obj\n`, "latin1"), Buffer.isBuffer(o) ? o : Buffer.from(o, "latin1"), Buffer.from("\nendobj\n", "latin1")]);
      xref.push(len); chunks.push(b); len += b.length;
    });
    let x = `xref\n0 ${objs.length + 1}\n0000000000 65535 f \n` + xref.map((o) => String(o).padStart(10, "0") + " 00000 n \n").join("");
    x += `trailer\n<< /Size ${objs.length + 1} /Root ${cat} 0 R /Info ${info} 0 R >>\nstartxref\n${len}\n%%EOF\n`;
    chunks.push(Buffer.from(x, "latin1"));
    return Buffer.concat(chunks);
  }
}
const pdf = (doc) => new Pdf().render(doc);

/* ---------- DOCX ---------- */
const xml = (s) => cleanStr(s).replace(/[\ud800-\udfff]/g, "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const TEXT_W = 9638; // A4, 2 см ҳошия (twip)
const HEX = { green: "047857", light: "ECFDF5", bar: "10B981", track: "E2F0EA", grey: "64748B", zebra: "F8FAFC", line: "E2E8F0" };
function run(text, o = {}) {
  const pr = [o.b ? "<w:b/>" : "", o.color ? `<w:color w:val="${o.color}"/>` : "", o.size ? `<w:sz w:val="${Math.round(o.size * 2)}"/><w:szCs w:val="${Math.round(o.size * 2)}"/>` : ""].join("");
  return `<w:r>${pr ? `<w:rPr>${pr}</w:rPr>` : ""}<w:t xml:space="preserve">${xml(text)}</w:t></w:r>`;
}
const par = (inner, o = {}) => `<w:p><w:pPr>${o.style ? `<w:pStyle w:val="${o.style}"/>` : ""}${o.keep ? "<w:keepNext/>" : ""}<w:spacing w:before="${o.before || 0}" w:after="${o.after == null ? 80 : o.after}"/>${o.jc ? `<w:jc w:val="${o.jc}"/>` : ""}</w:pPr>${inner}</w:p>`;
const cell = (w, inner, o = {}) => `<w:tc><w:tcPr><w:tcW w:w="${Math.round(w)}" w:type="dxa"/>${o.fill ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.fill}"/>` : ""}<w:vAlign w:val="center"/></w:tcPr>${inner || "<w:p/>"}</w:tc>`;
function tbl(widths, rows, o = {}) {
  const b = o.borders === false ? "" : `<w:tblBorders><w:top w:val="single" w:sz="4" w:color="${HEX.line}"/><w:bottom w:val="single" w:sz="4" w:color="${HEX.line}"/><w:insideH w:val="single" w:sz="4" w:color="${HEX.line}"/></w:tblBorders>`;
  return `<w:tbl><w:tblPr><w:tblW w:w="${Math.round(widths.reduce((a, c) => a + c, 0))}" w:type="dxa"/>${b}<w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="${o.padV || 50}" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="${o.padV || 50}" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${widths.map((w) => `<w:gridCol w:w="${Math.round(w)}"/>`).join("")}</w:tblGrid>${rows.join("")}</w:tbl>`;
}
const TEXT_W_LAND = 14570; // A4 ётиқ
const SECT = (land) => `<w:footerReference w:type="default" r:id="rIdFooter"/>${land ? '<w:pgSz w:w="16838" w:h="11906" w:orient="landscape"/>' : '<w:pgSz w:w="11906" w:h="16838"/>'}<w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/>`;
function docxBody(doc) {
  const out = [];
  let TEXT_W = 9638;
  out.push(par(run("EKOMUN · БОШҚАРУВ МАРКАЗИ", { b: true, color: HEX.green, size: 9 }), { after: 40 }));
  out.push(par(run(doc.title), { style: "Title" }));
  if (doc.subtitle) out.push(par(run(doc.subtitle, { color: HEX.grey, size: 11 }), { after: 160 }));
  if (doc.meta && doc.meta.length) {
    const w = [1800, TEXT_W / 2 - 1800, 1800, TEXT_W / 2 - 1800], rows = [];
    for (let i = 0; i < doc.meta.length; i += 2) {
      const c = [];
      for (const m of [doc.meta[i], doc.meta[i + 1]]) {
        c.push(cell(1800, par(run(m ? m[0] + ":" : "", { color: HEX.grey, size: 9 }), { after: 0 })));
        c.push(cell(TEXT_W / 2 - 1800, par(run(m ? m[1] : "", { b: true, size: 9 }), { after: 0 })));
      }
      rows.push(`<w:tr>${c.join("")}</w:tr>`);
    }
    out.push(tbl(w, rows, { borders: false, padV: 20 }));
  }
  if (doc.note) out.push(tbl([TEXT_W], [`<w:tr>${cell(TEXT_W, par(run(doc.note, { size: 8.5, color: "8C5A0D" }), { after: 0 }), { fill: "FFF7E6" })}</w:tr>`], { borders: false, padV: 80 }));
  for (const b of doc.blocks) {
    if (b.t === "h1") out.push(par(run(b.text), { style: "Heading1", keep: true }));
    else if (b.t === "h2") out.push(par(run(b.text), { style: "Heading2", keep: true }));
    else if (b.t === "p") out.push(par(run(b.text, b.muted ? { color: HEX.grey } : {})));
    else if (b.t === "list") for (const it of b.items) out.push(par(run("•  ", { color: HEX.bar, b: true }) + run(it), { after: 60 }));
    else if (b.t === "pagebreak") out.push(`<w:p><w:r><w:br w:type="page"/></w:r></w:p>`);
    else if (b.t === "landscape" && TEXT_W !== TEXT_W_LAND) { out.push(`<w:p><w:pPr><w:sectPr>${SECT(false)}</w:sectPr></w:pPr></w:p>`); TEXT_W = TEXT_W_LAND; }
    else if (b.t === "kpis") {
      const cols = 4, w = TEXT_W / cols, rows = [];
      for (let i = 0; i < b.items.length; i += cols) {
        const c = b.items.slice(i, i + cols).map(([v, l]) => cell(w, par(run(String(v), { b: true, color: HEX.green, size: 16 }), { after: 0 }) + par(run(l, { color: HEX.grey, size: 8 }), { after: 0 }), { fill: HEX.light }));
        while (c.length < cols) c.push(cell(w, ""));
        rows.push(`<w:tr>${c.join("")}</w:tr>`);
      }
      out.push(tbl(Array(cols).fill(w), rows, { padV: 90 }), par("", { after: 60 }));
    } else if (b.t === "bars") {
      if (!b.items.length) { out.push(par(run("Маълумот йўқ.", { color: HEX.grey }))); continue; }
      const max = Math.max(1, ...b.items.map((i) => i.v));
      const lw = Math.round(TEXT_W * 0.36), bw = Math.round(TEXT_W * 0.44), vw = TEXT_W - lw - bw;
      const rows = b.items.map((it) => {
        const fw = Math.max(40, Math.round(((bw - 160) * it.v) / max)), rest = Math.max(40, bw - 160 - fw);
        const bar = tbl([fw, rest], [`<w:tr><w:trPr><w:trHeight w:val="140" w:hRule="exact"/></w:trPr>${cell(fw, par("", { after: 0 }), { fill: it.v > 0 ? HEX.bar : HEX.track })}${cell(rest, par("", { after: 0 }), { fill: HEX.track })}</w:tr>`], { borders: false, padV: 0 });
        return `<w:tr>${cell(lw, par(run(it.n, { size: 9 }), { after: 0 }))}${cell(bw, bar + par("", { after: 0 }))}${cell(vw, par(run(it.label != null ? it.label : String(it.v), { b: true, size: 9 }), { after: 0, jc: "right" }))}</w:tr>`;
      });
      out.push(tbl([lw, bw, vw], rows, { borders: false, padV: 30 }), par("", { after: 60 }));
    } else if (b.t === "table") {
      if (!b.rows.length) { out.push(par(run(b.empty || "Маълумот йўқ.", { color: HEX.grey }))); continue; }
      const tw = b.widths ? b.widths.reduce((a, c) => a + c, 0) : b.head.length;
      const ws = b.head.map((_, i) => ((b.widths ? b.widths[i] : 1) / tw) * TEXT_W);
      const size = (b.size || 8) + 0.5;
      const jc = (i) => ({ r: "right", c: "center" }[(b.align && b.align[i]) || "l"] || "left");
      const head = `<w:tr><w:trPr><w:tblHeader/></w:trPr>${b.head.map((h, i) => cell(ws[i], par(run(h, { b: true, color: "FFFFFF", size }), { after: 0, jc: jc(i) }), { fill: HEX.green })).join("")}</w:tr>`;
      const rows = b.rows.map((r, ri) => `<w:tr><w:trPr><w:cantSplit/></w:trPr>${r.map((c, i) => cell(ws[i], par(run(c == null ? "" : String(c), { size, b: b.boldFirst && i === 0 }), { after: 0, jc: jc(i) }), ri % 2 ? { fill: HEX.zebra } : {})).join("")}</w:tr>`);
      out.push(tbl(ws, [head, ...rows]), par("", { after: 60 }));
    }
  }
  return { xml: out.join(""), land: TEXT_W === TEXT_W_LAND };
}
const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:eastAsia="Calibri" w:cs="Calibri"/><w:sz w:val="21"/><w:szCs w:val="21"/><w:lang w:val="uz-Cyrl-UZ"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="264" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults>
<w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/><w:qFormat/></w:style>
<w:style w:type="paragraph" w:styleId="Title"><w:name w:val="Title"/><w:basedOn w:val="Normal"/><w:qFormat/><w:pPr><w:spacing w:after="60"/></w:pPr><w:rPr><w:b/><w:color w:val="047857"/><w:sz w:val="44"/><w:szCs w:val="44"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading1"><w:name w:val="heading 1"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="320" w:after="120"/><w:pBdr><w:left w:val="single" w:sz="24" w:space="6" w:color="047857"/></w:pBdr><w:outlineLvl w:val="0"/></w:pPr><w:rPr><w:b/><w:color w:val="047857"/><w:sz w:val="30"/><w:szCs w:val="30"/></w:rPr></w:style>
<w:style w:type="paragraph" w:styleId="Heading2"><w:name w:val="heading 2"/><w:basedOn w:val="Normal"/><w:next w:val="Normal"/><w:qFormat/><w:pPr><w:keepNext/><w:spacing w:before="200" w:after="80"/><w:outlineLvl w:val="1"/></w:pPr><w:rPr><w:b/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr></w:style>
</w:styles>`;
function docx(doc) {
  const ns = `xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"`;
  const body = docxBody(doc);
  const document = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document ${ns}><w:body>${body.xml}<w:sectPr>${SECT(body.land)}</w:sectPr></w:body></w:document>`;
  const footer = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:ftr ${ns}><w:p><w:pPr><w:tabs><w:tab w:val="right" w:pos="${body.land ? TEXT_W_LAND : TEXT_W}"/></w:tabs></w:pPr>${run(doc.footer || "Ekomun", { color: HEX.grey, size: 8 })}<w:r><w:rPr><w:color w:val="${HEX.grey}"/><w:sz w:val="16"/></w:rPr><w:tab/></w:r><w:r><w:rPr><w:color w:val="${HEX.grey}"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="begin"/></w:r><w:r><w:rPr><w:color w:val="${HEX.grey}"/><w:sz w:val="16"/></w:rPr><w:instrText xml:space="preserve"> PAGE </w:instrText></w:r><w:r><w:rPr><w:color w:val="${HEX.grey}"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="separate"/></w:r><w:r><w:rPr><w:color w:val="${HEX.grey}"/><w:sz w:val="16"/></w:rPr><w:t>1</w:t></w:r><w:r><w:rPr><w:color w:val="${HEX.grey}"/><w:sz w:val="16"/></w:rPr><w:fldChar w:fldCharType="end"/></w:r></w:p></w:ftr>`;
  const now = new Date().toISOString().replace(/\.\d+Z$/, "Z");
  return zip([
    ["[Content_Types].xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`],
    ["_rels/.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`],
    ["word/_rels/document.xml.rels", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/><Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/></Relationships>`],
    ["word/document.xml", document],
    ["word/styles.xml", STYLES],
    ["word/footer1.xml", footer],
    ["docProps/core.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>${xml(doc.title)}</dc:title><dc:creator>Ekomun</dc:creator><dcterms:created xsi:type="dcterms:W3CDTF">${now}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${now}</dcterms:modified></cp:coreProperties>`],
    ["docProps/app.xml", `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>Ekomun</Application></Properties>`]
  ]);
}

/* ---------- ZIP (DOCX учун) ---------- */
const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
function crc32(b) { let c = 0xffffffff; for (let i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; }
function zip(files) {
  const d = new Date();
  const time = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1), date = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
  const local = [], central = [];
  let off = 0;
  for (const [name, content] of files) {
    const data = Buffer.from(content, "utf8"), comp = zlib.deflateRawSync(data), nm = Buffer.from(name, "utf8"), crc = crc32(data);
    const h = Buffer.alloc(30);
    h.writeUInt32LE(0x04034b50, 0); h.writeUInt16LE(20, 4); h.writeUInt16LE(0x0800, 6); h.writeUInt16LE(8, 8); h.writeUInt16LE(time, 10); h.writeUInt16LE(date, 12);
    h.writeUInt32LE(crc, 14); h.writeUInt32LE(comp.length, 18); h.writeUInt32LE(data.length, 22); h.writeUInt16LE(nm.length, 26); h.writeUInt16LE(0, 28);
    local.push(h, nm, comp);
    const c = Buffer.alloc(46);
    c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 4); c.writeUInt16LE(20, 6); c.writeUInt16LE(0x0800, 8); c.writeUInt16LE(8, 10); c.writeUInt16LE(time, 12); c.writeUInt16LE(date, 14);
    c.writeUInt32LE(crc, 16); c.writeUInt32LE(comp.length, 20); c.writeUInt32LE(data.length, 24); c.writeUInt16LE(nm.length, 28); c.writeUInt32LE(off, 42);
    central.push(c, nm);
    off += 30 + nm.length + comp.length;
  }
  const cd = Buffer.concat(central), end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0); end.writeUInt16LE(files.length, 8); end.writeUInt16LE(files.length, 10); end.writeUInt32LE(cd.length, 12); end.writeUInt32LE(off, 16);
  return Buffer.concat([...local, cd, end]);
}

module.exports = { pdf, docx };
