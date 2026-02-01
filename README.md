# Meeting Action Extractor

Extract action items and key decisions from meeting recordings.

## Features

- 🎙️ Upload audio/video recordings
- 📝 Whisper-powered transcription
- ✅ Automatic action item extraction
- 👤 Assignee and deadline detection
- 📋 Export meeting summaries

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **AI**: OpenAI Whisper + GPT-4o
- **Styling**: Tailwind CSS
- **Storage**: File-based JSON

## Getting Started

```bash
npm install
cp .env.example .env  # Add your OPENAI_API_KEY
npm run dev
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/extract` | Transcribe and extract actions |
| GET | `/api/meetings` | Get meeting history |
| GET | `/api/actions` | Get all action items |
| PATCH | `/api/actions` | Update action status |

## Demo Mode

Works without API key with sample transcript parsing.

## License

MIT
