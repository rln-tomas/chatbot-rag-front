# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ChatBotRAGFront is a React-based frontend application built with Vite. This is currently a minimal starter template intended for chatbot RAG (Retrieval-Augmented Generation) functionality.

## Development Commands

### Setup
```bash
npm install
```

### Development
```bash
npm run dev          # Start development server with HMR
npm run preview      # Preview production build locally
```

### Build & Lint
```bash
npm run build        # Build for production
npm run lint         # Run ESLint on all files
```

## Architecture

### Technology Stack
- **React 19.1.1** - UI library with latest features
- **Vite 7.1.7** - Build tool and dev server with HMR
- **Tailwind CSS 4.1.17** - Utility-first CSS framework with Vite plugin
- **React Router 7.9.5** - Client-side routing and navigation
- **Zustand 5.0.8** - Lightweight state management solution
- **Axios 1.13.2** - Promise-based HTTP client for API requests
- **ESLint** - Code linting with React Hooks and React Refresh plugins

### Project Structure
- `src/main.jsx` - Application entry point, renders App component in StrictMode
- `src/App.jsx` - Main application component (currently template boilerplate)
- `public/` - Static assets served as-is
- `index.html` - HTML entry point for Vite

### ESLint Configuration
The project uses ESLint with flat config format (`eslint.config.js`):
- Extends recommended JavaScript and React configs
- Enforces React Hooks rules (recommended-latest)
- Enforces React Refresh rules for Vite
- Custom rule: allows unused variables with uppercase names (pattern: `^[A-Z_]`)
- Ignores `dist` directory

### Key Dependencies & Usage

**State Management (Zustand)**
- Lightweight alternative to Redux/Context API
- Use for global application state (user sessions, chat history, etc.)
- Minimal boilerplate with hooks-based API

**Routing (React Router v7)**
- Client-side navigation between chat views, settings, etc.
- Version 7 includes data loading patterns and improved type safety

**HTTP Client (Axios)**
- Used for API communication with RAG backend
- Handles requests to chatbot/LLM endpoints
- Built-in request/response interceptors for auth tokens, error handling

**Styling (Tailwind CSS v4)**
- Utility-first CSS approach
- Vite plugin enabled for optimal performance
- Use for responsive chatbot UI components

### Development Notes
- React compiler is intentionally not enabled (impacts dev/build performance)
- Uses Babel-based Fast Refresh via `@vitejs/plugin-react`
- Tailwind CSS v4 uses new Vite plugin (`@tailwindcss/vite`)
