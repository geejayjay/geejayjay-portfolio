# GeeJayJay Web Portfolio

A modern web portfolio built with React, TypeScript, TailwindCSS, and Express.

## Tech Stack

- **Frontend**: React 18 + React Router 6 + TypeScript + Vite + TailwindCSS 3
- **Backend**: Express (for API or server-side needs)
- **Testing**: Vitest

## Project Structure

```
client/                   # React SPA frontend
├── pages/                # Route components (Index.tsx = home)
├── components/           # Reusable UI and section components
├── App.tsx               # App entry point and SPA routing setup
└── global.css            # TailwindCSS theming and global styles

server/                   # Express API backend (optional)
├── index.ts              # Main server setup (express config + routes)
└── routes/               # API handlers

shared/                   # Types used by both client & server
└── api.ts                # Example of shared types
```

## Development Commands

```bash
npm run dev        # Start dev server (client + server)
npm run build      # Production build
npm run start      # Start production server
npm run typecheck  # TypeScript validation
npm test           # Run Vitest tests
```

## Customization

- Edit content in `client/pages/` and `client/components/` for your own sections and info.
- Update theme colors in `client/global.css` and `tailwind.config.ts`.
- Add or remove API endpoints in `server/routes/` as needed.

---

*This project is my personal portfolio. Fork and customize for your own use!*
