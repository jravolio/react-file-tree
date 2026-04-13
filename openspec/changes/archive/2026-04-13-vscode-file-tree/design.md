## Context

VS Code's file explorer is built on a layered architecture: a generic virtual-scrolling List widget, on top of which sits a Tree abstraction (IndexTree/DataTree), on top of which sits the Explorer-specific logic (data source, renderers, drag-and-drop, decorations). This is implemented in VS Code's custom TypeScript framework with dependency injection, not in React.

We are building a standalone React component library that replicates this behavior 1:1. The library must be installable via `pnpm add`, work in any React 18+ project, ship with full TypeScript types, and include a Storybook showcase. The target users are developers building IDE-like interfaces, file managers, or any application needing a production-grade file tree.

**Current state**: No existing React tree library achieves full VS Code fidelity. react-arborist is the closest at ~80% but lacks compressed folders, file decorations, VS Code's exact DnD feedback model, and the filter widget. Building from scratch using headless primitives gives us full control.

**Constraints**:
- Must use pnpm for all package management (never hand-edit package.json)
- Must match VS Code's visual design and interaction behavior 1:1
- Must use VS Code's own test patterns as reference
- Bundle size target: < 50KB gzipped for core

## Goals / Non-Goals

**Goals:**
- 1:1 replication of VS Code Explorer's UI/UX behavior (keyboard, mouse, DnD, context menu, decorations)
- Best-in-class DX: TypeScript-first, tree-shakeable, well-documented via Storybook
- Headless core with a styled VS Code theme layer — consumers can use the headless primitives or the full styled component
- Full WAI-ARIA tree pattern compliance
- Virtual scrolling that handles 10,000+ node trees smoothly
- Pluggable data model — consumers provide their own data source, the tree handles presentation

**Non-Goals:**
- File system integration — this is a UI component, not a file manager. No `fs` calls, no file watchers. Consumers provide data.
- VS Code extension API compatibility — we do not implement VS Code's `TreeDataProvider` extension API
- Server-side rendering — the tree is inherently interactive and client-only
- Mobile/touch support — VS Code's tree is desktop-focused; touch is out of scope for v1
- Icon bundling — we provide the icon theme system but consumers bring their own icon set (we ship a default Seti-like set as optional)

## Decisions

### 1. Headless core + styled layer architecture

**Decision**: Build a headless core (`@vscode-file-tree/core`) that exposes hooks and state management, with a styled layer (`@vscode-file-tree/react`) that provides the VS Code-themed components.

**Why over monolith**: Allows consumers to use the logic without our styling (for custom design systems) or use the full styled version. Matches the pattern of successful libraries like Radix UI, Headless UI, and TanStack Table.

**Why over pure headless**: Many consumers want VS Code's look out of the box. Shipping a styled layer reduces adoption friction. The headless core is the foundation; the styled layer is a thin rendering wrapper.

**Alternatives considered**:
- Monolithic styled component (react-arborist approach): Less flexible, harder to customize deeply
- Pure headless only (headless-tree approach): Higher adoption friction, more work for consumers who just want VS Code look

### 2. @dnd-kit for drag-and-drop

**Decision**: Use `@dnd-kit/core` and `@dnd-kit/sortable` for the drag-and-drop system.

**Why over native HTML5 DnD**: HTML5 DnD has inconsistent behavior across browsers (especially Firefox), no custom drag previews, and poor touch support. @dnd-kit provides consistent behavior, custom overlays, accessibility, and sensor abstraction.

**Why over react-dnd**: @dnd-kit is more modern, smaller, actively maintained, and has first-class support for sortable nested lists which is exactly what a file tree needs.

**Alternatives considered**:
- Native HTML5 DnD: Inconsistent cross-browser, limited preview customization
- react-dnd: Larger, older API, less suitable for nested sortable
- react-beautiful-dnd: Archived/deprecated by Atlassian
- Custom implementation: High effort, would replicate what @dnd-kit already solves

### 3. Virtualization approach

**Decision**: Implement custom virtualization tailored to the tree, inspired by VS Code's List widget. Use a flat list of visible (expanded) nodes with offset-based rendering.

**Why over react-window/react-virtuoso**: Tree virtualization has unique requirements — expanding/collapsing changes the list dynamically, and we need to maintain focus/selection across these mutations. A custom solution gives us full control over the interaction between tree state and virtual rendering.

**Implementation approach**: The tree state is maintained as a nested structure, but the renderer flattens it into a visible-nodes array. Only nodes within the viewport (plus overscan) are rendered to DOM. Expanding/collapsing updates the flat list and triggers a re-render of only the affected viewport region.

