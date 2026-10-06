# ЭкоТаълим — Android илова (APK)

Платформа (`index.html`, `privacy.html`, `icons/`, `vendor/`) илова ичига жойланади ва
интернетсиз ишлайди. Ҳисоб, Эко-кўз, Эко-харита хабарлари ва Мактаблар сервер талаб қилади:
оффлайн нусхада кириш тугмаси яширин бўлади, қолган бўлимлар (курслар, тестлар, ўйинлар,
монография, калькулятор, челленжлар) тўлиқ ишлайди. Ҳаво сифати ва харита плиткалари
интернет бўлса юкланади.

- Android 5.0 (API 21) ва ундан юқори, telefon ва планшет.
- Пакет: `uz.ekotalim.app`, targetSdk 34.
- Сервер манзили маълум бўлгач `res/values/strings.xml` даги `server_url` ни тўлдириб,
  `VERSION_CODE` ни ошириб қайта йиғинг: интернет бўлса илова сервердаги платформани очади,
  бўлмаса ичидаги нусхани.

## Йиғиш

```sh
sudo apt-get install -y openjdk-17-jdk android-sdk-platform-23 aapt zipalign apksigner dalvik-exchange
KEYSTORE=/йўл/ekotalim-release.jks KS_PASS=парол VERSION_CODE=2 VERSION_NAME=1.1 ./android/build.sh
```

Тайёр файл: `android/build/EkoTalim-<версия>.apk`. Янгилаш ўрнатилган илова устидан
тушиши учун ҳар доим бир хил калит (keystore) билан имзоланг.
