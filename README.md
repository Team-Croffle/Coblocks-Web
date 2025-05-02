# Project Structure

The `src/` directory contains all the source code for the application:

```
src/
├── assets/             # Static assets
│   ├── fonts/          # Font files
│   ├── images/         # Image files
│   ├── styles/         # Style files
│   │   └── index.css   # Global CSS styles
│   └── svgs/           # SVG files
├── components/         # Reusable UI components
│   ├── layouts/        # Layout components (header, footer, etc.)
│   └── modules/        # Functional components used across the app
│       └── i18n/       # i18next setting files
├── data/               # Data related files and models
├── hooks/              # Custom React hooks
├── lang/               # Internationalization
│   ├── locales/        # Translation files
│   └── Translation.js  # Translation utility
├── pages/              # Page components
├── services/           # API services and data fetching
├── store/              # State management
├── utils/              # Utility functions and helpers
│   └── supabase.js     # Supabase client initialization
├── App.jsx             # Main application component
└── main.jsx            # Application entry point
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
