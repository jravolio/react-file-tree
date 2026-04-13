## Why

There is no production-ready React library that faithfully replicates VS Code's file tree (Explorer) behavior, UX, and visual fidelity. Existing options like react-arborist cover ~80% but fall short on critical details: compressed folder paths, sticky scroll headers, file decorations with git-status badges, the exact drag-and-drop feedback model, and VS Code's specific keyboard navigation nuances. Developers building IDEs, code editors, or file management UIs in React are forced to either accept approximations or build custom solutions from scratch.

This project creates a standalone, installable React module (`@vscode-file-tree/react`) that matches VS Code's Explorer 1:1 in behavior and visual design, with best-in-class DX, full TypeScript support, and a Storybook showcase.

## What Changes

- Create a new React component library package scaffolded with pnpm and TypeScript
- Implement a virtualized tree widget matching VS Code's list/tree architecture (virtual scrolling, variable row heights, only-visible-DOM rendering)
- Implement full keyboard navigation matching VS Code exactly: arrow keys, Enter, Escape, F2 rename, Delete, Ctrl/Cmd+Click multi-select, Shift+Click range select, Ctrl+A select-all, Home/End, typeahead search
- Implement drag-and-drop with VS Code's exact feedback model: drop zone indicators, multi-file drag, folder-drop highlighting, auto-expand on hover, external file drop support
- Implement inline editing (rename, new file, new folder) with Enter to confirm and Escape to cancel
- Implement right-click context menu system with extensible action registration
- Implement file decorations system: git status indicators (modified, untracked, added, deleted, conflict), badges, custom decoration providers
- Implement compressed/compact folder paths (single-child directories collapse into path notation)
- Implement indent guides with VS Code's exact styling
- Implement filter/search widget that appears above the tree
- Implement VS Code's icon theme system supporting file-extension, folder-name, and filename-based icon mapping
- Implement theming via CSS custom properties matching VS Code's `--vscode-list-*` and `--vscode-tree-*` variables
- Implement state persistence (expansion, scroll position) via pluggable storage
- Create comprehensive Storybook with stories covering all features: basic tree, drag-and-drop, keyboard navigation, large trees (10k+ nodes), accessibility, theming, customization
- Implement full WAI-ARIA tree pattern for accessibility (role=tree, role=treeitem, aria-expanded, aria-selected)
- Adopt VS Code's own testing patterns: Vitest for unit tests, Playwright for interaction tests, matching the test structure from `src/vs/workbench/contrib/files/test/`

## Capabilities

### New Capabilities
- `tree-core`: Virtual scrolling tree widget with expand/collapse, selection, focus management, and ARIA tree pattern
- `keyboard-navigation`: Full keyboard interaction system matching VS Code (arrow keys, Enter, Escape, F2, Delete, multi-select modifiers, typeahead)
- `drag-and-drop`: Drag-and-drop system with drop zone indicators, multi-item drag, auto-expand, external drop support
- `inline-editing`: Inline rename, new file creation, new folder creation with confirm/cancel
- `context-menu`: Extensible right-click context menu with action registration
- `file-decorations`: Decoration provider system for git status, badges, and custom indicators
- `compact-folders`: Compressed single-child directory path display
- `icon-theming`: File/folder icon theme system with extension, folder-name, and filename mapping
- `css-theming`: CSS custom properties theming matching VS Code's token system
- `filter-search`: Tree filter/search widget with highlight and navigation modes
- `storybook-showcase`: Comprehensive Storybook demonstrating all features and use cases
- `testing-suite`: Unit and interaction test suite following VS Code's testing patterns

### Modified Capabilities
<!-- No existing capabilities to modify - this is a greenfield project -->

## Impact

- **New package**: Creates a new npm-publishable React component library
- **Dependencies**: React 18+, @dnd-kit (drag-and-drop), CSS custom properties (no CSS-in-JS runtime)
- **Build tooling**: Vite for library bundling, pnpm workspace, TypeScript strict mode
- **Testing**: Vitest + Playwright + Storybook interaction tests
- **Documentation**: Storybook as living documentation, TypeScript types as API reference
- **Bundle size target**: < 50KB gzipped for core tree (excluding icons)
- **Browser support**: Modern browsers (Chrome, Firefox, Safari, Edge - last 2 versions)
