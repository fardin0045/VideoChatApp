# VideoChatApp

A full-stack real-time video chat application with friends management, one-to-one chat, group chat, onboarding, profiles, settings, and Stream-powered calling.

## Features

- Email/password authentication with secure cookie-based sessions
- Onboarding flow for profile setup
- Friends directory, friend requests, and recommended users
- Direct chat and group chat using Stream Chat
- Real-time video calling using Stream Video
- Profile editing, settings, and notifications
- Production build that serves the React frontend from the Express backend

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, Cookie Parser
- Frontend: React 19, Vite, React Router, TanStack Query, Zustand, DaisyUI, Tailwind CSS
- Realtime: Stream Chat, Stream Video

## Project Structure

```text
backend/
  src/
    controllers/
    lib/
    middleware/
    models/
    routes/
    server.js
frontend/
  src/
    components.jsx/
    hooks/
    lib/
    pages/
    store/
    App.jsx
    main.jsx
```

## Requirements

- Node.js 18 or newer
- MongoDB connection string
- Stream account with Chat and Video access

## Environment Variables

Create a `.env` file in `backend/` with:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret
NODE_ENV=development
```

Create a `.env` file in `frontend/` with:

```env
VITE_STREAM_API_KEY=your_stream_api_key
```

Notes:

- The backend code currently reads `STEAM_API_KEY` and `STEAM_API_SECRET` in `backend/src/lib/stream.js`. If you standardize the spelling to `STREAM_*`, update that file at the same time.
- The frontend uses `VITE_STREAM_API_KEY` for both Stream Chat and Stream Video clients.

## Local Development

Install dependencies:

```bash
npm install --prefix backend
npm install --prefix frontend
```

Run the backend:

```bash
npm run dev --prefix backend
```

Run the frontend:

```bash
npm run dev --prefix frontend
```

The frontend runs on `http://localhost:5173` and the backend runs on `http://localhost:5001` by default.

## Production Build

Build the frontend from the repo root:

```bash
npm run build
```

This installs dependencies for both apps and produces `frontend/dist`.

## Production Run

Start the backend in production mode after building the frontend:

```bash
NODE_ENV=production npm start
```

In production, the Express server serves the built frontend from `frontend/dist`.

## API Endpoints

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/onboarding`
- `GET /api/auth/me`

### Users

- `GET /api/users`
- `GET /api/users/friends`
- `POST /api/users/friend-request/:id`
- `PUT /api/users/friend-request/:id/accept`
- `GET /api/users/friend-requests`
- `GET /api/users/outgoing-friend-requests`

### Chat

- `GET /api/chat/token`

## Deployment Notes

- This repository includes a `render.yaml` blueprint for Render deployments.
- Use the repository root as the service root so the top-level `package.json` is available.
- Update the CORS origin in `backend/src/server.js` to match your deployed frontend URL.
- Make sure your deployment environment sets `NODE_ENV=production` and the required secret variables.
- If you deploy behind a reverse proxy, ensure cookies are forwarded correctly and HTTPS is enabled.
- MongoDB, Stream Chat, and Stream Video must all be configured before user sign-in and calling will work.

## Troubleshooting

- If the backend fails with `EADDRINUSE`, another process is already listening on the configured `PORT`.
- If login works but video chat does not, verify the Stream API key/secret pair and the frontend `VITE_STREAM_API_KEY`.
- If production routing returns 404s on refresh, confirm the backend is serving `frontend/dist` and that your host rewrites unknown routes to `index.html`.

## License

ISC