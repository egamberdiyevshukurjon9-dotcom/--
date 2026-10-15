/* Бошқарув маркази учун икки босқичли ҳимоя калитини яратади.
   Ишлатиш: node tools/admin-totp.js
   Чиққан ADMIN_TOTP_SECRET ни серверга (Render → Environment) қўшинг ва
   otpauth ҳаволасини Google Authenticator / Microsoft Authenticator иловасига киритинг. */
"use strict";
const crypto = require("node:crypto");

const A = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
const bytes = crypto.randomBytes(20);
let bits = 0, val = 0, secret = "";
for (const b of bytes) {
  val = ((val << 8) | b) & 0xffff;
  bits += 8;
  while (bits >= 5) { secret += A[(val >>> (bits - 5)) & 31]; bits -= 5; }
}
if (bits > 0) secret += A[(val << (5 - bits)) & 31];

const label = encodeURIComponent("Ekomun:admin");
const uri = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent("Ekomun")}&algorithm=SHA1&digits=6&period=30`;
console.log("ADMIN_TOTP_SECRET=" + secret);
console.log("");
console.log("Илова учун (Google Authenticator → «+» → «Калитни киритиш»):");
console.log("  Ҳисоб: Ekomun admin");
console.log("  Калит: " + secret.replace(/(.{4})/g, "$1 ").trim());
console.log("  Тури: вақтга асосланган");
console.log("");
console.log("ёки шу ҳаволани QR-кодга айлантириб сканерланг:");
console.log("  " + uri);
console.log("");
console.log("⚠️  Калитни ҳеч кимга берманг ва репозиторийга ёзманг.");
