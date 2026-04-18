# 🙏 Vishnu Sahasranama

> **The Thousand Names of Lord Vishnu** — An interactive web application for exploring the sacred Vishnu Sahasranama from the Anushasana Parva of the Mahabharata.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)

## ✨ Features

- **📜 1,000 Divine Names** — Complete collection organized into 103 shlokas
- **🔤 Sanskrit & Transliteration** — Original Devanagari text with IAST transliteration
- **📖 English Meanings** — Detailed interpretation for each name
- **🎵 Audio Player** — Built-in chanting audio player with playback controls
- **📊 Progress Tracking** — Visual progress bar showing reading completion
- **🔍 Search** — Search across names, meanings, and transliterations
- **⌨️ Keyboard Navigation** — Arrow keys to navigate between shlokas
- **📱 Responsive Design** — Beautiful dark theme optimized for all devices
- **🚀 API Backend** — RESTful API routes for fetching shloka data

## 🛠 Tech Stack

| Layer      | Technology               |
| ---------- | ------------------------ |
| Framework  | Next.js 16 (App Router)  |
| Language   | TypeScript               |
| Styling    | Tailwind CSS 4           |
| Icons      | Lucide React             |
| Data       | JSON (static data file)  |
| Testing    | Jest + Testing Library   |

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── shlokas/
│   │       ├── route.ts          # GET /api/shlokas (list, paginate, search)
│   │       └── [id]/
│   │           └── route.ts      # GET /api/shlokas/:id (single shloka)
│   ├── layout.tsx                # Root layout with metadata
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── components/
│   ├── AudioPlayer.tsx           # Audio playback controls
│   ├── NavigationBar.tsx         # Prev/Next navigation
│   ├── ProgressBar.tsx           # Reading progress indicator
│   ├── ShlokaDisplay.tsx         # Sanskrit + transliteration + meanings
│   └── ShlokaList.tsx            # Searchable shloka directory modal
├── data/
│   └── shlokas.json              # Complete 1000 names dataset
└── types/
    └── index.ts                  # TypeScript interfaces
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd vishnu-sahasranama-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

## 🔌 API Reference

### `GET /api/shlokas`

Fetch paginated list of shlokas.

| Parameter | Type   | Default | Description                |
| --------- | ------ | ------- | -------------------------- |
| `page`    | number | 1       | Page number                |
| `limit`   | number | 10      | Items per page             |
| `search`  | string | ""      | Search query               |

### `GET /api/shlokas/:id`

Fetch a single shloka with navigation context.

**Response:**
```json
{
  "shloka": { "id": 1, "number": 1, "sanskrit": "...", "names": [...] },
  "navigation": { "prev": null, "next": { "id": 2 }, "current": 1, "total": 103 }
}
```

## 🧪 Testing

```bash
npm test
```

## 🎵 Audio Integration

The audio player supports standard audio file playback. To add real chanting audio:

1. Place MP3 files in `public/audio/` as `shloka-001.mp3`, `shloka-002.mp3`, etc.
2. The player will automatically pick them up via the `audioUrl` field in the data.

Currently, a placeholder OM-frequency tone is generated in-browser for demonstration.

## 📄 License

MIT

---

*ॐ नमो भगवते वासुदेवाय*
