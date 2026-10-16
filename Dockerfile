# Ekomun — платформа ва бошқарув маркази битта контейнерда.
#   docker build -t ekomun .
#   docker run -d -p 3000:3000 --env-file .env -v ekomun-data:/data ekomun
FROM node:22-alpine

ENV NODE_ENV=production \
    PORT=3000 \
    DATA_DIR=/data

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm cache clean --force

# Фақат сайт учун керакли файллар (.dockerignore Android, APK ва ҳужжатларни чиқариб ташлайди)
COPY server.js index.html privacy.html tekshir.html sw.js manifest.webmanifest ./
COPY admin ./admin
COPY icons ./icons
COPY vendor ./vendor
COPY tools/admin-totp.js ./tools/admin-totp.js

RUN mkdir -p /data && chown -R node:node /data
USER node
VOLUME ["/data"]
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", "server.js"]
