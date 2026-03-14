# 🎵 Playlist AI

An AI-powered music discovery app that generates song recommendations based on your vibe, then downloads them directly to your self-hosted music library.

---

## 🧠 How It Works

1. Describe a vibe and drop some artist references in the text box
2. Claude AI analyzes your input and recommends 15 songs that match
3. Review the cards — click any song to remove it from the list
4. Hit **Download** and the songs are fetched from YouTube and added to your Navidrome library with proper metadata and album art

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| AI | Anthropic Claude API |
| Music Download | yt-dlp + ffmpeg |
| Metadata & Art | iTunes Search API |
| Music Server | Navidrome |
| Hosting | Raspberry Pi + Nginx Reverse Proxy |

---

## 📋 Prerequisites

- Node.js (v18+)
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) installed system-wide
- [ffmpeg](https://ffmpeg.org/) installed system-wide
- An [Anthropic API key](https://console.anthropic.com/)
- A running [Navidrome](https://www.navidrome.org/) instance with a music folder

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/playlist-ai.git
cd playlist-ai
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure environment variables

Create a `.env` file in the `server` folder:

```bash
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 5. Update your music folder path

In `server/index.js` update the `MUSIC_FOLDER` constant to point to your Navidrome music directory:

```javascript
const MUSIC_FOLDER = "/path/to/your/music";
```

### 6. Start the backend

```bash
cd server
node index.js
```

### 7. Start the frontend

```bash
# From the project root
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📁 Project Structure

```
playlist-ai/
├── src/
│   ├── components/
│   │   ├── SongCard.jsx        # Individual song card with animations
│   │   └── InputField.jsx      # Reusable input component
│   ├── pages/
│   │   ├── LoginPage.jsx       # Login page
│   │   └── Dashboard.jsx       # Main app interface
│   ├── App.jsx                 # Route definitions
│   └── main.jsx                # Entry point
├── server/
│   ├── index.js                # Express server + API routes
│   ├── .env                    # API keys (not committed)
│   └── package.json
├── index.html
└── package.json
```

---

## 🔌 API Routes

| Method | Route | Description |
|---|---|---|
| `POST` | `/generate` | Send a vibe, get back 15 song recommendations |
| `POST` | `/download-songs` | Download a list of songs to the music folder |

---

## ⚙️ How Downloads Work

1. yt-dlp searches YouTube for each song using `ytsearch1:Artist SongName`
2. Audio is extracted and converted to MP3
3. iTunes Search API fetches the correct album art and metadata
4. ffmpeg embeds the title, artist, album and cover art as ID3 tags
5. The file is saved to your Navidrome music folder
6. Navidrome picks it up on its next library scan

---

## 🔒 Security Notes

- The app is designed to run behind a reverse proxy with basic auth
- Your Anthropic API key lives in `server/.env` and is never exposed to the frontend
- Never commit `.env` or `spotify_token.json` to version control

---

## 🗺️ Roadmap

- [ ] Automatic Spotify token refresh
- [ ] Per-song download progress tracking via Server Sent Events
- [ ] Duplicate detection — skip songs already in the library
- [ ] Playlist folder organization in Navidrome
- [ ] Mobile responsive improvements

---

## 🙏 Acknowledgements

- [Anthropic](https://anthropic.com) for the Claude API
- [yt-dlp](https://github.com/yt-dlp/yt-dlp) for YouTube audio extraction
- [Navidrome](https://www.navidrome.org/) for the self-hosted music server
- [iTunes Search API](https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/) for song metadata
