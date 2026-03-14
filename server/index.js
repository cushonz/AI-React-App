const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
require("dotenv").config();
const Anthropic = require("@anthropic-ai/sdk");

// ─── Client Setup ────────────────────────────────────────────────────────────

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ─── App Setup ───────────────────────────────────────────────────────────────

const app = express();
const PORT = 3001;

app.use(cors()); // Allow requests from React (different port)
app.use(express.json()); // Parse incoming JSON request bodies

// ─── Config ──────────────────────────────────────────────────────────────────

const MUSIC_FOLDER = "/home/admin/Share/Music/downloads";

// ─── Helper Functions ────────────────────────────────────────────────────────

// Fetches song metadata from iTunes for a given artist and song name
// Returns albumArt URL, album name, and artist name — or null if not found
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

// Wraps exec in a Promise so we can use async/await
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

// Downloads a single song via yt-dlp, then embeds proper ID3 tags
// and iTunes artwork using ffmpeg
async function downloadSong(artist, name) {
  // Fetch album and cover art metadata from iTunes
  const metadata = await getSongMetadata(artist, name);
  const album = metadata?.album || "Unknown Album";
  const artworkUrl = metadata?.albumArt || null;

  // Safe filename — remove characters that could break file paths
  const safeFilename = `${artist} - ${name}`.replace(/[/\\?%*:|"<>]/g, "");
  const outputPath = `${MUSIC_FOLDER}/${safeFilename}.mp3`;
  const tempPath = `${MUSIC_FOLDER}/${safeFilename}_temp.mp3`;
  const artworkPath = `/tmp/${safeFilename}.jpg`;

  // Step 1 — Download audio from YouTube as a temp file
  console.log(`Downloading: ${artist} - ${name}`);
  const downloadCommand = `yt-dlp "ytsearch1:${artist} ${name}" \
    --extract-audio \
    --audio-format mp3 \
    --audio-quality 0 \
    --no-embed-thumbnail \
    -o "${tempPath}"`;
  await executeCommand(downloadCommand);

  // Step 2 — Download iTunes artwork to a temp file
  if (artworkUrl) {
    console.log(`Fetching artwork for: ${name}`);
    // Get higher resolution artwork by replacing 100x100 with 600x600
    const highResArt = artworkUrl.replace("100x100", "600x600");
    await executeCommand(`curl -s -o "${artworkPath}" "${highResArt}"`);
  }

  // Step 3 — Embed tags and artwork using ffmpeg
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

  // Step 4 — Clean up temp files
  await executeCommand(`rm -f "${tempPath}"`);
  if (artworkUrl) await executeCommand(`rm -f "${artworkPath}"`);

  console.log(`✅ Done: ${artist} - ${name} [${album}]`);
}

// Downloads all songs in sequence (one at a time to avoid rate limiting)
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

// POST /generate
// Accepts a vibe string, asks Claude for song recommendations,
// enriches each song with album art, and returns the list to React
app.post("/generate", async (req, res) => {
  const { vibe } = req.body;

  try {
    // Ask Claude for song recommendations based on the vibe
    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `You are a music recommendation assistant with great taste. The user will describe a vibe and may mention some artists they like as reference points.

Your job is to recommend 15 songs that match the vibe. Follow these rules:
- Primarily recommend artists the user did NOT mention, but you may sprinkle in 1-2 songs from the artists they listed if they are a perfect fit
- Prioritize deep cuts and lesser known tracks over obvious hits
- Match the mood, tempo, and energy of the described vibe
- Vary the artists — don't repeat the same artist more than once

User input: "${vibe}"

Respond ONLY with a JSON array, no other text:
[{"name": "Song Name", "artist": "Artist Name"}]`,
        },
      ],
    });

    // Strip markdown code fences Claude sometimes wraps around JSON
    const rawText = message.content[0].text;
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const jsonMatch = cleaned.match(/\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("No JSON array found in Claude response");
    const songs = JSON.parse(jsonMatch[0]);
    // Fetch metadata for all songs simultaneously
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

// POST /download-songs
// Accepts a list of songs, searches YouTube for each,
// downloads them via yt-dlp into the Navidrome music folder
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

// ─── Start Server ─────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
