<h1 align="center">
  Queen UI
</h1>
<p align="center">
  <b>Local UI for <a href="https://github.com/tjboudreaux/queenbee">Queen</a> – Multi-Agent Coordination</b><br>
  Dashboard for managing AI agent messaging, assignments, and reservations.
</p>
<div align="center">
  <a href="https://semver.org"><img src="https://img.shields.io/:semver-%E2%9C%93-blue.svg" alt="SemVer"></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/npm/l/queenui.svg" alt="MIT License"></a>
  <br>
  <br>
</div>

## Features

### Beads Foundation (from [beads-ui](https://github.com/mantoni/beads-ui))

- 📺 **Live updates** – Monitors the beads database for changes
- 🔎 **Issues view** – Filter and search issues, edit inline
- ⛰️ **Epics view** – Show progress per epic, expand rows, edit inline
- 🏂 **Board view** – Blocked / Ready / In progress / Closed columns
- ⌨️ **Keyboard navigation** – Navigate and edit without touching the mouse

### Queen Extensions (Planned)

- 💬 **Messages panel** – View and send agent-to-agent messages with threading
- 📋 **Assignments panel** – Track droid task assignments and status
- 📁 **Reservations panel** – Monitor file reservations and conflicts
- 🤖 **Droid status** – Live view of active agents and their current work
- 🌲 **Multi-worktree tabs** – Switch context between Git worktrees

## Setup

```sh
npm i queenui -g
# In your project directory:
queenui start --open
```

See `queenui --help` for options.

## Environment variables

- `BD_BIN`: path to the `bd` binary.
- `QUEEN_BIN`: path to the `queen` binary (for Queen-specific features).
- `QUEENUI_RUNTIME_DIR`: override runtime directory for PID/logs. Defaults to
  `$XDG_RUNTIME_DIR/queenui` or the system temp dir.
- `PORT`: overrides the listen port (default `3000`). The server binds to
  `127.0.0.1`.

## Platform notes

- macOS/Linux are fully supported. On Windows, the CLI uses `cmd /c start` to
  open URLs and relies on Node's `process.kill` semantics for stopping the
  daemon.

## Developer Workflow

- 🔨 Clone the repo and run `npm install`.
- 🚀 Start the dev server with `npm start`.
- 🔗 Alternatively, use `npm link` to link the package globally and run
  `queenui start` from any project.

## Debug Logging

- The codebase uses the `debug` package with namespaces like `queenui:*`.
- Enable logs in the browser by running in DevTools:
  - `localStorage.debug = 'queenui:*'` then reload the page
- Enable logs for Node/CLI (server, build scripts) by setting `DEBUG`:
  - `DEBUG=queenui:* queenui start`
  - `DEBUG=queenui:* node scripts/build-frontend.js`

## Architecture

Queen UI extends beads-ui with multi-agent coordination features:

```
┌─────────────────────────────────────────────────────────────┐
│                       Queen UI                               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │   Issues     │ │   Epics      │ │    Board     │  (beads)│
│  └──────────────┘ └──────────────┘ └──────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐         │
│  │  Messages    │ │ Assignments  │ │ Reservations │  (queen)│
│  └──────────────┘ └──────────────┘ └──────────────┘         │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐       │
│  │              Droid Status Bar                     │       │
│  └──────────────────────────────────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

## Related Projects

- [Queen CLI](../queen) – Go-based multi-agent coordination tooling
- [Beads](https://github.com/steveyegge/beads) – Local-first issue tracker for AI agents
- [beads-ui](https://github.com/mantoni/beads-ui) – The foundation this UI is built on

## License

MIT
