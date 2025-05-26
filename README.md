# Cobblox - Interactive Coding Learning Platform

A modern web application built with React and Vite that provides an interactive coding learning environment using block-based programming.

## Features

- **Block-based Coding**: Interactive coding environment using Blockly
- **Real-time Collaboration**: Live classroom features with Socket.IO
- **Multi-language Support**: Internationalization with i18next (supports Korean, English, Japanese, Chinese, German, French, and Spanish)
- **User Authentication**: Secure authentication system using Supabase
- **Classroom Management**: Create and join virtual classrooms
- **Interactive Workspace**: Real-time code sharing and collaboration
- **Interactive Stage**: Visual representation of code execution with Phaser.js

## Project Structure

The `src/` directory contains all the source code for the application:

```
src/
├── assets/                 # Static assets
│   ├── images/            # Image files
│   └── styles/            # Style files
│       ├── App.css        # App-specific styles
│       └── index.css      # Global styles
├── components/            # Reusable UI components
│   ├── layouts/           # Layout components
│   │   ├── ClassroomLayout.jsx
│   │   └── NavigationBar.jsx
│   └── modules/          # Functional components
│       ├── blockly/      # Blockly editor components
│       ├── i18n/         # i18n configuration
│       ├── modal/        # Modal components
│       └── SelectLanguages/
├── contexts/             # React contexts
│   ├── ClassroomContext.js
│   └── ClassroomContextProvider.jsx
├── data/                 # Static data files
├── langs/                # Internationalization
│   ├── locales/         # Translation files
│   └── Translation.js   # Translation utilities
├── pages/               # Page components
│   ├── auth/           # Authentication pages
│   ├── classroom/      # Classroom-related pages
│   ├── contact/        # Contact pages
│   ├── developerInfo/  # Developer information
│   └── intro/          # Introduction pages
├── services/           # API and socket services
├── utils/             # Utility functions
├── App.jsx            # Main application component
└── main.jsx          # Application entry point
```

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```
VITE_API_URL=your_api_url
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RUNNING_MODE=development
```

## Development

To start the development server:

```bash
npm run dev
```

For production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Components

### BlocklyStage

The `BlocklyStage` component is a visual representation of the code execution environment. It uses Phaser.js to render a grid-based stage where a character can move and interact with objects.

#### Props

- `jsCode` (string): JavaScript code to be executed in the stage
- `initialStage` (object|string): Stage data in JSON or XML format

#### Usage

```jsx
import BlocklyStage from '@/components/modules/blockly/BlocklyStage';
import stageData from '@/data/StageTest.json';

// Using a JSON object
<BlocklyStage initialStage={stageData} />

// Using a JSON string
<BlocklyStage initialStage={JSON.stringify(stageData)} />

// Using an XML string
<BlocklyStage initialStage={`<stage width="8" height="7">...</stage>`} />
```

For more details on the stage data structure, see the [BlocklyStage documentation](./src/docs/BLOCKLY_STAGE.md).

## React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.