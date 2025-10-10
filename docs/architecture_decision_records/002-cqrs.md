# Architecture Decision Record ADR-002: CQRS Pattern

## Status
Exploratory

## Date
2025-10-10

## Context
We need a solid bidirectionnal reactive communication between the backend and the frontend.
SSE is already out of the box and the efficient way to do it (compared to WebSocket or WebRTC).
But SEE only emulates cycles of bidirectional communication: we stillneed to send events from the backend to the frontend and vice versa.

## Decision
We will use the CQRS pattern to achieve this.
CQRS stands for Command Query Responsibility Segregation.
It is a pattern that separates the read and write operations of a system into different models.
This is useful to achieve a better separation of concerns and to improve the performance of the system.
It is also useful to achieve a better scalability of the system.

This is a good pattern to use when we have a system that is read-heavy or write-heavy or both.
This is also a good pattern to use when we have a system that is event-driven.

This is eventually the pattern suggested by the DataStar team to handle our use case.

### Architecture & Design
- TODO **CQRS pattern**:
    - subscribe to a long-lived SSE read-onlystream on load of the application for each user, that will be used to push events to the frontends, sharing live the state of the application
    - every write try events will be sent as well via SEE, with an acknowledgement
    - the backend fully handles the state of the application, with a flat key-value store
- TO CONSIDER **Event Sourcing`**: if a lightweight event store is needed, to handle the state of the application and being able to replay events to rebuild the state of the application

### Technology Stack
- ✅ **Datastar frontend**: Use the already available Datastar frontend SDK
- ✅ **Datastar backend SDK**: Manage the state of the application with a flat key-value store and push events to the frontend

### Implementation Milestones
- separate read and write events frontend with commands and queries
- separate read and write events backend with commands and queries
- implement a clear and efficient way to handle the state of the application with a flat key-value store
- protect this cycle of bidirectional communication with a clear and efficient way

## Consequences

### Positive
- **CQRS pattern**: Better separation of concerns, better performance, better scalability

### Negative
- **CQRS pattern**: Needs refactoring and rethinking a bit of the architecture of the application


## Alternatives Considered
- **WebSocket**: Overhead, not datastar compliant, more complex to implement, less efficient
- **No pattern**: Simpler but less reliable, less maintainable, less efficient


-----------------------------------------------------------------------------------------------------------------------------

## Future Decisions and Recommendations
The following areas should be addressed in subsequent ADRs:

### Near-term Decisions
- **Event Sourcing** - work with a real bus event + store like NATS and Redis




