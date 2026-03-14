FROM node:20-slim AS base

RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    python3 \
    && curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
       -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS dev

COPY package*.json ./
RUN npm install

COPY server/package*.json ./server/
RUN cd server && npm install

EXPOSE 5173 3001

CMD ["sh", "-c", "npm run dev -- --host & cd server && npx nodemon --ignore 'data/' index.js"]