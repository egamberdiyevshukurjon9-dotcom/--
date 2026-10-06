#!/usr/bin/env bash
# ЭкоТаълим Android APK'ни йиғади (Android Studio ёки Gradle шарт эмас).
#
# Керакли воситалар (Ubuntu/Debian):
#   sudo apt-get install -y openjdk-17-jdk android-sdk-platform-23 aapt zipalign apksigner dalvik-exchange
#
# Ишлатиш:
#   KEYSTORE=/йўл/ekotalim.jks KS_PASS=парол ./android/build.sh
# Сўнг: cp android/build/EkoTalim-<версия>.apk app/ && node tools/build-update.js
# KEYSTORE берилмаса ёки файл йўқ бўлса, янги калит яратилади. Илованинг кейинги
# версияларини ўрнатилган илова устидан янгилаш учун ҳар доим ШУ калит билан имзоланг.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$HERE")"
OUT="${OUT:-$HERE/build}"
# Версия android/version.properties дан олинади (муҳит ўзгарувчиси билан алмаштириш мумкин)
PROP_CODE="$(sed -n 's/^VERSION_CODE=//p' "$HERE/version.properties")"
PROP_NAME="$(sed -n 's/^VERSION_NAME=//p' "$HERE/version.properties")"
VERSION_CODE="${VERSION_CODE:-$PROP_CODE}"
VERSION_NAME="${VERSION_NAME:-$PROP_NAME}"
# Янгиланишлар манзили (app/update.json main тармоғида)
UPDATE_URL="${UPDATE_URL:-https://raw.githubusercontent.com/egamberdiyevshukurjon9-dotcom/--/main/app/update.json}"
ANDROID_JAR="${ANDROID_JAR:-/usr/lib/android-sdk/platforms/android-23/android.jar}"
KEYSTORE="${KEYSTORE:-$OUT/ekotalim-release.jks}"
KS_ALIAS="${KS_ALIAS:-ekotalim}"
KS_PASS="${KS_PASS:-}"

rm -rf "$OUT/stage" "$OUT/gen" "$OUT/classes"
mkdir -p "$OUT/stage/assets/www" "$OUT/gen" "$OUT/classes"

# 1. Платформа файллари илова ичига (рўйхат: android/content-files.txt)
grep -v -e '^#' -e '^[[:space:]]*$' "$HERE/content-files.txt" | while read -r f; do
  cp -r "$ROOT/$f" "$OUT/stage/assets/www/"
done
cp "$HERE/android-helper.js" "$OUT/stage/assets/"
# Ичидаги файллар хэши: янгиланишда фақат ўзгарган файллар юклаб олинади
(cd "$OUT/stage/assets/www" && find . -type f | sed 's|^\./||' | LC_ALL=C sort | xargs sha256sum) > "$OUT/stage/assets/www.sha256"

# 2. Ресурслар ва R.java
cat > "$OUT/gen/BuildConfig.java" <<EOF
package uz.ekotalim.app;
final class BuildConfig {
    static final String VERSION = "$VERSION_NAME";
    static final int VERSION_CODE = $VERSION_CODE;
    static final String UPDATE_URL = "$UPDATE_URL";
}
EOF
aapt package -f -m --auto-add-overlay \
  --version-code "$VERSION_CODE" --version-name "$VERSION_NAME" \
  -M "$HERE/AndroidManifest.xml" -S "$HERE/res" -A "$OUT/stage/assets" \
  -I "$ANDROID_JAR" -J "$OUT/gen" -F "$OUT/app.unsigned.apk"

# 3. Java → dex
javac -nowarn -Xlint:-options -source 8 -target 8 -encoding UTF-8 \
  -bootclasspath "$ANDROID_JAR" -d "$OUT/classes" \
  $(find "$OUT/gen" "$HERE/src" -name '*.java')
dalvik-exchange --dex --min-sdk-version=21 --output="$OUT/classes.dex" "$OUT/classes"
(cd "$OUT" && aapt add -f app.unsigned.apk classes.dex >/dev/null)

# 4. Текислаш ва имзолаш (v1 + v2 + v3)
zipalign -p -f 4 "$OUT/app.unsigned.apk" "$OUT/app.aligned.apk"
if [ ! -f "$KEYSTORE" ]; then
  [ -n "$KS_PASS" ] || KS_PASS="$(head -c 18 /dev/urandom | base64 | tr -d '/+=')"
  keytool -genkeypair -v -keystore "$KEYSTORE" -alias "$KS_ALIAS" -keyalg RSA -keysize 4096 \
    -validity 10000 -storepass "$KS_PASS" -keypass "$KS_PASS" \
    -dname "CN=EkoTalim, O=EkoTalim, C=UZ" >/dev/null 2>&1
  echo "Янги калит: $KEYSTORE  (парол: $KS_PASS) — уни сақлаб қўйинг!"
fi
[ -n "$KS_PASS" ] || { echo "KS_PASS берилмаган"; exit 1; }
APK="$OUT/EkoTalim-$VERSION_NAME.apk"
apksigner sign --ks "$KEYSTORE" --ks-key-alias "$KS_ALIAS" \
  --ks-pass "pass:$KS_PASS" --key-pass "pass:$KS_PASS" \
  --min-sdk-version 21 --out "$APK" "$OUT/app.aligned.apk"
apksigner verify --min-sdk-version 21 "$APK"
rm -f "$OUT/app.unsigned.apk" "$OUT/app.aligned.apk" "$APK.idsig"
echo "Тайёр: $APK"
