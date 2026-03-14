const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");

// ─── Client Setup ────────────────────────────────────────────────────────────

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── App Setup ───────────────────────────────────────────────────────────────

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ─── Config ──────────────────────────────────────────────────────────────────

const MUSIC_FOLDER = "/home/admin/Share/Music/downloads";
const HISTORY_FILE = path.join(__dirname, "..", "data", "history.json");

// ─── History Helpers ─────────────────────────────────────────────────────────

function readHistory() {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return [];
    const raw = fs.readFileSync(HISTORY_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    console.error("Error reading history:", error);
    return [];
  }
}

function appendToHistory(songs) {
  try {
    fs.mkdirSync(path.dirname(HISTORY_FILE), { recursive: true });
    const existing = readHistory();
    const timestamp = new Date().toISOString();
    const newEntries = songs.map((song) => ({
      name: song.name,
      artist: song.artist,
      recommendedAt: timestamp,
    }));
    const updated = [...existing, ...newEntries];
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(updated, null, 2));
    console.log(`History updated — ${updated.length} total songs on record`);
  } catch (error) {
    console.error("Error writing history:", error);
  }
}

// ─── Helper Functions ────────────────────────────────────────────────────────

async function getSongMetadata(artist, name) {
  try {
    const term = encodeURIComponent(`${artist} ${name}`);
    const url = `https://itunes.apple.com/search?term=${term}&limit=1&entity=song`;
    const response = await fetch(url);
    const data = await response.json();
    const result = data.results[0];
    if (!result) return null;
    return {
      albumArt: result.artworkUrl100,
      album: result.collectionName,
      artist: result.artistName,
    };
  } catch (error) {
    console.error("Error fetching song metadata:", error);
    return null;
  }
}

function executeCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function downloadSong(artist, name) {
  const metadata = await getSongMetadata(artist, name);
  const album = metadata?.album || "Unknown Album";
  const artworkUrl = metadata?.albumArt || null;

  const safeFilename = `${artist} - ${name}`.replace(/[/\\?%*:|"<>]/g, "");
  const outputPath = `${MUSIC_FOLDER}/${safeFilename}.mp3`;
  const tempPath = `${MUSIC_FOLDER}/${safeFilename}_temp.mp3`;
  const artworkPath = `/tmp/${safeFilename}.jpg`;

  console.log(`Downloading: ${artist} - ${name}`);
  const downloadCommand = `yt-dlp "ytsearch1:${artist} ${name}" \
    --extract-audio \
    --audio-format mp3 \
    --audio-quality 0 \
    --no-embed-thumbnail \
    -o "${tempPath}"`;
  await executeCommand(downloadCommand);

  if (artworkUrl) {
    console.log(`Fetching artwork for: ${name}`);
    const highResArt = artworkUrl.replace("100x100", "600x600");
    await executeCommand(`curl -s -o "${artworkPath}" "${highResArt}"`);
  }

  console.log(`Embedding tags for: ${name}`);
  const artworkInput = artworkUrl ? `-i "${artworkPath}"` : "";
  const artworkMap = artworkUrl
    ? `-map 0:a -map 1:v -c:v mjpeg -disposition:v attached_pic`
    : `-map 0:a`;

  const ffmpegCommand = `ffmpeg -y -i "${tempPath}" ${artworkInput} \
    ${artworkMap} \
    -metadata title="${name}" \
    -metadata artist="${artist}" \
    -metadata album="${album}" \
    -c:a copy \
    "${outputPath}"`;
  await executeCommand(ffmpegCommand);

  await executeCommand(`rm -f "${tempPath}"`);
  if (artworkUrl) await executeCommand(`rm -f "${artworkPath}"`);

  console.log(`✅ Done: ${artist} - ${name} [${album}]`);
}

async function downloadAll(songs) {
  for (const song of songs) {
    try {
      await downloadSong(song.artist, song.name);
    } catch (error) {
      console.error(`Failed to download ${song.artist} - ${song.name}:`, error);
    }
  }
}

// ─── Routes ──────────────────────────────────────────────────────────────────

app.post("/generate", async (req, res) => {
  const { vibe } = req.body;

  try {
    const history = readHistory();
    const historyBlock =
      history.length > 0
        ? `\n\nDo NOT recommend any of these songs — they have already been recommended before:\n${history
            .map((s) => `- "${s.name}" by ${s.artist}`)
            .join("\n")}`
        : "";

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 2048,
      messages: [
        {
          role: "user",
          content: `You are a music recommendation assistant with great taste. The user will describe a vibe and may mention some artists they like as reference points.

Your job is to recommend 15 songs that match the vibe. Follow these rules:
- Primarily recommend artists the user did NOT mention, but you may sprinkle in 1-2 songs from the artists they listed if they are a perfect fit
- Prioritize deep cuts and lesser known tracks over obvious hits
- Match the mood, tempo, and energy of the described vibe
- Vary the artists — don't repeat the same artist more than once${historyBlock}

User input: "${vibe}"

Respond ONLY with a JSON array, no other text:
[{"name": "Song Name", "artist": "Artist Name"}]`,
        },
      ],
    });

    const rawText = message.content[0].text;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const songs = JSON.parse(cleaned);

    appendToHistory(songs);

    const enrichedSongs = await Promise.all(
      songs.map(async (song) => {
        const metadata = await getSongMetadata(song.artist, song.name);
        return { ...song, albumArt: metadata?.albumArt || null };
      }),
    );

    res.json({ songs: enrichedSongs });
  } catch (error) {
    console.error("Error generating songs:", error);
    res.status(500).json({ error: "Failed to generate songs" });
  }
});

app.post("/download-songs", async (req, res) => {
  const { songs } = req.body;
  try {
    await downloadAll(songs);
    res.json({
      success: true,
      message: `Downloaded ${songs.length} songs successfully`,
    });
  } catch (error) {
    console.error("Error downloading songs:", error);
    res.status(500).json({ error: "Failed to download songs" });
  }
});

app.delete("/history", (req, res) => {
  try {
    fs.writeFileSync(HISTORY_FILE, JSON.stringify([], null, 2));
    console.log("History wiped");
    res.json({ success: true, message: "History cleared" });
  } catch (error) {
    console.error("Error clearing history:", error);
    res.status(500).json({ error: "Failed to clear history" });
  }
});

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
