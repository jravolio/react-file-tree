## Context

The `@vscode-file-tree` library currently bundles a full file-system operation layer — inline editing (rename/create), delete, context menus, filter widget, and an "activate" concept for opening files. This makes the component opinionated about what happens when users interact with the tree, coupling it to a specific use case (file explorer with editing capabilities).

Consumers who want a pure navigable tree — click a folder to expand, click a file to know what was clicked — must ignore or work around 60%+ of the API surface. The current folder click behavior also diverges from VS Code: only the twistie expands folders, while clicking the row merely selects.

The existing architecture cleanly separates core hooks from React rendering, which makes surgical removal feasible without restructuring.

## Goals / Non-Goals

**Goals:**
- Strip all file-system operation concepts (inline editing, delete, context menu, filter) from the public API and internals
- Add a single `onNodeClick` callback that fires on every node click with full context (node data, isFolder, event metadata)
- Make single-click on a folder row expand/collapse it (matching VS Code)
- Achieve 1:1 VS Code file explorer UI/UX parity for the remaining feature set
- Keep the component lightweight and composable — consumers plug in their own behavior via the callback

**Non-Goals:**
- Adding new features (file preview, editor integration, custom actions)
- Changing the drag-and-drop system (keep as-is, it's orthogonal)
- Changing the decoration/badge system (keep as-is)
- Changing the icon theming system (keep as-is)
- Changing the virtual scrolling implementation
- Changing the compact folders feature

## Decisions

### 1. Single `onNodeClick` callback vs. separate `onFileClick`/`onFolderClick`

**Decision:** Single `onNodeClick(node, event)` callback.

**Rationale:** A single callback with discriminated node type (`meta.isFolder`) is simpler, mirrors how event handlers work in practice, and lets consumers branch in one handler rather than wiring two. VS Code's own tree API uses a single `onDidChangeSelection` rather than per-type events. The callback signature:

```typescript
onNodeClick?: (params: {
  node: TreeNode<T>;
  isFolder: boolean;
  isExpanded: boolean;  // after the click (folders only)
}) => void;
```

Deliberately excludes the raw `MouseEvent` — consumers don't need DOM event details for business logic. If Ctrl/Shift/Meta state matters, selection state already captures that via `onSelectionChange`.

**Alternative considered:** Exposing raw `MouseEvent` in the callback. Rejected because it leaks DOM implementation details into the component contract and encourages consumers to build click-handling logic that should live in the tree.

### 2. Folder expansion on row click — where to implement

**Decision:** Handle expansion toggle directly in `TreeNodeRow.handleClick`, not via a parent handler.

**Rationale:** The current `handleClick` already fires on the row and handles selection. Adding `onToggleExpand(node.id)` for folders here is minimal. The twistie's `stopPropagation` gets removed so the row click naturally handles everything. This avoids adding new event plumbing or changing the parent-child contract.

**Sequence for folder single-click:**
1. Selection is set (same as before — respects Ctrl/Shift modifiers)
2. Focus is set (same as before)
3. Expansion is toggled (new behavior)
4. `onNodeClick` fires with `isExpanded` reflecting the new state

### 3. What to remove

**Decision:** Remove these components, props, and internals completely (not just hide):

| Removed | Files affected |
|---------|---------------|
| `InlineInput` component | `InlineInput.tsx` (delete) |
| `FilterWidget` component | `FilterWidget.tsx` (delete) |
| `ContextMenu` component | `ContextMenu.tsx` (delete) |
| Editing state (`editingId`, `editingType`, `editingParentId`) | `FileTree.tsx`, `TreeContext` |
| `onRename`, `onCreate`, `onDelete`, `onActivate` props | `FileTree.tsx` |
| `startRename`, `startCreate` imperative methods | `FileTree.tsx` |
| `contextMenuItems` prop | `FileTree.tsx` |
| F2/Delete/Backspace handlers in keyboard nav | `useKeyboardNavigation.ts` |
| Filter-related keyboard handling | `useKeyboardNavigation.ts` |
| CSS for inline input, filter widget, context menu | `styles.css` |

**Rationale:** Dead code is worse than no code. Keeping unused components creates maintenance burden, confuses consumers reading the source, and inflates bundle size. Clean removal is safe because there are no external dependents yet (v0.1.0).

**Alternative considered:** Keeping the components but not exporting them. Rejected — unused internal code still ships in the bundle and creates false impressions of capability.

### 4. Keyboard navigation changes

**Decision:** Simplify `useKeyboardNavigation` to match the stripped-down feature set:

| Key | Current behavior | New behavior |
|-----|-----------------|-------------|
| Enter (file) | Calls `onActivate` | Fires `onNodeClick` |
| Enter (folder) | Toggle expand | Toggle expand (unchanged) |
| F2 | Start rename | No-op (removed) |
| Delete/Backspace | Fire `onDelete` | No-op (removed) |
| Escape | Close filter / cancel edit / clear selection | Clear selection only |
| All other keys | Unchanged | Unchanged |

### 5. CSS cleanup strategy

**Decision:** Remove CSS rule blocks for deleted components entirely. Keep all theming CSS variables (including `--vft-input-*` and `--vft-errorForeground`) because consumers might use them for their own extensions.

## Risks / Trade-offs

**[Breaking API changes]** → This is a v0.1.0 library with no external consumers yet. The breaking changes are intentional simplification. Document migration in the README: `onActivate` → `onNodeClick`, editing features → "implement externally".

**[Folder click = expand may surprise power users]** → VS Code itself uses this behavior as the default. Consumers who want select-only-on-click can handle it by controlling `expandedIds` and ignoring the expansion in their `onExpandChange` handler.

**[Removing features that were just built]** → The features were built to prove the architecture works. Now that the architecture is validated, stripping to the essential API makes the library more composable and adoptable. Features can be re-added as separate packages or plugins later.

**[onNodeClick fires after expansion, not before]** → Consumers receive the post-toggle `isExpanded` state. This matches user intent (click to expand → callback says "it's now expanded"). If pre-toggle state is needed, consumers can derive it by inverting `isExpanded`.
