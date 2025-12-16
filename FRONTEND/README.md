# UniPath Frontend

Modern React + TypeScript + Vite frontend for the UniPath college admission predictor.

## Features

- 🎨 Beautiful, responsive UI with Tailwind CSS
- ⚡ Fast development with Vite
- 🔐 JWT Authentication
- 📊 AI-powered admission predictions
- 📱 Mobile-friendly design
- 🎯 TypeScript for type safety

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend URL:
```
VITE_API_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Create a production build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
src/
├── api/          # API client and endpoints
├── components/   # Reusable UI components
├── context/      # React context providers
├── pages/        # Page components
├── App.tsx       # Main app component
├── main.tsx      # App entry point
└── index.css     # Global styles
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **Lucide React** - Icons
