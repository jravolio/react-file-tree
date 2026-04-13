## Why

This library currently bundles file-system operation concepts (inline editing, rename, create, delete, activate/open) that couple the tree to a specific use case. Consumers who just need a navigable file tree with click feedback are forced to accept — or ignore — a large surface area they don't use. Additionally, the current click behavior diverges from VS Code's default: folders require a twistie click to expand instead of a single click anywhere on the row, and there is no unified click callback for consumer integration.

## What Changes

- **BREAKING** — Remove `onActivate` prop and double-click-to-activate behavior. Replace with a generic `onNodeClick` callback that fires on every node click (file or folder), providing the node, click event metadata, and node type so consumers can implement their own open/preview/navigate logic.
- **BREAKING** — Remove inline editing system: `onRename`, `onCreate` props, `startRename`/`startCreate` imperative methods, `InlineInput` component, and all internal editing state (`editingId`, `editingType`, `editingParentId`).
- **BREAKING** — Remove `onDelete` prop and Delete/Backspace keyboard handling for deletion.
- **BREAKING** — Remove `FilterWidget` component and filter-related keyboard handling.
- **BREAKING** — Remove `ContextMenu` component and `contextMenuItems` prop.
- **Single-click folder expand/collapse** — Clicking anywhere on a folder row toggles its expansion (matching VS Code default behavior), instead of requiring a twistie-only click.
- **VS Code UI/UX parity audit** — Fix all visual and interaction differences to match VS Code's file explorer 1:1:
  - Twistie click no longer needs `stopPropagation` — folder row click handles expansion directly.
  - Keyboard `Enter` on a folder still toggles expansion; `Enter` on a file fires `onNodeClick`.
  - `F2` and `Delete`/`Backspace` keyboard shortcuts removed (no editing/delete).
  - Selection, focus, hover, and indent guide styling verified against VS Code defaults.

## Capabilities

### New Capabilities
- `node-click-callback`: Generic click callback (`onNodeClick`) that fires on any node interaction, providing node data, whether it's a file or folder, and event metadata so consumers can plug in their own behavior.

### Modified Capabilities
_(No existing specs in `openspec/specs/` to modify.)_

## Impact

- **`@vscode-file-tree/core`** — Remove `useKeyboardNavigation` editing/delete/filter handlers. Remove inline editing types from `types.ts`. Simplify `TreeContextValue` to drop editing state.
- **`@vscode-file-tree/react`** — Remove `InlineInput.tsx`, `FilterWidget.tsx`, `ContextMenu.tsx`. Simplify `FileTree.tsx` (drop editing state, context menu, filter). Update `TreeNodeRow.tsx` to toggle folder expansion on row click and fire `onNodeClick`. Remove editing-related imperative handle methods (`startRename`, `startCreate`). Remove `onActivate` prop.
- **CSS** — Remove `.vft-inline-input-*`, `.vft-filter-*`, `.vft-context-menu-*` styles.
- **Storybook** — Update stories to use `onNodeClick` instead of `onActivate`. Remove stories showcasing inline editing, context menu, and filter features.
- **Tests** — Remove tests for inline editing, context menu, filter. Add tests for `onNodeClick` callback and single-click folder expansion.
- **Public API** — Multiple breaking changes to `FileTreeProps`, `FileTreeHandle`, and `TreeContextValue`. Consumers must migrate from `onActivate`/`onRename`/`onCreate`/`onDelete` to `onNodeClick`.
