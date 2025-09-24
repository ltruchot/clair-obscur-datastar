# Claude

## General
- **Language Use**: Respond in the user's language, but keep all codebase content (including documentation) in US English
- **Direct and Clear Communication**: Be concise, direct, and technical. No lyricism, no verbosity, no politeness, no artificial empathy. Focus on producing and debugging correct code
- **High Quality Standards**: Maintain high standards for code correctness, quality, and readability
- **Short Iterations**: Limit code changes to one file and 50 lines maximum before requesting user confirmation
- **Accuracy and Bias**: Challenge incorrect assumptions. Don't validate errors to please the user
- **Avoid Overconfidence and Hallucinations**: Never fabricate information. Verify before claiming. Double-check all propositions and sources. Never propose partially random solutions that later prove incorrect or invented

## Workspace
- This is a PNPM workspace monorepo
- Configuration files:
    - `/pnpm-workspace.yaml`
    - `/package.json`
- Project-specific configurations:
    - `/apps/*/package.json`
    - `/packages/*/package.json`

## Architecture Overview

### Core Principle
**Protect the business domain to ensure reusability, maintainability, testability, and scalability**

### Hexagonal Architecture
We implement Hexagonal Architecture (sharing principles with Clean Architecture):
- **Ports and Adapters**: The domain core exposes ports (interfaces) while external adapters (API, DB, UI) connect through these ports, creating a hexagonal shape
- **Domain Isolation**: Business logic sits at the center, completely isolated from technical details and accessible only through defined ports
- **Maximum Testability**: Each hexagon side can be replaced with mocks/stubs, enabling domain testing without external dependencies

### Domain-Driven Design (DDD)
DDD forms the core of our Hexagonal Architecture:
- **Ubiquitous Language**: Code must reflect exact business vocabulary - every term, class, and method corresponds to domain expert language
- **Bounded Contexts**: Clear boundaries between distinct business contexts, each with its own model without forcing artificial unification
- **Aggregates and Invariants**: Protect business consistency through aggregates that encapsulate business rules and guarantee invariant preservation

### Architecture Synergy
- **Complementarity**: DDD defines WHAT to model (aggregates, entities, value objects, bounded contexts), while Hexagonal Architecture defines WHERE to place them (at the center, isolated from technical details)
- **Documentation**: Refer to ADRs in `/docs/architecture_decision_records` and `README.md`

### Technical Stack
- **Philosophy**: Hypermedia-first, server-side state and source of truth
- **Monorepo**: PNPM workspace
- **Backend**: Hono, Node.js, TypeScript, Datastar TypeScript SDK
- **Frontend**: Datastar, Vanilla TypeScript, Vanilla CSS, Vanilla Web Components, Hono HTML templates, Vanilla HTML

## Code Style
- No comments in the codebase
- All code in English
- Idiomatic TypeScript with functional programming emphasis where it improves correctness and readability
- HTML, CSS, and all code components must meet expert-level standards

## Workflow
- Never run/serve/build projects unless explicitly requested
- Always run `pnpm lint` after producing new code
- Never invent dependencies or methods. Use only existing packages (see package.json) and available values/methods
- Prefer running individual tests over full test suite for performance