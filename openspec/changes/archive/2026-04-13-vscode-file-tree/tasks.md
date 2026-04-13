## 1. Project Setup & Monorepo Scaffold

- [x] 1.1 Initialize pnpm workspace monorepo with `pnpm init` and `pnpm-workspace.yaml` defining packages/* and apps/*
- [x] 1.2 Create `packages/core` package with `pnpm init` — add TypeScript, Vitest as dev dependencies via `pnpm add -D`
- [x] 1.3 Create `packages/react` package with `pnpm init` — add React 18, TypeScript, Vite as dev dependencies via `pnpm add -D`
- [x] 1.4 Create `packages/icons` package with `pnpm init` for the optional Seti-like icon set
- [x] 1.5 Create `apps/storybook` app with `pnpm create storybook@latest` — configure Storybook 8 with React/Vite framework
- [x] 1.6 Configure shared TypeScript config (`tsconfig.base.json`) with strict mode, ESM module resolution, path aliases
- [x] 1.7 Configure Vite library mode build for `packages/core` (ESM + CJS output, dts generation)
- [x] 1.8 Configure Vite library mode build for `packages/react` (ESM + CJS output, external React peer dep)
- [x] 1.9 Configure ESLint and Prettier across workspace with shared config
- [x] 1.10 Set up Vitest workspace config for running tests across all packages

## 2. Core Tree Data Model & State Management

- [x] 2.1 Define TypeScript interfaces: `TreeNode<T>`, `TreeNodeData`, `FlattenedNode`, `TreeState` in `packages/core/src/types.ts`
- [x] 2.2 Implement `flattenTree()` utility that converts nested tree structure to flat visible-node array respecting expansion state
- [x] 2.3 Implement `useTreeState` hook with useReducer — actions: EXPAND, COLLAPSE, TOGGLE, COLLAPSE_ALL, SET_EXPANDED
- [x] 2.4 Implement `useSelection` hook — actions: SELECT, TOGGLE_SELECT, RANGE_SELECT, SELECT_ALL, CLEAR
- [x] 2.5 Implement `useFocus` hook — tracks focused item ID separately from selection, supports FOCUS_NEXT, FOCUS_PREV, FOCUS_FIRST, FOCUS_LAST
- [x] 2.6 Implement controlled/uncontrolled mode support — detect if consumer provides `expandedIds`/`onExpandChange` and delegate accordingly
- [x] 2.7 Implement `TreeContext` provider that combines tree state, selection, and focus into a single context
- [x] 2.8 Write unit tests for `flattenTree` — nested structures, expansion state, empty folders, deep nesting
- [x] 2.9 Write unit tests for `useTreeState` — expand, collapse, toggle, collapse all, controlled mode
- [x] 2.10 Write unit tests for `useSelection` — single, multi, range, select all, clear
- [x] 2.11 Write unit tests for `useFocus` — next, prev, first, last, boundaries

## 3. Virtual Scrolling Engine

- [x] 3.1 Implement `useVirtualList` hook — calculates visible range from scroll position, container height, and row height
- [x] 3.2 Implement overscan buffer logic — render extra rows above/below viewport (configurable `overscanCount`)
- [x] 3.3 Implement scroll container component with `onScroll` handler that updates visible range
- [x] 3.4 Implement absolute positioning for virtual rows (each row gets `top` offset based on index * rowHeight)
- [x] 3.5 Implement `scrollTo(index)` method for programmatic scrolling to a specific node
- [x] 3.6 Implement smooth scroll behavior for `scrollTo` with reveal-ancestor expansion
- [x] 3.7 Write unit tests for visible range calculation — varying container sizes, scroll positions, overscan
- [x] 3.8 Write performance benchmark test — render 10k nodes, assert < 100ms initial render, > 55fps scroll

## 4. Keyboard Navigation

- [x] 4.1 Implement `useKeyboardNavigation` hook that captures keydown events on the tree container
- [x] 4.2 Implement Up/Down arrow handlers — move focus through flat visible-node list
- [x] 4.3 Implement Right arrow handler — expand collapsed folder OR move to first child of expanded folder
- [x] 4.4 Implement Left arrow handler — collapse expanded folder OR move to parent of file/collapsed folder
- [x] 4.5 Implement Enter key handler — activate file (onActivate callback) OR toggle folder expansion
- [x] 4.6 Implement F2 key handler — trigger inline edit mode for focused item
- [x] 4.7 Implement Delete/Backspace handler — trigger onDelete callback for selected items
- [x] 4.8 Implement Escape handler — cancel active mode (rename, filter) or clear selection
- [x] 4.9 Implement Ctrl+A handler — select all visible items
- [x] 4.10 Implement Home/End handlers — focus first/last visible item
- [x] 4.11 Implement Shift+Arrow handlers — extend selection range from anchor
- [x] 4.12 Implement typeahead search — buffer typed characters, find next match, reset after 500ms timeout
- [x] 4.13 Write unit tests for each keyboard handler in isolation
- [x] 4.14 Write integration test for keyboard navigation flow (arrow through tree, expand, collapse, select)

## 5. Tree Node Renderer (React Components)

- [x] 5.1 Create `<FileTree>` root component — sets up context, virtual scroll container, ARIA tree role
- [x] 5.2 Create `<TreeNode>` component — renders single row with indent, twistie, icon, label, decorations
- [x] 5.3 Implement indent calculation — `paddingLeft = depth * indentSize` with configurable `indentSize` prop
- [x] 5.4 Implement twistie (expand/collapse chevron) with rotation animation matching VS Code
- [x] 5.5 Implement hover state with `--vft-list-hoverBackground` on mouseenter/mouseleave
- [x] 5.6 Implement selection styling with `--vft-list-activeSelectionBackground`
- [x] 5.7 Implement focus outline with `--vft-list-focusOutline`
- [x] 5.8 Implement indent guides — vertical lines at each depth level using `--vft-tree-indentGuidesStroke`
- [x] 5.9 Implement `React.memo` on `<TreeNode>` with custom comparator to prevent unnecessary re-renders
- [x] 5.10 Expose imperative API via `useImperativeHandle`: `open()`, `close()`, `select()`, `scrollTo()`, `focus()`
- [x] 5.11 Implement ARIA attributes: `role="tree"`, `role="treeitem"`, `aria-expanded`, `aria-selected`, `aria-level`, `aria-setsize`, `aria-posinset`, `aria-label`

## 6. Drag and Drop

- [x] 6.1 Install `@dnd-kit/core` and `@dnd-kit/sortable` via `pnpm add`
- [x] 6.2 Implement `DndContext` wrapper in `<FileTree>` with tree-specific collision detection
- [x] 6.3 Implement draggable behavior on `<TreeNode>` using `useDraggable`
- [x] 6.4 Implement droppable zones on folder nodes using `useDroppable`
- [x] 6.5 Implement drop-into-folder indicator — highlighted folder background
- [x] 6.6 Implement drop-between indicator — horizontal line between items
- [x] 6.7 Implement multi-item drag — when dragging a selected item, include all selected items
- [x] 6.8 Implement custom drag overlay showing item icon + name (single) or icon + count badge (multi)
- [x] 6.9 Implement invalid drop target detection — prevent dropping folder into its own descendants
- [x] 6.10 Implement auto-expand on hover — expand collapsed folder after 500ms drag hover
- [x] 6.11 Implement auto-scroll during drag — scroll tree when cursor is within 40px of top/bottom edge
- [x] 6.12 Implement drag cancel on Escape key
- [x] 6.13 Implement `onMove` callback — called on successful drop with `{ dragIds, targetId, targetIndex }`
- [x] 6.14 Write Playwright tests for drag-and-drop: single drag, multi drag, cancel, auto-expand, invalid target

## 7. Inline Editing

- [x] 7.1 Create `<InlineInput>` component — text input that replaces the tree node label
- [x] 7.2 Implement rename mode: F2 or API triggers input display with current name, filename part selected (not extension)
- [x] 7.3 Implement Enter to confirm rename — call `onRename` callback, exit edit mode
- [x] 7.4 Implement Escape to cancel rename — restore original name, exit edit mode
- [x] 7.5 Implement blur to confirm rename — matching VS Code behavior
- [x] 7.6 Implement new file creation: show empty input as first child of target folder with file icon
- [x] 7.7 Implement new folder creation: show empty input as first child of target folder with folder icon
- [x] 7.8 Implement `onCreate` callback — called on confirm with `{ parentId, name, type }`
- [x] 7.9 Implement input validation — reject invalid filesystem characters (/, \, :, *, ?, ", <, >, |), reject empty names, show error message below input
- [x] 7.10 Write unit tests for validation logic
- [x] 7.11 Write Playwright tests for inline editing flow: rename, create file, create folder, cancel, validation

## 8. Context Menu

- [x] 8.1 Create `<ContextMenu>` component — positioned overlay triggered by right-click
- [x] 8.2 Implement cursor-position placement with viewport boundary collision detection
- [x] 8.3 Implement default menu items: file context (Open, Rename, Delete, Copy, Cut, Copy Path), folder context (New File, New Folder, Rename, Delete, Collapse), background context (New File, New Folder, Paste, Collapse All)
- [x] 8.4 Implement keyboard navigation within menu: Up/Down arrows, Enter to select, Escape to close
- [x] 8.5 Implement close on outside click
- [x] 8.6 Implement separator support — horizontal dividers between action groups
- [x] 8.7 Implement extensible `contextMenuItems` prop — consumers register custom actions with `{ label, action, when, group }` interface
- [x] 8.8 Implement right-click auto-selection — right-clicked item becomes selected if not already
- [x] 8.9 Write Playwright tests for context menu: open, navigate, select, close, custom items, viewport repositioning

## 9. File Decorations

- [x] 9.1 Define `DecorationProvider` interface: `getDecoration(node) => { color, badge, tooltip }`
- [x] 9.2 Implement `useDecorations` hook that resolves decorations from providers for each visible node
- [x] 9.3 Implement git status color mapping: modified → warning, untracked → green, deleted → red, conflicting → red bold, ignored → dimmed
- [x] 9.4 Implement badge rendering component — circular indicator with text, positioned right of label
- [x] 9.5 Implement folder decoration aggregation — propagate child decorations upward, count decorated descendants
- [x] 9.6 Implement decoration tooltip on hover
- [x] 9.7 Implement reactive decoration updates — targeted re-render when provider data changes (via useSyncExternalStore or similar)
- [x] 9.8 Implement multiple provider merging — priority-based color, concatenated badges
- [x] 9.9 Write unit tests for decoration resolution, folder aggregation, provider merging

## 10. Compact Folders

- [x] 10.1 Implement `compactFolders` computation in `flattenTree` — detect single-child folder chains and merge into compound paths
- [x] 10.2 Render compressed path as segmented label (e.g., "src / app / models") with separator styling
- [x] 10.3 Implement per-segment click handler — `onNavigateToSegment` callback with specific folder data
- [x] 10.4 Implement `compactFolders` prop (boolean, default true) to toggle behavior
- [x] 10.5 Implement full-path tooltip on hover for compressed paths
- [x] 10.6 Ensure expanding compressed folder reveals terminal folder's children
- [x] 10.7 Write unit tests for compact folder detection — single chain, branching, toggle, deeply nested

## 11. Icon Theming

- [x] 11.1 Define `IconTheme` interface: `{ fileExtensions, fileNames, folderNames, folderNamesExpanded, defaultFile, defaultFolder }`
- [x] 11.2 Implement `resolveIcon` utility — match by filename > compound extension > simple extension > folder name > default
- [x] 11.3 Create default Seti-inspired icon theme in `packages/icons` — cover top 50 file extensions and 20 common folder names
- [x] 11.4 Implement icon rendering supporting both SVG components and CSS class names
- [x] 11.5 Implement expanded/collapsed folder icon differentiation
- [x] 11.6 Implement `iconTheme` prop on `<FileTree>` for consumer-provided themes
- [x] 11.7 Write unit tests for `resolveIcon` — priority order, compound extensions, folder names, defaults

## 12. CSS Theming System

- [x] 12.1 Create base CSS file defining all `--vft-*` custom properties with VS Code Dark+ defaults
- [x] 12.2 Create `themes/dark.css` matching VS Code Dark+ color values
- [x] 12.3 Create `themes/light.css` matching VS Code Light+ color values
- [x] 12.4 Create `themes/vscode-bridge.css` mapping `--vscode-*` variables to `--vft-*` variables
- [x] 12.5 Ensure all component styles reference only CSS variables — zero hardcoded colors
- [x] 12.6 Document all available CSS variables with descriptions and default values
- [x] 12.7 Write visual regression test comparing dark and light theme screenshots

## 13. Filter / Search Widget

- [x] 13.1 Create `<FilterWidget>` component — input bar positioned at top of tree, toggled by Ctrl+F
- [x] 13.2 Implement filter logic — hide non-matching items, keep parent ancestors of matches visible
- [x] 13.3 Implement fuzzy matching — non-contiguous character matching in order
- [x] 13.4 Implement match highlighting — render matched characters with highlight style in item labels
- [x] 13.5 Implement match count display ("3 of 150") in filter widget
- [x] 13.6 Implement Up/Down navigation between matches with focus scroll
- [x] 13.7 Implement wrap-around navigation (last match → first match)
- [x] 13.8 Implement Escape to close filter and restore full tree
- [x] 13.9 Implement expansion state preservation — store pre-filter state, restore on filter clear
- [x] 13.10 Write unit tests for fuzzy matching algorithm
- [x] 13.11 Write Playwright tests for filter flow: open, type, navigate matches, clear, escape

## 14. Storybook Stories

- [x] 14.1 Create "Basic / Default File Tree" story with sample file structure data
- [x] 14.2 Create "Basic / Controlled State" story demonstrating controlled expand/select props
- [x] 14.3 Create "Interactions / Keyboard Navigation" story with instructions panel
- [x] 14.4 Create "Interactions / Drag and Drop" story with drag-enabled tree
- [x] 14.5 Create "Interactions / Inline Editing" story with rename and create actions
- [x] 14.6 Create "Interactions / Context Menu" story with custom menu items
- [x] 14.7 Create "Interactions / Filter Search" story demonstrating filter widget
- [x] 14.8 Create "Features / File Decorations" story with git status decorations
- [x] 14.9 Create "Features / Compact Folders" story with toggle control
- [x] 14.10 Create "Features / Icon Themes" story with theme switcher
- [x] 14.11 Create "Performance / Large Tree (10k)" story with generated data
- [x] 14.12 Create "Theming / Theme Switcher" story toggling dark/light/custom
- [x] 14.13 Create "Accessibility / Screen Reader" story with ARIA inspection
- [x] 14.14 Create "Examples / With Preview Panel" composition story
- [x] 14.15 Create "Examples / Resizable Sidebar" composition story
- [x] 14.16 Add `play` functions for interaction testing on DnD, rename, and keyboard stories
- [x] 14.17 Configure Storybook controls/args for all configurable props

## 15. Playwright E2E & Visual Regression Tests

- [x] 15.1 Set up Playwright config targeting Storybook dev server
- [x] 15.2 Write E2E test: full keyboard navigation flow (focus, arrow, expand, collapse, select, rename, delete)
- [x] 15.3 Write E2E test: drag-and-drop flow (single item, multi item, cancel, auto-expand)
- [x] 15.4 Write E2E test: context menu flow (open, navigate, select action, close)
- [x] 15.5 Write E2E test: filter flow (open widget, type, navigate matches, clear)
- [x] 15.6 Write visual regression screenshots: default, selected, hover, drag, context menu, filter, inline edit, dark theme, light theme
- [x] 15.7 Write accessibility audit using `@axe-core/playwright` on key stories

## 16. Package Publishing Prep

- [x] 16.1 Configure `package.json` exports map for `packages/core` — main, module, types entry points
- [x] 16.2 Configure `package.json` exports map for `packages/react` — main, module, types, CSS theme exports
- [x] 16.3 Configure `package.json` exports map for `packages/icons` — main, module, types
- [x] 16.4 Add `peerDependencies` for React 18+ in `packages/react`
- [x] 16.5 Configure `.npmignore` or `files` field to exclude test files, storybook, and dev configs
- [x] 16.6 Add `README.md` with quick start, API overview, and link to Storybook
- [x] 16.7 Verify tree-shaking works — import single feature, confirm bundle excludes unused code
