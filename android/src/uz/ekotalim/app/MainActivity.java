package uz.ekotalim.app;

import android.Manifest;
import android.app.Activity;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Base64;
import android.view.Window;
import android.webkit.GeolocationPermissions;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

import org.json.JSONObject;

/**
 * ЭкоТаълим — Android илова.
 * Платформа (index.html ва унинг файллари) илова ичида туради ва интернетсиз ишлайди.
 * Файллар https://appassets.androidplatform.net/ манзилидан берилади (бу манзил интернетда
 * йўқ, фақат илова ичида), шунинг учун localStorage, fetch ва харита одатдагидек ишлайди.
 * res/values/strings.xml даги server_url тўлдирилса, интернет бўлганда сервердаги
 * платформа очилади (ҳисоб, Эко-кўз, харита), уланмаса — ичидаги нусха.
 * Updater: платформа ўзгарса, янги файлларни ўзи юклаб олади; янги APK бўлса, «Янгилаш» тугмаси чиқади.
 */
public class MainActivity extends Activity {
    static final String LOCAL_HOST = "appassets.androidplatform.net";
    static final String LOCAL_URL = "https://" + LOCAL_HOST + "/";

    private static final int REQ_FILE = 1, REQ_SAVE = 2, REQ_LOCATION = 3;

    private WebView web;
    private String serverUrl;
    private boolean onLocal = true;

    private ValueCallback<Uri[]> fileCallback;
    private Uri cameraUri;
    private byte[] pendingSave;
    private String pendingGeoOrigin;
    private GeolocationPermissions.Callback pendingGeoCallback;

    /* Автоматик янгиланиш */
    private static final long CHECK_EVERY = 3 * 60 * 60 * 1000L;
    private Updater updater;
    private JSONObject newApk;
    private boolean contentReady, apkDismissed, contentDismissed, checking, installing;

    @Override
    protected void onCreate(Bundle state) {
        super.onCreate(state);
        Window w = getWindow();
        w.setStatusBarColor(Color.parseColor("#15803d"));

        serverUrl = getString(R.string.server_url).trim();
        web = new WebView(this);
        web.setBackgroundColor(Color.parseColor("#f7faf7"));
        setContentView(web);

        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setDatabaseEnabled(true);
        s.setGeolocationEnabled(true);
        s.setAllowFileAccess(false);
        s.setAllowContentAccess(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        s.setUserAgentString(s.getUserAgentString() + " EkoTalimApp/" + BuildConfig.VERSION);

        web.addJavascriptInterface(new Bridge(), "EkoAndroid");
        web.setWebViewClient(new Client());
        web.setWebChromeClient(new Chrome());

        updater = new Updater(this);
        updater.prepare();
        checkForUpdates(true);

        if (state != null && web.restoreState(state) != null) return;
        if (!serverUrl.isEmpty() && isOnline()) {
            onLocal = false;
            web.loadUrl(serverUrl);
        } else {
            web.loadUrl(LOCAL_URL);
        }
    }

    @Override
    protected void onSaveInstanceState(Bundle out) {
        super.onSaveInstanceState(out);
        web.saveState(out);
    }

    @Override
    public void onBackPressed() {
        if (web.canGoBack()) web.goBack();
        else super.onBackPressed();
    }

    @Override
    protected void onPause() {
        super.onPause();
        web.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        web.onResume();
        checkForUpdates(false);
    }

    @Override
    protected void onDestroy() {
        web.destroy();
        super.onDestroy();
    }

    private boolean isOnline() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo n = cm == null ? null : cm.getActiveNetworkInfo();
        return n != null && n.isConnected();
    }

    /* ---------- Автоматик янгиланиш ---------- */

