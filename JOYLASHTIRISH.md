# Ekomun веб-сайтини интернетга жойлаштириш

Платформа (`index.html`) ва бошқарув маркази (`admin/`) битта Node.js сервери (`server.js`) орқали ишлайди. Сервер ишга тушганда:

- **Платформа** — `https://сайтингиз/`
- **Бошқарув маркази (админ сайт)** — `https://сайтингиз/<ADMIN_PATH>/` ёки алоҳида доменда (`ADMIN_HOST`)
- **Сертификат текшириш** — `https://сайтингиз/tekshir`
- **Махфийлик сиёсати** — `https://сайтингиз/privacy`

Қуйидаги 4 усулдан биттасини танланг:

| Усул | Нархи | Маълумотлар сақланадими | Қачон мос |
|---|---|---|---|
| [A. Render](#a-render-энг-осон) | бепул / ~7 $ ойига | бепулда йўқ, Starter + дискда ҳа | Тез синаб кўриш, домен шарт эмас |
| [B. Railway](#b-railway) | ~5 $ ойига | Volume қўшилса ҳа | Оддий, Docker орқали |
| [C. VPS + Docker](#c-vps--docker-тавсия) | ~4–6 $ ойига | ҳа | Ўз доменингиз, тўлиқ назорат (тавсия) |
| [D. VPS Docker'сиз](#d-vps-dockerсиз-systemd--nginx) | ~4–6 $ ойига | ҳа | Docker ўрнатиб бўлмаса |

> Ҳар қандай усулда **`ADMIN_PASSWORD` мажбурий**. Усиз бошқарув марказига кириб бўлмайди.

---

## 0. Аввал: махфий созламаларни тайёрлаш

Компьютерингизда (Node.js 18+ ўрнатилган бўлса) репозиторий папкасида:

```bash
npm install
cp .env.example .env
npm run totp          # икки босқичли ҳимоя калити (ADMIN_TOTP_SECRET)
```

`.env` ичига ёзинг:

- `ADMIN_PASSWORD` — камида 12 белгили кучли парол.
- `ADMIN_PATH` — бошқаларга маълум бўлмаган манзил, масалан `/boshqaruv-7k2q` (ўзингиз ўйлаб топинг).
- `ADMIN_TOTP_SECRET` — `npm run totp` чиқарган калит. Шу калитни телефондаги **Google Authenticator** (ёки Microsoft Authenticator) иловасига «Калитни киритиш» орқали қўшинг.

`.env` файли GitHub'га юкланмайди (`.gitignore` да). Уни ҳеч кимга берманг.

Компьютерда синаб кўриш:

```bash
npm start
# Платформа:          http://localhost:3000
# Бошқарув маркази:   http://localhost:3000/boshqaruv-7k2q/
npm test              # автоматик текширув: саҳифалар, API, админ кириши
```

---

## A. Render (энг осон)

Репозиторийда тайёр `render.yaml` бор.

1. Охирги кодни `main` тармоғига бирлаштиринг (GitHub'да очиқ PR'ни **Merge** қилинг). Render `main` ни жойлаштиради.
2. https://dashboard.render.com → GitHub билан киринг.
3. **New → Blueprint** → шу репозиторийни танланг.
4. Render сўраган қийматларни ёзинг: `ADMIN_PASSWORD`, `ADMIN_PATH`, `ADMIN_TOTP_SECRET` (қолганлари ихтиёрий, бўш қолдирса бўлади).
5. **Deploy Blueprint**. 3–5 дақиқадан сўнг сайт `https://ekomun-xxxx.onrender.com` да очилади.

**Бепул режим:** 15 дақиқа ҳеч ким кирмаса сервер ухлайди (кейинги очилиш ~1 дақиқа) ва қайта ишга тушганда фойдаланувчилар ўчиб кетади. Доимий ишлаши учун: **Settings → Instance type → Starter**, **Disks → Add disk** (Mount path `/var/data`, 1 GB) ва **Environment** га `DATA_DIR=/var/data` қўшинг.

**Ўз доменингиз:** Settings → Custom Domains → `ekomun.uz` → Render кўрсатган DNS ёзувини домен провайдерингизга (масалан, uz домени сотувчисига) қўшинг. HTTPS ўзи уланади.

---

## B. Railway

Репозиторийда `Dockerfile` ва `railway.json` бор, Railway уларни ўзи танийди.

1. https://railway.com → GitHub билан киринг → **New Project → Deploy from GitHub repo** → шу репозиторий.
2. **Variables** бўлимига қўшинг: `ADMIN_PASSWORD`, `ADMIN_PATH`, `ADMIN_TOTP_SECRET`, `TRUST_PROXY=1`.
3. **Settings → Volumes → Add Volume**, Mount path: `/data` (маълумотлар сақланиши учун).
4. **Settings → Networking → Generate Domain** — `https://ekomun-production.up.railway.app` каби манзил беради. Ўз доменингизни ҳам шу ерда улайсиз.

---

## C. VPS + Docker (тавсия)

Ҳар қандай Linux сервер (Ubuntu 22.04/24.04): Hetzner, DigitalOcean, Timeweb, UzCloud ва б. Камида 1 GB RAM.

**1. Доменни серверга қаратинг.** Домен провайдерингизда `A` ёзуви: `ekomun.uz → сервер IP`. (Админ учун алоҳида домен бўлса — `admin.ekomun.uz → ўша IP`.)

**2. Серверга киринг ва Docker ўрнатинг:**

```bash
ssh root@SERVER_IP
curl -fsSL https://get.docker.com | sh
```

**3. Кодни юклаб олинг ва созланг:**

```bash
git clone https://github.com/egamberdiyevshukurjon9-dotcom/--.git ekomun
cd ekomun
cp .env.example .env
nano .env
```

`.env` да албатта:

```ini
ADMIN_PASSWORD=кучли-парол
ADMIN_PATH=/boshqaruv-7k2q
ADMIN_TOTP_SECRET=...           # npm run totp ёки: docker run --rm ekomun node tools/admin-totp.js
DOMAIN=ekomun.uz
TRUST_PROXY=1
APP_BIND=127.0.0.1
DATA_DIR=/data
```

**4. Ишга туширинг (Caddy автоматик HTTPS сертификат олади):**

```bash
docker compose --profile https up -d --build
docker compose ps          # иккала контейнер ҳам "Up", ekomun — "healthy"
```

Тайёр: `https://ekomun.uz` ва `https://ekomun.uz/boshqaruv-7k2q/`.

Доменсиз синаб кўриш учун: `docker compose up -d --build` → `http://SERVER_IP:3000` (бунда `TRUST_PROXY=0`, `APP_BIND=0.0.0.0` қолдиринг).

**Янгилаш** (GitHub'га янги код тушганда):

```bash
cd ekomun && git pull && docker compose --profile https up -d --build
```

Маълумотлар `ekomun-data` Docker томида сақланади, янгилашда ўчмайди.

**Захира нусхани компьютерга олиш:**

```bash
docker compose cp ekomun:/data/db.json ./db-$(date +%F).json
```

(Сервер ҳар куни `/data/backups/` га ўзи ҳам нусха олади, охирги 14 таси сақланади. Бошқарув марказидаги «Тизим» бўлимидан ҳам юклаб олса бўлади.)

---

## D. VPS Docker'сиз (systemd + Nginx)

```bash
# Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo bash - && sudo apt install -y nodejs nginx certbot python3-certbot-nginx

sudo useradd -r -s /usr/sbin/nologin ekomun
sudo git clone https://github.com/egamberdiyevshukurjon9-dotcom/--.git /opt/ekomun
cd /opt/ekomun && sudo npm ci --omit=dev
sudo cp .env.example .env && sudo nano .env      # DATA_DIR=/var/lib/ekomun, TRUST_PROXY=1, ADMIN_...
sudo mkdir -p /var/lib/ekomun && sudo chown ekomun /var/lib/ekomun
sudo chown root:ekomun .env && sudo chmod 640 .env

sudo cp deploy/ekomun.service /etc/systemd/system/
sudo systemctl daemon-reload && sudo systemctl enable --now ekomun

sudo cp deploy/nginx-ekomun.conf /etc/nginx/sites-available/ekomun   # server_name ни ўз доменингизга алмаштиринг
sudo ln -s /etc/nginx/sites-available/ekomun /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d ekomun.uz                                    # HTTPS
```

Журнал: `journalctl -u ekomun -f`. Янгилаш: `cd /opt/ekomun && sudo git pull && sudo npm ci --omit=dev && sudo systemctl restart ekomun`.

---

## Бошқарув марказига (админ сайтга) кириш

1. Браузерда `https://сайтингиз/<ADMIN_PATH>/` ни очинг, масалан `https://ekomun.uz/boshqaruv-7k2q/`. Охиридаги `/` муҳим эмас, сервер ўзи қўшади.
2. **Парол** — `ADMIN_PASSWORD`.
3. `ADMIN_TOTP_SECRET` берилган бўлса — телефондаги Authenticator иловасидаги **6 рақамли код**.
4. Кириш 12 соат эсда қолади, «Чиқиш» тугмаси ён панелда.

Асосий сайтда админга ҳеч қандай ҳавола йўқ, қидирув тизимлари уни кўрмайди, `/admin` манзили (агар `ADMIN_PATH` бошқа бўлса) 404 қайтаради. Кўп марта хато парол киритилса IP вақтинча тўхтатилади, ҳар бир уриниш «Блок ва хавфсизлик» бўлимида кўринади.

**Ҳимояни кучайтириш (ихтиёрий):**

- **Алоҳида домен:** `ADMIN_HOST=admin.ekomun.uz`. Шунда бошқарув маркази фақат `https://admin.ekomun.uz/` да очилади, асосий сайтда умуман бўлмайди. Caddy ишлатсангиз, `deploy/Caddyfile` даги биринчи қаторни `{$DOMAIN}, {$ADMIN_HOST} {` қилинг ва `docker compose --profile https up -d` ни қайта ишга туширинг. Render/Railway'да иккинчи доменни шу сервисга Custom Domain қилиб қўшинг.
- **Фақат ўз IP ингиздан:** `ADMIN_ALLOW_IPS=1.2.3.4` (вергул билан бир нечта). IP ингиз ўзгарувчан бўлса ишлатманг.

**Паролни ёки калитни алмаштириш:** `.env` даги (ёки Render/Railway Environment'даги) қийматни ўзгартириб, серверни қайта ишга туширинг. Эски админ сессиялари ёпилади.

---

## Жойлаштирилгандан кейин текшириш

Компьютерингиздан:

```bash
node tools/smoke-test.js https://ekomun.uz /boshqaruv-7k2q
```

Ҳамма қатор ✅ бўлиши керак. Uptime кузатуви (масалан UptimeRobot) учун манзил: `https://сайтингиз/api/health`.

## Қўшимча созламалар

| Ўзгарувчи | Нима учун |
|---|---|
| `ANTHROPIC_API_KEY` | «Эко-кўз» расм таҳлили ва мурожаат матни (platform.claude.com дан калит) |
| `CONTACT_EMAIL` | Махфийлик сиёсатида кўрсатиладиган почта |
| `ANDROID_SHA256` | Google Play (TWA) иловаси манзил сатрисиз очилиши учун |
| `BACKUP_KEEP` | Нечта кунлик захира сақлансин (асл 14) |

Тўлиқ рўйхат — `.env.example` ва `server.js` бошидаги изоҳ.

## Android илова (APK) ни сайтга улаш

Сайт манзили маълум бўлгач, `android/res/values/strings.xml` даги `server_url` га уни ёзиб (масалан `https://ekomun.uz`) янги APK йиғилса, иловада ҳам кириш, сертификатни рўйхатга олиш ва фикр юбориш сервер орқали ишлайди. Ҳозирги APK интернетсиз, серверсиз ишлайди.
