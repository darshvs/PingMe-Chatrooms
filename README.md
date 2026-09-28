# PingMe-Chatrooms

Real-time chat rooms built with **Angular 17** (frontend) and **Express + Socket.IO** (backend). Supports light/dark themes, room-based messaging, and live connection status.

## Prerequisites

- Node.js 18+ and npm
- Two terminals (one for the API, one for the Angular app)

## Project layout

| Path | Role |
|------|------|
| `chat-server/` | Express + Socket.IO server (default port **3000**) |
| `public/` | Angular client (default port **4200**) |

## Run locally

### 1. Start the chat server

```bash
cd chat-server
npm install
npm start
```

Optional environment variables:

| Variable | Default | Purpose |
|----------|---------|---------|
| `PORT` | `3000` | HTTP / Socket.IO listen port |
| `CLIENT_ORIGIN` | `http://localhost:4200` | Allowed CORS origin for the Angular app |

Health check: `http://localhost:3000/health`

### 2. Start the Angular client

```bash
cd public
npm install
npm start
```

Open **http://localhost:4200**.

Socket URL defaults to `http://localhost:3000` via `public/src/environments/environment.ts`. Change `socketUrl` there (and in `environment.prod.ts`) if the server runs elsewhere.

### 3. Production-style Angular build

```bash
cd public
npm run build
```

Output: `public/dist/ping-me/`

## Features

- Real-time messaging with Socket.IO (history on join, reconnect)
- Room join validation and suggested rooms
- Connection status indicator (connecting / connected / disconnected)
- Message timestamps and empty-state UX
- Send on Enter; messages rendered with Angular interpolation (HTML escaped)
- Light / dark theme toggle
- Active users in the current room

## Notes / limitations

- Auth is display-name only (no accounts or passwords).
- Chat history is in-memory on the server (lost on restart; capped per room).
- Do not push secrets; Firebase placeholders were removed from the runtime path.

## License

ISC (server); client is a private Angular app scaffold.
