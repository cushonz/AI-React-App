# Playlist AI 🎵

A self-hosted AI music discovery app running on a Raspberry Pi. Describe a vibe, get 15 song recommendations from Claude, review the list, and download them directly to your Navidrome music library with proper metadata and album art.

## Features

- **AI-powered recommendations** — Describe a mood or vibe and Claude recommends 15 songs, prioritizing deep cuts and lesser known tracks over obvious hits
- **Recommendation history** — Tracks every song ever recommended so Claude never repeats itself across sessions
- **iTunes metadata** — Album art and metadata automatically fetched and embedded into every downloaded file
- **Manual search** — Search for a specific song or artist via iTunes and download it directly
- **Navidrome integration** — Downloads land directly in your Navidrome music library folder as properly tagged MP3s
- **Self-hosted** — Runs entirely on a Raspberry Pi behind a reverse proxy, no third party services required beyond the Anthropic API

## Tech Stack

- **Frontend** — React + Vite + Tailwind CSS v4 + React Router
- **Backend** — Node.js + Express
- **AI** — Anthropic Claude API (`claude-opus-4-6`)
- **Download** — yt-dlp + ffmpeg
- **Metadata** — iTunes Search API
- **Music Server** — Navidrome
- **Hosting** — Raspberry Pi running OpenMediaVault, Docker, Nginx Proxy Manager

---

## Setup & Installation

### Prerequisites

- Docker and Docker Compose installed on your host machine
- An [Anthropic API key](https://console.anthropic.com/)
- Navidrome or another music server with an accessible folder path

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/playlist-ai.git
cd playlist-ai
```

### 2. Create the environment file

```bash
cp server/.env.example server/.env
```

Edit `server/.env` and add your Anthropic API key:

```env
ANTHROPIC_API_KEY=your_api_key_here
```

### 3. Create required directories

```bash
mkdir -p server/data
```

### 4. Update the music folder path

In `server/index.js`, update this line to point to your music library:

```javascript
const MUSIC_FOLDER = "/your/music/folder/path";
```

And update the volume mount in `docker-compose.yml` to match:

```yaml
- /your/music/folder/path:/your/music/folder/path
```

### 5. Start the app

```bash
docker compose up --build
```

The app will be available at `http://localhost:5173`.

### 6. Login

Default credentials:

- **Username:** `zac`
- **Password:** `zac`

> ⚠️ These are hardcoded. Do not expose this app to the public internet without updating the auth system first.

---

## API Routes

### `POST /generate`
Accepts a vibe string, asks Claude for 15 song recommendations, enriches each with iTunes metadata, and saves them to recommendation history.

**Request**
```json
{ "vibe": "late night drive, melancholic, indie" }
```

**Response**
```json
{
  "songs": [
    { "name": "Song Name", "artist": "Artist Name", "albumArt": "https://..." }
  ]
}
```

---

### `POST /download-songs`
Accepts a list of songs, downloads each from YouTube via yt-dlp, embeds metadata and album art via ffmpeg, and saves to the Navidrome music folder.

**Request**
```json
{
  "songs": [
    { "name": "Song Name", "artist": "Artist Name" }
  ]
}
```

**Response**
```json
{ "success": true, "message": "Downloaded 15 songs successfully" }
```

---

### `POST /search-itunes`
Searches the iTunes API and returns the top 5 matching songs.

**Request**
```json
{ "term": "Radiohead Creep" }
```

**Response**
```json
{
  "results": [
    { "name": "Creep", "artist": "Radiohead", "albumArt": "https://..." }
  ]
}
```

---

### `DELETE /history`
Clears the recommendation history without restarting the server.

**Response**
```json
{ "success": true, "message": "History cleared" }
```
