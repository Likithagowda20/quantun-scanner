# Quantum-Proof Systems Scanner

A professional security dashboard that simulates TLS/cryptographic scanning of URLs to assess quantum-computing vulnerability risk levels.

## Features

- 🔍 URL scanning with simulated TLS analysis
- 📊 Risk distribution pie chart (Low / Medium / High)
- 📋 Scan history table with all past results
- 📥 CSV report download
- 🎨 Dark SOC-grade security theme

## Requirements

- **Node.js** v18 or higher — [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **bun** — [Install bun](https://bun.sh/)

## How to Run Locally

### 1. Download the project

- Go to the GitHub repository
- Click the green **Code** button → **Download ZIP**
- Extract the ZIP to a folder on your computer

### 2. Install dependencies

Open a terminal in the extracted folder and run:

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The app will open at **http://localhost:5173** in your browser.

### 4. Build for production (optional)

```bash
npm run build
```

The output will be in the `dist/` folder, ready to deploy to any static hosting service.

## Tech Stack

- **React** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Recharts** (pie chart)
- **Framer Motion** (animations)
- **shadcn/ui** (UI components)
