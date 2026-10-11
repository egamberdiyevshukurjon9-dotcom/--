package uz.ekotalim.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 * Автоматик янгиланиш.
 * Илова интернет бўлганда app/update.json ни (GitHub, main тармоғи) ўқийди:
 * - content: платформа файллари (HTML, CSS, расм). Ўзгарганлари фонда юклаб олинади,
 *   хэши текширилади ва www-next/ папкасида тайёр туради. Улар кейинги очилишда ёки
 *   «Янгилаш» тугмаси босилганда files/www/ га ўтказилади ва илова ичидаги нусхадан
 *   олдин берилади. Интернет бўлмаса — охирги юклаб олинган нусха ишлайди.
 * - apk: янги APK бўлса, юклаб олиб ўрнатишни таклиф қилади. Android қоидаси бўйича
 *   ўрнатишни фойдаланувчи тасдиқлайди.
 */
final class Updater {
    private static final String PREFS = "eko_update";
    private static final int TIMEOUT = 15000;
    private static final long MAX_CONTENT = 40L * 1024 * 1024;

    interface Progress {
        void on(int percent);
    }

    private final Context ctx;
    private final SharedPreferences prefs;
    private final File overlay, staging;

    Updater(Context c) {
        ctx = c.getApplicationContext();
        prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        overlay = new File(ctx.getFilesDir(), "www");
        staging = new File(ctx.getFilesDir(), "www-next");
    }

    /* ---------- Илова ишга тушганда (саҳифа юкланишидан олдин, UI оқимида) ---------- */

    void prepare() {
        /* Янги APK ўрнатилган бўлса, унинг ичидаги файллар янгироқ: эски юклаб олинганларни ўчирамиз */
        if (prefs.getInt("apk", 0) != BuildConfig.VERSION_CODE) {
            deleteTree(overlay);
            deleteTree(staging);
            prefs.edit().clear().putInt("apk", BuildConfig.VERSION_CODE).apply();
        }
        applyStaged();
    }

    /** Юклаб олиниб тайёр турган контентни ишга туширади. UI оқимида чақирилади. */
    synchronized boolean applyStaged() {
        File ready = new File(staging, ".ready");
        if (!ready.isFile()) return false;
        try {
            JSONObject r = new JSONObject(readText(new FileInputStream(ready)));
            JSONObject current = overlayHashes();
            JSONArray remove = r.getJSONArray("remove");
            for (int i = 0; i < remove.length(); i++) {
                String p = remove.getString(i);
                if (!safePath(p)) continue;
                new File(overlay, p).delete();
                current.remove(p);
            }
            JSONObject add = r.getJSONObject("add");
            for (Iterator<String> it = add.keys(); it.hasNext(); ) {
                String p = it.next();
                if (!safePath(p)) continue;
                File to = new File(overlay, p);
                to.getParentFile().mkdirs();
                if (!new File(staging, p).renameTo(to)) throw new IOException("rename " + p);
                current.put(p, add.getString(p));
            }
            prefs.edit().putString("overlay", current.toString())
                    .putString("content", r.getString("version")).apply();
        } catch (IOException | JSONException e) {
            /* Чала қолса, ҳаммасини тозалаб, илова ичидаги нусхага қайтамиз */
            deleteTree(overlay);
            prefs.edit().remove("overlay").remove("content").apply();
        }
        deleteTree(staging);
        return true;
    }

    /** Юклаб олинган янги нусха бўлса, шу файл (акс ҳолда null — илова ичидагиси берилади). */
    File find(String path) {
        if (!safePath(path)) return null;
        File f = new File(overlay, path);
        return f.isFile() ? f : null;
    }

    private String stagedVersion() {
        try {
            return new JSONObject(readText(new FileInputStream(new File(staging, ".ready")))).optString("version");
        } catch (IOException | JSONException e) {
            return "";
        }
    }

    boolean hasStaged() {
        return new File(staging, ".ready").isFile();
    }

    long lastCheck() {
        return prefs.getLong("checked", 0);
    }

    /* ---------- Текширув (фон оқимида) ---------- */

    JSONObject fetchManifest() throws IOException, JSONException {
        String url = BuildConfig.UPDATE_URL + "?t=" + (System.currentTimeMillis() / 60000);
        JSONObject m = new JSONObject(readText(open(url)));
        prefs.edit().putLong("checked", System.currentTimeMillis()).apply();
        return m;
    }

    /** Янги APK бўлса, унинг маълумоти; бўлмаса null. */
    static JSONObject newerApk(JSONObject manifest) {
        JSONObject apk = manifest.optJSONObject("apk");
        if (apk == null || apk.optInt("versionCode") <= BuildConfig.VERSION_CODE) return null;
        String url = apk.optString("url");
        return url.startsWith("https://") ? apk : null;
    }

