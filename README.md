# ChronoKwiz Frontend

A React-based frontend application for ChronoKwiz, a history trivia game where players order historical events and landmarks chronologically. The app features an interactive drag-and-drop interface that allows users to arrange historical events in the correct timeline order, with scoring based on accuracy.

## Features

- **Chronokwiz of the Day**: Daily challenges featuring historical events that must be ordered chronologically
- **Interactive Drag-and-Drop**: Intuitive interface using `@dnd-kit` for arranging historical landmarks
- **Scoring System**: Real-time scoring based on the accuracy of chronological placement
- **Modern UI**: Built with Tailwind CSS and Flowbite React components
- **Type-Safe Routing**: Uses TanStack Router for type-safe navigation

## Prerequisites

Before setting up the project, ensure you have the following installed:

### Node.js Version Management

This project requires **Node.js v20.12.0 or higher** (Vite 7.0.4 requires Node.js 20.12.0+). We recommend using **Volta** for Node.js version management:

1. **Install Volta** (recommended):
   - Visit [https://volta.sh/](https://volta.sh/)
   - Follow the installation instructions for your operating system
   - Volta will automatically manage Node.js versions based on the project configuration

2. **Alternative: nvm-windows** (Windows):
   - Download from [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)
   - Install and use: `nvm install 20.12.0` then `nvm use 20.12.0`

3. **Alternative: Official Node.js Installer**:
   - Download Node.js v20.x LTS from [https://nodejs.org/](https://nodejs.org/)
   - Install and verify with `node --version`

### Backend API

This frontend requires a functioning backend API to operate. Ensure you have:

- The ChronoKwiz backend server running and accessible
- CORS configured to allow requests from the frontend origin

## Setup Instructions

1. **Clone the repository** (if you haven't already):

   ```bash
   git clone <repository-url>
   cd history_trivia_frontend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Create environment file**:
   Create a `.env` file in the root directory with the following variable:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

   Replace `http://localhost:3000` with your actual backend API URL.

4. **Start the development server**:

   ```bash
   npm run dev
   ```

5. **Open your browser**:
   The app will be available at the URL shown in the terminal (typically `http://localhost:5173`)

## Environment Variables

The following environment variable is required:

- `VITE_API_BASE_URL`: The base URL of your backend API (e.g., `http://localhost:3000`)

Create a `.env` file in the project root with this variable. Note that Vite requires the `VITE_` prefix for environment variables to be exposed to the client-side code.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code using Prettier
- `npm test` - Run unit tests in watch mode
- `npm test -- --run` - Run unit tests once
- `npm test:ui` - Run tests with Vitest UI

## Testing

This project uses [Vitest](https://vitest.dev/) for unit testing with [React Testing Library](https://testing-library.com/react) for component testing.

### Running Tests

- **Watch mode** (default): `npm test` - Runs tests in watch mode, re-running on file changes
- **Single run**: `npm test -- --run` - Runs all tests once and exits
- **UI mode**: `npm test:ui` - Opens Vitest UI for interactive test running and debugging

### Test Coverage

The test suite currently covers:

1. **Utility Functions** (`src/utility/utility.test.ts`)
   - `processKwizPayload`: Tests event sorting and randomization
   - `getAttemptCounter`: Tests localStorage-based attempt counter retrieval
   - `incrementAttemptCounter`: Tests counter incrementing and persistence

2. **Card Component** (`src/helpers/Card.test.tsx`)
   - Renders unconfirmed cards with full descriptions
   - Renders confirmed cards with date and hint
   - Hides date when `hideDate` prop is true
   - Shows confirm button when event is moved but not confirmed

3. **GuideModal Component** (`src/helpers/GuideModal.test.tsx`)
   - Modal visibility based on `show` prop
   - Close button functionality
   - Displays game instructions (Objective, How to Play, Tips)

### Test Structure

Tests are located alongside their source files with the `.test.ts` or `.test.tsx` extension:

- `src/utility/utility.test.ts`
- `src/helpers/Card.test.tsx`
- `src/helpers/GuideModal.test.tsx`

The test setup file is located at `src/test/setup.ts` and configures the testing environment with `@testing-library/jest-dom` matchers.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite 7** - Build tool and dev server
- **TanStack Router** - Type-safe routing
- **Tailwind CSS 4** - Styling
- **Flowbite React** - UI components
- **@dnd-kit** - Drag and drop functionality
- **Axios** - HTTP client for API requests

## Project Structure

```
src/
├── api/           # API route definitions and types
├── assets/        # Static assets (SVG icons, etc.)
├── helpers/       # Reusable components (Card, SidebarMenu, etc.)
├── models/        # TypeScript types and constants
├── routes/        # TanStack Router route components
├── utility/       # Utility functions
└── main.tsx       # Application entry point
```

## Troubleshooting

### Node.js Version Issues

If you encounter `crypto.hash is not a function` error, ensure you're using Node.js v20.12.0 or higher. Check your version with:

```bash
node --version
```

### Backend Connection Issues

If the app can't connect to the backend:

- Verify the backend server is running
- Check that `VITE_API_BASE_URL` in your `.env` file is correct
- Ensure CORS is properly configured on the backend
- Check browser console for specific error messages