**Alternatives considered**:
- react-window: Generic list virtualization, doesn't handle tree expand/collapse natively
- react-virtuoso: Better tree support but adds a dependency for something we need tight control over
- TanStack Virtual: Good option but we need tighter integration with tree state

### 4. State management with React context + useReducer

**Decision**: Use React Context for tree-wide state (expansion, selection, focus) with useReducer for predictable state transitions. Expose imperative handles via `useImperativeHandle` + `forwardRef`.

**Why over external state lib**: The tree state is self-contained. Adding Zustand/Jotai/Redux would be an unnecessary dependency for consumers. React's built-in primitives are sufficient and keep the dependency footprint minimal.

**Controlled + uncontrolled modes**: Support both patterns. Consumers can pass `expandedIds`/`onExpand` for controlled mode, or let the tree manage its own state internally.

### 5. CSS custom properties for theming (no CSS-in-JS runtime)

**Decision**: Use CSS custom properties (variables) for all theming. Ship a default VS Code dark/light theme. No CSS-in-JS runtime dependency.

**Why**: CSS custom properties have zero runtime cost, work with any styling approach the consumer uses (Tailwind, CSS modules, styled-components, vanilla CSS), and directly mirror VS Code's own `--vscode-*` variable naming convention.

**Variable naming**: Use `--vft-list-*` and `--vft-tree-*` prefixed variables that map 1:1 to VS Code's `--vscode-list-*` and `--vscode-tree-*` tokens. Consumers can override any variable or import a VS Code-compatible theme that maps `--vscode-*` to `--vft-*`.

### 6. Vite for library build, Storybook 8 for showcase

**Decision**: Use Vite in library mode for building the package (ESM + CJS output). Use Storybook 8 with Component Story Format 3 for the showcase.

**Why Vite**: Fast builds, excellent library mode, tree-shaking support, TypeScript out of the box.

**Why Storybook 8**: Industry standard for component documentation, supports interaction testing via `play` functions, accessibility addon, visual regression via Chromatic.

### 7. Vitest + Playwright for testing

**Decision**: Vitest for unit/integration tests, Playwright for browser-level interaction tests. This mirrors VS Code's testing approach (Mocha unit tests + integration tests in Extension Development Host).

**Why Vitest over Jest**: Faster, native ESM support, Vite-compatible, same config ecosystem.

**Why Playwright over Cypress**: Better multi-browser support, faster, better for testing keyboard interactions and DnD.

### 8. Monorepo with pnpm workspaces

**Decision**: Structure as a pnpm workspace monorepo with packages:
- `packages/core` — headless tree logic, hooks, state management
- `packages/react` — styled React components (depends on core)
- `packages/icons` — optional Seti-like icon set
- `apps/storybook` — Storybook showcase app

**Why monorepo**: Keeps concerns separated while allowing local development. Core can be tested independently. Styled layer imports from core. Storybook imports from both.

## Risks / Trade-offs

**[1:1 fidelity is subjective]** VS Code's tree has many micro-interactions (exact hover timing, scroll momentum, focus ring styles) that are hard to measure precisely.
  - Mitigation: Use VS Code's own test suite as behavioral specification. Record VS Code interactions and use Playwright visual regression to compare.

**[Bundle size vs features]** Shipping all features (DnD, decorations, filter, icons) may exceed the 50KB target.
  - Mitigation: Tree-shakeable architecture. Core tree + virtualization is the baseline. DnD, decorations, filter, context menu are separate imports. Consumers only pay for what they use.

**[@dnd-kit compatibility risk]** @dnd-kit may have breaking changes or maintenance gaps.
  - Mitigation: Wrap @dnd-kit behind our own DnD abstraction layer. If @dnd-kit becomes unmaintained, we can swap the implementation without changing consumer API.

**[Performance at scale]** 10k+ nodes with decorations and icons may hit rendering bottlenecks.
  - Mitigation: Benchmark early and continuously. Use React.memo aggressively on tree nodes. Decoration resolution is async and cached. Icon resolution is a pure lookup table.

**[Accessibility completeness]** Full WAI-ARIA tree pattern is complex (typeahead, roving tabindex, live regions for state changes).
  - Mitigation: Reference React Aria's tree implementation for proven patterns. Test with screen readers (VoiceOver, NVDA) as part of CI.

## Open Questions

1. **Icon distribution**: Should the default icon set (Seti-like) be bundled as SVG sprites, individual SVGs, or an icon font? SVG sprites have better tree-shaking; icon fonts have simpler CSS.
2. **Multi-root support**: VS Code supports multi-root workspaces (multiple root folders in one explorer). Should v1 support this or defer to v2?
3. **Sticky scroll**: VS Code recently added sticky scroll headers for the tree. Include in v1 or defer?
4. **External DnD**: Dropping files from the OS file explorer into the tree — should v1 support this or only internal reordering?
