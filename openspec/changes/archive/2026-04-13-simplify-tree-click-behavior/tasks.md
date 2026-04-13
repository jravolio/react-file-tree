## 1. Remove Inline Editing System

- [x] 1.1 Delete `packages/react/src/InlineInput.tsx`
- [x] 1.2 Remove editing state from `FileTree.tsx` — delete `editingId`, `editingType`, `editingParentId` useState hooks, `startRename`, `startCreate`, `cancelEdit`, `confirmEdit` callbacks
- [x] 1.3 Remove `onRename`, `onCreate`, `onDelete` props from `FileTreeProps` interface
- [x] 1.4 Remove `startRename`, `startCreate` from the imperative handle (`useImperativeHandle`)
- [x] 1.5 Remove editing-related fields from `TreeContextValue` — `editingId`, `editingType`, `editingParentId`, `startRename`, `startCreate`, `cancelEdit`, `confirmEdit`
- [x] 1.6 Update `@vscode-file-tree/core` types — remove editing-related types from `types.ts` and `TreeContext`

## 2. Remove Context Menu and Filter Widget

- [x] 2.1 Delete `packages/react/src/ContextMenu.tsx`
- [x] 2.2 Delete `packages/react/src/FilterWidget.tsx`
- [x] 2.3 Remove `contextMenuItems` prop from `FileTreeProps`
- [x] 2.4 Remove `onContextMenu` handler from `TreeNodeRow.tsx`
- [x] 2.5 Remove filter-related imports and references from `FileTree.tsx`

## 3. Simplify Keyboard Navigation

- [x] 3.1 Remove F2 (rename) handler from `useKeyboardNavigation.ts`
- [x] 3.2 Remove Delete/Backspace handler from `useKeyboardNavigation.ts`
- [x] 3.3 Remove `startRename`, `cancelEdit`, `editingId`, `filterActive`, `onFilterClose` from `UseKeyboardNavigationOptions`
- [x] 3.4 Simplify Escape handler — only clear selection (remove filter close and cancel edit branches)
- [x] 3.5 Update Enter handler for files — fire `onNodeClick` instead of `onActivate`
- [x] 3.6 Update Enter handler for folders — fire `onNodeClick` after toggling expansion

## 4. Add `onNodeClick` Callback

- [x] 4.1 Add `onNodeClick` prop to `FileTreeProps` with signature `(params: { node: TreeNode<T>; isFolder: boolean; isExpanded: boolean }) => void`
- [x] 4.2 Remove `onActivate` prop from `FileTreeProps`
- [x] 4.3 Pass `onNodeClick` through to `TreeNodeRow` instead of `onActivate`
- [x] 4.4 Fire `onNodeClick` in `TreeNodeRow.handleClick` after selection and expansion logic
- [x] 4.5 Fire `onNodeClick` in keyboard Enter handler (via `useKeyboardNavigation`)

## 5. Folder Single-Click Expansion

- [x] 5.1 Update `TreeNodeRow.handleClick` — call `onToggleExpand(node.id)` when `meta.isFolder` is true
- [x] 5.2 Remove `stopPropagation` from twistie click handler — let the row click handle expansion
- [x] 5.3 Remove separate `handleTwistieClick` function from `TreeNodeRow` — twistie no longer needs its own click handler
- [x] 5.4 Remove `handleDoubleClick` from `TreeNodeRow` — no more double-click activation
- [x] 5.5 Remove `onDoubleClick` event from the row's JSX

## 6. CSS Cleanup

- [x] 6.1 Remove `.vft-inline-input-wrapper`, `.vft-inline-input`, `.vft-inline-input-error` styles from `styles.css`
- [x] 6.2 Remove `.vft-filter-widget`, `.vft-filter-input`, `.vft-filter-count`, `.vft-highlight` styles from `styles.css`
- [x] 6.3 Remove `.vft-context-menu`, `.vft-context-menu-item`, `.vft-context-menu-item--focused`, `.vft-context-menu-item-keybinding`, `.vft-context-menu-separator` styles from `styles.css`

## 7. Update Exports and Index Files

- [x] 7.1 Remove `InlineInput`, `ContextMenu`, `FilterWidget` exports from `packages/react/src/index.ts`
- [x] 7.2 Remove editing-related type exports from `packages/core/src/index.ts` (if any)
- [x] 7.3 Verify `packages/core/src/types.ts` no longer exports editing-related types

## 8. Update Storybook

- [x] 8.1 Replace `onActivate` with `onNodeClick` in all story files
- [x] 8.2 Remove stories that showcase inline editing, context menu, or filter features
- [x] 8.3 Add a story demonstrating `onNodeClick` callback with console logging for file and folder clicks
- [x] 8.4 Verify folder single-click expansion works in Storybook

## 9. Update Tests

- [x] 9.1 Remove tests for inline editing, context menu, and filter
- [x] 9.2 Add test: `onNodeClick` fires with correct params on file click
- [x] 9.3 Add test: `onNodeClick` fires with correct params on folder click (with `isExpanded` reflecting post-toggle state)
- [x] 9.4 Add test: folder expands on single row click (not just twistie)
- [x] 9.5 Add test: folder collapses on single row click when already expanded
- [x] 9.6 Add test: `onNodeClick` fires on Ctrl/Cmd click
- [x] 9.7 Add test: Enter key on focused file fires `onNodeClick`
- [x] 9.8 Add test: F2 key is a no-op (no error, no action)
- [x] 9.9 Add test: Delete key is a no-op (no error, no action)

## 10. Final Verification

- [x] 10.1 Run full test suite — `pnpm test`
- [x] 10.2 Run build — `pnpm build`
- [x] 10.3 Run linter — `pnpm lint`
- [ ] 10.4 Start Storybook and manually verify: folder single-click expansion, `onNodeClick` logging, keyboard navigation, selection, hover/focus styles match VS Code