    /** Ўзгарган контентни юклаб олади. Янги нусха тайёр бўлса true. */
    synchronized boolean downloadContent(JSONObject manifest) throws IOException, JSONException {
        JSONObject c = manifest.optJSONObject("content");
        if (c == null || c.optInt("minApk", 1) > BuildConfig.VERSION_CODE) return false;
        String version = c.getString("version");
        if (version.equals(prefs.getString("content", ""))) return false;
        if (version.equals(stagedVersion())) return true;
        String base = c.getString("base");
        if (!base.startsWith("https://")) return false;

        JSONObject target = c.getJSONObject("files");
        Map<String, String> bundled = bundledHashes();
        JSONObject current = overlayHashes();
        JSONObject add = new JSONObject();
        JSONArray remove = new JSONArray();

        for (Iterator<String> it = target.keys(); it.hasNext(); ) {
            String p = it.next();
            String want = target.getString(p);
            if (!safePath(p)) continue;
            if (want.equals(bundled.get(p))) {
                if (current.has(p)) remove.put(p); // илова ичидаги нусха тўғри
            } else if (!want.equals(current.optString(p))) {
                add.put(p, want);
            }
        }
        for (Iterator<String> it = current.keys(); it.hasNext(); ) {
            String p = it.next();
            if (!target.has(p)) remove.put(p);
        }

        deleteTree(staging);
        if (add.length() == 0 && remove.length() == 0) {
            prefs.edit().putString("content", version).apply();
            return false;
        }

        long total = 0;
        for (Iterator<String> it = add.keys(); it.hasNext(); ) {
            String p = it.next();
            File out = new File(staging, p);
            out.getParentFile().mkdirs();
            total += download(base + p, out, add.getString(p), MAX_CONTENT - total, null);
        }
        JSONObject ready = new JSONObject();
        ready.put("version", version).put("add", add).put("remove", remove);
        writeText(new File(staging, ".ready"), ready.toString());
        return true;
    }

    /** Янги APK'ни юклаб олади ва хэшини текширади. */
    File downloadApk(JSONObject apk, File out, Progress progress) throws IOException {
        out.getParentFile().mkdirs();
        download(apk.optString("url"), out, apk.optString("sha256"), 200L * 1024 * 1024, progress);
        return out;
    }

    /* ---------- Ёрдамчилар ---------- */

    private JSONObject overlayHashes() {
        try {
            return new JSONObject(prefs.getString("overlay", "{}"));
        } catch (JSONException e) {
            return new JSONObject();
        }
    }

    private Map<String, String> bundledHashes() throws IOException {
        Map<String, String> m = new HashMap<>();
        BufferedReader r = new BufferedReader(new InputStreamReader(ctx.getAssets().open("www.sha256"), "UTF-8"));
        String line;
        while ((line = r.readLine()) != null) {
            int sp = line.indexOf("  ");
            if (sp > 0) m.put(line.substring(sp + 2), line.substring(0, sp));
        }
        r.close();
        return m;
    }

    static boolean safePath(String p) {
        return p != null && !p.isEmpty() && p.matches("[A-Za-z0-9._\\-/]+")
                && !p.contains("..") && !p.startsWith("/");
    }

    private static InputStream open(String url) throws IOException {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(TIMEOUT);
        c.setReadTimeout(TIMEOUT);
        c.setUseCaches(false);
        c.setRequestProperty("Cache-Control", "no-cache");
        if (c.getResponseCode() != 200) {
            c.disconnect();
            throw new IOException("HTTP " + c.getResponseCode() + " " + url);
        }
        return c.getInputStream();
    }

    /** Файлни юклаб, SHA-256 ни текширади. Мос келмаса, файл ўчирилади. */
    private static long download(String url, File out, String sha, long limit, Progress progress) throws IOException {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        c.setConnectTimeout(TIMEOUT);
        c.setReadTimeout(TIMEOUT);
        c.setUseCaches(false);
        if (c.getResponseCode() != 200) {
            c.disconnect();
            throw new IOException("HTTP " + c.getResponseCode() + " " + url);
        }
        long size = c.getContentLength();
        MessageDigest md;
        try {
            md = MessageDigest.getInstance("SHA-256");
        } catch (NoSuchAlgorithmException e) {
            throw new IOException(e);
        }
        long n = 0;
        int last = -1;
        InputStream in = c.getInputStream();
        OutputStream o = new FileOutputStream(out);
        try {
            byte[] buf = new byte[32768];
            int r;
            while ((r = in.read(buf)) > 0) {
                n += r;
                if (n > limit) throw new IOException("too large");
                md.update(buf, 0, r);
                o.write(buf, 0, r);
                if (progress != null && size > 0) {
                    int pct = (int) (n * 100 / size);
                    if (pct != last) progress.on(last = pct);
                }
            }
        } finally {
            o.close();
            in.close();
        }
        if (!hex(md.digest()).equalsIgnoreCase(sha)) {
            out.delete();
            throw new IOException("sha256 " + url);
        }
        return n;
    }

    private static String hex(byte[] b) {
        StringBuilder s = new StringBuilder();
        for (byte x : b) s.append(String.format("%02x", x));
        return s.toString();
    }

    private static String readText(InputStream in) throws IOException {
        StringBuilder s = new StringBuilder();
        BufferedReader r = new BufferedReader(new InputStreamReader(in, "UTF-8"));
        char[] buf = new char[8192];
        int n;
        while ((n = r.read(buf)) > 0) s.append(buf, 0, n);
        r.close();
        return s.toString();
    }

    private static void writeText(File f, String text) throws IOException {
        OutputStream o = new FileOutputStream(f);
        o.write(text.getBytes("UTF-8"));
        o.close();
    }

    static void deleteTree(File f) {
        File[] kids = f.listFiles();
        if (kids != null) for (File k : kids) deleteTree(k);
        f.delete();
    }
}
