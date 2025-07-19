# zkMonopoly

zkMonopoly is an experimental implementation of the Monopoly board game that uses zero-knowledge and multi-party computation techniques for verifiable actions such as dice rolls. The repository contains a Colyseus based game server and a React/Babylon.js front‑end.

## Repository structure

- **frontend/** – React + Vite client used to render the game board and interface.
- **backend/** – Colyseus server handling game rooms and ZK interactions.
- **zkShuffle** – external projects required for zero-knowledge and MPC functionality. They are included as git submodules.
- **gimp/** – source images for the board and tokens.

## Getting started

### Clone with submodules

```bash
git clone --recursive <repo-url>
```

If you already cloned the repository without `--recursive`, fetch the submodules with:

```bash
git submodule update --init --recursive
```

The submodules are defined in `.gitmodules`:

```text
[submodule "zkShuffle"]
        path = zkShuffle
        url = https://github.com/minhvip08/zkShuffle.git

```

### Install dependencies

Use the root script to install packages for the root workspace and both sub projects:

```bash
npm run recursive:install
```

This runs `npm install` in the root, `frontend` and `backend` folders.

### Development

Start the front‑end dev server and the Colyseus back‑end together:

```bash
npm run dev
```

This executes the script shown in `package.json`:

```json
"dev": "concurrently \"cd frontend && npm run dev\" \"cd backend && npm run start\""
```

The backend requires Node.js 20.9 or newer and uses environment files such as `backend/.env.development`:

```text
SAMPLE=development
WS_URL=ws://localhost:3000
```

Adjust `WS_URL` if your zero‑knowledge service runs on a different address.

## License

This project is released under the MIT license.
