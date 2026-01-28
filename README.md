# Similar Repos

**Use the power of AI to automatically recommend similar and interesting repositories directly on any GitHub page you visit.**

## ✨ Features

- **Smart Discovery**: Automatically displays similar projects on the GitHub repository sidebar.
- **Multi-Model Support**: Bring your own API key. Supports OpenAI, Anthropic, Google Gemini, DeepSeek, and Ollama (local).
- **Fully Customizable**: Configure recommendation quantity and custom system prompts.
- **Interactive**: Support for infinite refresh to generate new suggestions.
- **Cross-Browser**: Compatible with Chrome, Edge, and Firefox.
- **i18n**: English & Chinese support.

## 🚀 Installation

### Chrome Web Store

[Link to Store] _(Coming Soon)_

### Manual Installation

1. Download the latest release from [Releases].
2. Unzip the file.
3. Enable **"Developer mode"** in your browser's extension management page (`chrome://extensions`).
4. Click **"Load unpacked"** and select the `dist` folder.

## ⚙️ Usage

1. Install the extension.
2. Click the extension icon in the toolbar to open **Options**.
3. Select your preferred **AI Provider** (e.g., OpenAI, DeepSeek) and enter your **API Key**.
   > 🔒 **Privacy Note**: Your API Key is stored locally in your browser.
4. Visit any public GitHub repository to see recommendations.

## 🛠 Tech Stack

- **Framework**: [WXT](https://wxt.dev/) + React
- **Language**: TypeScript
- **UI**: Tailwind CSS + Radix UI
- **State Management**: Jotai
- **AI SDK**: Vercel AI SDK
- **Build Tool**: Vite

## 📂 Project Structure

```text
src/
├── assets/          # Static assets
├── components/      # React UI components
├── configs/         # App constants & defaults
├── entrypoints/     # Extension entry points
│   ├── background/  # Service workers
│   ├── content/     # Content scripts (UI injection)
│   ├── options/     # Settings page
│   └── popup/       # Toolbar popup
├── hooks/           # Custom React hooks
├── locales/         # i18n
├── services/        # AI & API services
├── types/           # TypeScript types
└── utils/           # Helper functions
```

## 💻 Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Build for production
pnpm build

# Package extension (.zip)
pnpm zip
```

## 📄 License

MIT License © 2026
