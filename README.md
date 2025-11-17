# Clair-Obscur DataStar Monorepo

The main project of this repo is a Multiplayer minesweeper à la [Proverbs](https://store.steampowered.com/app/3083300/Proverbs/).
It’s a collaborative browser-based game demonstrating [DataStar Framework](https://data-star.dev/) capabilities with hypermedia and SSE.

- You fill find this main project in `apps/clair-obscur`.
- Scripts used to generate pixel grids are in `packages/scripts`.
- Other projects are used to demonstrate DataStar Framework capabilities with hypermedia and SSE.
  - hello-world: a simple node.js project with Datastar SSE integration
  - todo-list: a simple node.js project with Datastar
  - todo-list-for-families: a simple node.js project with Datastar SSE integration
  - stars-for-datastar: a simple node.js demonstrating how to use DataStar Framework plugins.

## Quick Start

```bash
# After installing mise version manager
mise install
pnpm install
pnpm dev             # Start all apps in dev mode
```

Other jobs are available:

```bash
pnpm lint            # Lint all projects
pnpm test            # Run all tests
```

## Tech Stack

- **Backend**: Hono, Node.js, TypeScript, Datastar TypeScript SDK
- **Frontend**: Hono TSX, Datastar, Vanilla TypeScript/CSS/HTML, Web Components
- **Architecture**: Hexagonal (Ports & Adapters) + Domain-Driven Design
- **Package Manager**: PNPM workspace monorepo

## Project Structure

```
clair-obscur-datastar/
├── .claude/                          # Claude Code configuration
├── .git/                             # Git version control
├── .vscode/                          # VS Code workspace settings
│
├── apps/                             # Applications (MPA - Multi-Page Apps)
│   ├── clair-obscur/                 # Main application
│   │   ├── src/
│   │   │   ├── home/                 # Home bounded context
│   │   │   │   ├── adapters/        # Hexagonal architecture adapters
│   │   │   │   │   ├── in/          # Inbound adapters (UI, API)
│   │   │   │   │   │   └── web/     # Web interface
│   │   │   │   │   │       ├── components/  # UI components
│   │   │   │   │   │       ├── home-controller.ts
│   │   │   │   │   │       └── home-page.tsx
│   │   │   │   │   └── out/         # Outbound adapters (DB, external services)
│   │   │   │   │       ├── pixelgrid/
│   │   │   │   │       │   ├── event-store-pixel-grid-adapter.ts
│   │   │   │   │       │   ├── pixelgrid-command.service.ts
│   │   │   │   │       │   └── pixelgrid-query.service.ts
│   │   │   │   │       └── session/
│   │   │   │   │           ├── event-store-session-adapter.ts
│   │   │   │   │           ├── hono-session-adapter.ts
│   │   │   │   │           ├── session-command.service.ts
│   │   │   │   │           ├── session-query.service.ts
│   │   │   │   │           └── session-service.ts
│   │   │   │   ├── domain/          # Business logic (isolated core)
│   │   │   │   │   └── pixel-grid.ts
│   │   │   │   └── infrastructure/  # Technical infrastructure
│   │   │   │       ├── pixelgrid/
│   │   │   │       │   ├── pixel-grid-event-store.service.ts
│   │   │   │       │   └── pixel-grid-event-store.types.ts
│   │   │   │       └── session/
│   │   │   │           ├── session-event-store.service.ts
│   │   │   │           ├── session-event-store.types.ts
│   │   │   │           ├── session-monitor.service.ts
│   │   │   │           └── session.ts
│   │   │   ├── shared/              # Shared resources across contexts
│   │   │   │   └── infrastructure/
│   │   │   │       ├── config.ts
│   │   │   │       ├── datastar-stream.ts
│   │   │   │       └── web/
│   │   │   │           └── base-layout.tsx
│   │   │   ├── assets/              # Static assets
│   │   │   │   ├── favicon/
│   │   │   │   ├── pixel-grids/     # Pixel art data files
│   │   │   │   ├── scripts/         # Client-side scripts
│   │   │   │   │   ├── datastar-community/
│   │   │   │   │   └── datastar-pro/
│   │   │   │   ├── styles/
│   │   │   │   │   └── main.css
│   │   │   │   └── web-components/  # Compiled web components
│   │   │   └── index.ts             # Application entry point
│   │   └── package.json
│   ├── hello-world/                  # Demo/example app
│   ├── stars-for-datastar/           # Demo/example app
│   ├── todo-list/                    # Demo/example app
│   └── todo-list-for-families/       # Demo/example app
│
├── packages/                         # Shared packages (workspace)
│   ├── domain/                       # Domain logic (DDD core)
│   │   ├── src/
│   │   │   ├── maybe/               # Maybe monad implementation
│   │   │   └── session/             # Session domain
│   │   │       ├── application_programming_interfaces/
│   │   │       │   ├── session-factory.ts
│   │   │       │   └── session-id-factory.ts
│   │   │       ├── service_provider_interfaces/
│   │   │       │   ├── animal-name-registry-port.ts
│   │   │       │   ├── session-persistence.ts
│   │   │       │   ├── session-read-port.ts
│   │   │       │   ├── session-repository.ts
│   │   │       │   └── session-write-port.ts
│   │   │       ├── animal-name.ts
│   │   │       └── session.ts
│   │   └── package.json
│   ├── funny-animal-generator/       # Animal name generation utility
│   │   ├── src/
│   │   └── package.json
│   ├── utils/                        # Shared utilities
│   │   ├── src/
│   │   │   ├── server/
│   │   │   ├── list.ts
│   │   │   ├── list.test.ts
│   │   │   ├── responsive.ts
│   │   │   └── index.ts
│   │   └── package.json
│   └── web-components/               # Reusable web components
│       ├── src/
│       └── package.json
│
├── docs/                             # Documentation
│   └── architecture_decision_records/  # ADRs
│
├── presentations/                    # Tech presentations/slides
│   ├── tech-session-intro-2025-10-10/
│   └── datastar-2025-10-17/
│
├── scripts/                          # Build/utility scripts
│   └── raw/                          # Raw data for processing
│
├── .env                              # Environment variables
├── .env.example                      # Environment template
├── .gitignore                        # Git ignore rules
├── .mise.toml                        # Mise configuration
├── .nvmrc                            # Node version
├── .prettierignore                   # Prettier ignore rules
├── CLAUDE.md                         # Claude AI instructions
├── eslint.config.mts                 # ESLint configuration
├── LICENSE                           # License file
├── package.json                      # Root package.json
├── pnpm-lock.yaml                    # PNPM lock file
├── pnpm-workspace.yaml               # PNPM workspace config
├── README.md                         # Project documentation
└── tsconfig.root.json                # TypeScript root config
```

