# Clair-Obscur DataStar Monorepo

A mini-multiplayer-collaborative-browser-based game demonstrating [DataStar Framework](https://data-star.dev/) capabilities with hypermedia and SSE.

## Quick Start

```bash
# After installing mise version manager
mise install

# Install dependencies
pnpm install

# Development
pnpm dev             # Start all apps in dev mode
pnpm dev:apps:mpa         # Start MPA app only
pnpm dev:packages:utils       # Start Utilities lib only


# Testing
pnpm test            # Run all tests
pnpm test:apps:mpa        # Test MPA app
pnpm test:packages:utils      # Test utils package

# Code Quality
pnpm lint            # Lint all projects
```

## Project Structure

```
├── apps/
│   └── mpa/                 # Multi-page application
│       ├── src/
│       │   ├── adapters/    # External interfaces (API, DB, UI)
│       │   ├── domain/      # Business logic (isolated core)
│       │   └── ports/       # Domain interfaces
│       └── package.json
├── packages/
│   └── utils/              # Shared utilities
├── docs/
│   └── architecture_decision_records/  # Architecture decisions
├── pnpm-workspace.yaml     # Workspace configuration
└── package.json           # Root dependencies
```

## Tech Stack

- **Backend**: Hono, Node.js, TypeScript, Datastar TypeScript SDK
- **Frontend**: Datastar, Vanilla TypeScript/CSS/HTML, Web Components
- **Architecture**: Hexagonal (Ports & Adapters) + Domain-Driven Design
- **Package Manager**: PNPM workspace monorepo