    private void checkForUpdates(boolean force) {
        if (checking || !isOnline()) return;
        if (!force && System.currentTimeMillis() - updater.lastCheck() < CHECK_EVERY) return;
        checking = true;
        new Thread(new Runnable() {
            @Override
            public void run() {
                JSONObject apk = null;
                boolean content = false;
                try {
                    JSONObject m = updater.fetchManifest();
                    apk = Updater.newerApk(m);
                    content = updater.downloadContent(m);
                } catch (Exception ignored) {
                    /* Интернет йўқ ёки сервер жавоб бермади — кейинги сафар */
                }
                final JSONObject a = apk;
                final boolean c = content;
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        checking = false;
                        if (a != null) newApk = a;
                        if (c) contentReady = true;
                        showUpdate();
                    }
                });
            }
        }).start();
    }

    /** Саҳифада янгиланиш ойнасини кўрсатади (дизайн android-helper.js да). */
    private void showUpdate() {
        if (web == null || installing) return;
        if (newApk != null && !apkDismissed) {
            web.evaluateJavascript("window.EkoUpdate&&EkoUpdate.apk(" + newApk.toString() + ")", null);
        } else if (contentReady && !contentDismissed && onLocal) {
            web.evaluateJavascript("window.EkoUpdate&&EkoUpdate.content()", null);
        }
    }

    private void js(final String code) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                web.evaluateJavascript(code, null);
            }
        });
    }

    private void installApk() {
        final JSONObject apk = newApk;
        if (apk == null || installing) return;
        installing = true;
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    /* Android 7+ файлни провайдер орқали, эскиларида ташқи папкадан беради */
                    boolean provider = Build.VERSION.SDK_INT >= 24;
                    File dir = provider ? new File(getCacheDir(), SharedFiles.DIR) : getExternalFilesDir(null);
                    if (dir == null) throw new IOException("no storage");
                    File out = new File(dir, "EkoTalim-update.apk");
                    updater.downloadApk(apk, out, new Updater.Progress() {
                        @Override
                        public void on(int percent) {
                            js("window.EkoUpdate&&EkoUpdate.progress(" + percent + ")");
                        }
                    });
                    final Uri uri = provider ? SharedFiles.uriFor(out.getName()) : Uri.fromFile(out);
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            installing = false;
                            js("window.EkoUpdate&&EkoUpdate.downloaded()");
                            Intent i = new Intent(Intent.ACTION_VIEW);
                            i.setDataAndType(uri, "application/vnd.android.package-archive");
                            i.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_ACTIVITY_NEW_TASK);
                            try {
                                startActivity(i);
                            } catch (ActivityNotFoundException e) {
                                openInBrowser(apk.optString("url"));
                            }
                        }
                    });
                } catch (Exception e) {
                    installing = false;
                    js("window.EkoUpdate&&EkoUpdate.failed()");
                }
            }
        }).start();
    }

    private void openInBrowser(String url) {
        try {
            startActivity(new Intent(Intent.ACTION_VIEW, Uri.parse(url)));
        } catch (ActivityNotFoundException e) {
            toast("Браузер топилмади");
        }
    }

    private void toast(String msg) {
        Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
    }

    private boolean isOwnHost(Uri u) {
        String h = u.getHost();
        if (h == null) return false;
        if (h.equals(LOCAL_HOST)) return true;
        if (serverUrl.isEmpty()) return false;
        return h.equalsIgnoreCase(Uri.parse(serverUrl).getHost());
    }

    /* ---------- Илова ичидаги файлларни бериш ---------- */

    private static final Map<String, String> MIME = new HashMap<>();
    static {
        MIME.put("html", "text/html");
        MIME.put("js", "text/javascript");
        MIME.put("css", "text/css");
        MIME.put("json", "application/json");
        MIME.put("webmanifest", "application/manifest+json");
        MIME.put("svg", "image/svg+xml");
        MIME.put("png", "image/png");
        MIME.put("jpg", "image/jpeg");
        MIME.put("jpeg", "image/jpeg");
        MIME.put("webp", "image/webp");
        MIME.put("ico", "image/x-icon");
        MIME.put("woff2", "font/woff2");
        MIME.put("txt", "text/plain");
    }

    private static String readAll(InputStream in) throws IOException {
        ByteArrayOutputStream b = new ByteArrayOutputStream();
        byte[] buf = new byte[16384];
        int n;
        while ((n = in.read(buf)) > 0) b.write(buf, 0, n);
        in.close();
        return b.toString("UTF-8");
    }

    private WebResourceResponse respond(int code, String reason, String mime, InputStream body) {
        Map<String, String> h = new HashMap<>();
        h.put("Cache-Control", "no-cache");
        String enc = mime.startsWith("text/") || mime.contains("json") || mime.contains("javascript") ? "utf-8" : null;
        return new WebResourceResponse(mime, enc, code, reason, h, body);
    }

    private WebResourceResponse json(int code, String reason, String body) {
        try {
            return respond(code, reason, "application/json", new ByteArrayInputStream(body.getBytes("UTF-8")));
        } catch (IOException e) {
            return null;
        }
    }

    private WebResourceResponse serveLocal(Uri u) {
        String path = u.getPath() == null ? "/" : u.getPath();
        /* Ҳисоб, Эко-кўз, харита каби сервер функциялари: илова ичида сервер йўқ */
        if (path.startsWith("/api/")) {
            return json(503, "Service Unavailable",
                    "{\"error\":\"Бу функция учун сервер керак. Илованинг оффлайн нусхасида у ишламайди.\"}");
        }
        if (path.equals("/") || path.equals("/index.html")) path = "/index.html";
        else if (path.equals("/privacy")) path = "/privacy.html";
        else if (path.equals("/orol") || path.equals("/orol.html")) path = "/index.html"; // Орол саҳифаси олиб ташланди
        if (path.contains("..")) return json(404, "Not Found", "{}");
        String file = "www" + path;
        String ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase(Locale.ROOT);
        String mime = MIME.containsKey(ext) ? MIME.get(ext) : "application/octet-stream";
        try {
            /* Юклаб олинган янги нусха бўлса — уни, бўлмаса илова ичидагисини берамиз */
            File fresh = updater.find(path.substring(1));
            InputStream in = fresh != null ? new FileInputStream(fresh) : getAssets().open(file);
            if (path.endsWith(".html")) {
                /* Юклаб олиш тугмалари WebView'да ишлаши учун кичик ёрдамчи қўшилади */
                String html = readAll(in);
                String helper = readAll(getAssets().open("android-helper.js"));
                int at = html.indexOf("<head>");
                html = at < 0 ? "<script>" + helper + "</script>" + html
                        : html.substring(0, at + 6) + "<script>" + helper + "</script>" + html.substring(at + 6);
                in = new ByteArrayInputStream(html.getBytes("UTF-8"));
            }
            return respond(200, "OK", mime, in);
        } catch (IOException e) {
            return json(404, "Not Found", "{\"error\":\"Топилмади\"}");
        }
    }

    private class Client extends WebViewClient {
        @Override
        public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest req) {
            Uri u = req.getUrl();
            if (LOCAL_HOST.equals(u.getHost())) return serveLocal(u);
            return null;
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            Uri u = Uri.parse(url);
            String scheme = u.getScheme() == null ? "" : u.getScheme();
            if ((scheme.equals("https") || scheme.equals("http")) && isOwnHost(u)) return false;
            try {
                Intent i = scheme.equals("intent") ? Intent.parseUri(url, Intent.URI_INTENT_SCHEME)
                        : new Intent(Intent.ACTION_VIEW, u);
                i.addCategory(Intent.CATEGORY_BROWSABLE);
                startActivity(i);
            } catch (Exception e) {
                toast("Ҳаволани очиб бўлмади");
            }
            return true;
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            /* Сервердаги нусхада ҳам юклаб олиш ишласин */
            if (!url.startsWith(LOCAL_URL)) {
                try {
                    view.evaluateJavascript(readAll(getAssets().open("android-helper.js")), null);
                } catch (IOException ignored) {
                }
            }
            showUpdate();
        }

        @Override
        @SuppressWarnings("deprecation")
        public void onReceivedError(WebView view, int code, String desc, String failingUrl) {
            /* Сервер очилмаса — илова ичидаги нусхага ўтамиз */
            if (!onLocal && failingUrl != null && failingUrl.startsWith(serverUrl)) {
                onLocal = true;
                view.loadUrl(LOCAL_URL);
            }
        }
    }

    /* ---------- Расм танлаш / камера, жойлашув ---------- */

    private class Chrome extends WebChromeClient {
        @Override
        public boolean onShowFileChooser(WebView view, ValueCallback<Uri[]> cb, FileChooserParams params) {
            if (fileCallback != null) fileCallback.onReceiveValue(null);
            fileCallback = cb;
            cameraUri = null;

            Intent camera = null;
            boolean images = false;
            for (String t : params.getAcceptTypes()) if (t != null && t.startsWith("image")) images = true;
            if (images) {
                File dir = new File(getCacheDir(), SharedFiles.DIR);
                dir.mkdirs();
                String name = "photo-" + System.currentTimeMillis() + ".jpg";
                cameraUri = SharedFiles.uriFor(name);
                camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
                camera.putExtra(MediaStore.EXTRA_OUTPUT, cameraUri);
                camera.setClipData(ClipData.newRawUri("", cameraUri));
                camera.addFlags(Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_READ_URI_PERMISSION);
            }

            Intent pick = new Intent(Intent.ACTION_GET_CONTENT);
            pick.addCategory(Intent.CATEGORY_OPENABLE);
            pick.setType(images ? "image/*" : "*/*");

            Intent launch;
            if (camera != null && params.isCaptureEnabled()) {
                launch = camera;
            } else if (camera != null) {
                launch = Intent.createChooser(pick, "Расм танланг");
                launch.putExtra(Intent.EXTRA_INITIAL_INTENTS, new Intent[]{camera});
            } else {
                launch = Intent.createChooser(pick, "Файл танланг");
            }
            try {
                startActivityForResult(launch, REQ_FILE);
            } catch (ActivityNotFoundException e) {
                try {
                    cameraUri = null;
                    startActivityForResult(Intent.createChooser(pick, "Расм танланг"), REQ_FILE);
                } catch (ActivityNotFoundException e2) {
                    fileCallback = null;
                    toast("Расм танлаш учун илова топилмади");
                    return false;
                }
            }
            return true;
        }

        @Override
        public void onGeolocationPermissionsShowPrompt(String origin, GeolocationPermissions.Callback cb) {
            if (Build.VERSION.SDK_INT < 23
                    || checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                    || checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                cb.invoke(origin, true, false);
                return;
            }
            pendingGeoOrigin = origin;
            pendingGeoCallback = cb;
            requestPermissions(new String[]{Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION}, REQ_LOCATION);
        }
    }

    @Override
    public void onRequestPermissionsResult(int code, String[] perms, int[] results) {
        if (code != REQ_LOCATION || pendingGeoCallback == null) return;
        boolean ok = false;
        for (int r : results) if (r == PackageManager.PERMISSION_GRANTED) ok = true;
        pendingGeoCallback.invoke(pendingGeoOrigin, ok, false);
        pendingGeoCallback = null;
    }

    @Override
    protected void onActivityResult(int code, int result, Intent data) {
        if (code == REQ_FILE) {
            if (fileCallback == null) return;
            Uri[] picked = null;
            if (result == RESULT_OK) {
                if (data != null && data.getData() != null) {
                    picked = new Uri[]{data.getData()};
                } else if (data != null && data.getClipData() != null && data.getClipData().getItemCount() > 0
                        && !data.getClipData().getItemAt(0).getUri().equals(cameraUri)) {
                    ClipData c = data.getClipData();
                    picked = new Uri[c.getItemCount()];
                    for (int i = 0; i < c.getItemCount(); i++) picked[i] = c.getItemAt(i).getUri();
                } else if (cameraUri != null && SharedFiles.fileFor(this, cameraUri).length() > 0) {
                    picked = new Uri[]{cameraUri};
                }
            }
            fileCallback.onReceiveValue(picked);
            fileCallback = null;
        } else if (code == REQ_SAVE) {
            byte[] bytes = pendingSave;
            pendingSave = null;
            if (result != RESULT_OK || data == null || data.getData() == null || bytes == null) return;
            try {
                OutputStream out = getContentResolver().openOutputStream(data.getData());
                out.write(bytes);
                out.close();
                toast("Сақланди ✓");
            } catch (Exception e) {
                toast("Файлни сақлаб бўлмади");
            }
        } else {
            super.onActivityResult(code, result, data);
        }
    }

    /* ---------- JavaScript билан алоқа: юклаб олиш ---------- */

    private class Bridge {
        @JavascriptInterface
        public void save(final String name, final String mime, final String base64) {
            final byte[] bytes;
            try {
                bytes = Base64.decode(base64, Base64.DEFAULT);
            } catch (IllegalArgumentException e) {
                return;
            }
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    pendingSave = bytes;
                    Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType(mime == null || mime.isEmpty() ? "application/octet-stream" : mime);
                    i.putExtra(Intent.EXTRA_TITLE, name == null || name.isEmpty() ? "EkoTalim" : name);
                    try {
                        startActivityForResult(i, REQ_SAVE);
                    } catch (ActivityNotFoundException e) {
                        pendingSave = null;
                        toast("Файлни сақлаш учун илова топилмади");
                    }
                }
            });
        }

        /* Янгиланиш ойнасидаги тугмалар */
        @JavascriptInterface
        public void installUpdate() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    installApk();
                }
            });
        }

        @JavascriptInterface
        public void applyContent() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    contentReady = false;
                    if (updater.applyStaged()) web.reload();
                }
            });
        }

        @JavascriptInterface
        public void dismissUpdate(final boolean apk) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (apk) apkDismissed = true;
                    else contentDismissed = true;
                    /* APK рад этилса, тайёр контент янгиланишини кўрсатамиз */
                    if (apk) showUpdate();
                }
            });
        }

        @JavascriptInterface
        public String version() {
            return BuildConfig.VERSION;
        }

        @JavascriptInterface
        public boolean isApp() {
            return true;
        }
    }
}
