## 1. Fix Collision Detection (#1 CRITICAL)

- [x] 1.1 Add `pointerWithin` import to `DragAndDrop.tsx`
- [x] 1.2 Add `collisionDetection={pointerWithin}` to `DndContext`

## 2. Add Dragging Class to Container (#2 HIGH)

- [x] 2.1 Add `useState` import to `FileTree.tsx`
- [x] 2.2 Add `isDragging` state to `FileTreeInner`
- [x] 2.3 Add `vft-tree--dragging` class to tree container div
- [x] 2.4 Wire `onDragStateChange` callback on `TreeDndContext`

## 3. Drop Target Validity (#3 MEDIUM)

- [x] 3.1 Create `DndStateContext` and `useDndState` hook in `DragAndDrop.tsx`
- [x] 3.2 Wrap children in `DndStateContext.Provider` inside `TreeDndContext`
- [x] 3.3 Use `useDndState` in `DraggableTreeNodeRow` to check validity
- [x] 3.4 Update className condition to include `!isInvalidTarget`

## 4. Dragleave Debounce (#4 MEDIUM)

- [x] 4.1 `pointerWithin` collision detection eliminates flicker — no additional debounce needed

## 5. Drop Zone Sectors (#5 LOW)

- [x] 5.1 Add comment in `handleDragOver` documenting the sector gap vs VS Code

## 6. Hover Suppression During Drag (#6 HIGH)

- [x] 6.1 Change `.vft-row:hover` to `.vft-tree:not(.vft-tree--dragging) .vft-row:hover`
- [x] 6.2 Change `.vft-row--selected:hover` to `.vft-tree:not(.vft-tree--dragging) .vft-row--selected:hover`

## 7. Virtual List DnD (#7 LOW)

- [x] 7.1 No change needed — mitigated by overscan (documented as known limitation)

## 8. Code Duplication (#8 LOW)

- [x] 8.1 Remove `isFolder` param from `UseTreeDndOptions`, return raw `isOver`
- [x] 8.2 Refactor `DraggableTreeNodeRow` to use `useTreeDnd` hook instead of inline `useDraggable`/`useDroppable`

## 9. Verification

- [x] 9.1 Run build — `pnpm build`
- [x] 9.2 Run tests — `pnpm --filter @vscode-file-tree/core exec vitest run` (112 pass)
- [ ] 9.3 Start Storybook and verify all DnD behaviors match VS Code
