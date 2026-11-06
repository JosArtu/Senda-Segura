# Coding agent guidance

## Project references

- [Product requirements](PRD.md): product scope, requirements, acceptance criteria, and open decisions.
- [Project context](docs/project-context.md): requirements, source documents, scope, and unresolved decisions.
- [Architecture](docs/architecture.md): navigation, component boundaries, and architecture decisions.
- [Testing](docs/testing.md): validation commands and device review steps.

## Implementation conventions

- Work in this repository and inspect its current code before changing architecture. `src/app/` is reserved for route/layout files; reusable components belong outside it.
- The current app is a navigation prototype with in-memory state. Do not silently introduce credentials, authentication gates, device permissions, or real emergency transmission.
- Use `useDemoSession` for shared demo state and `data/demo.ts` for fixtures. Keep personal values out of URLs and use fictional values in tests.
- Keep simulated states explicit. A real station acknowledgment, backend receipt, and ranger response are different events; none is implemented by a demo success screen.
- Maintain Spanish UI copy, accessible labels, scrollable layouts, and usable cancellation/back paths. Avoid adding SafeReport's unrelated authentication/upload screens.
- Read the architecture decisions and source context before implementing full-system features. Update documentation when a previously proposed contract or service becomes real.
- Run type checking, lint, and relevant navigation checks after changes. Report native/hardware/field checks separately from browser results.
