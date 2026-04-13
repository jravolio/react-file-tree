## Why

After researching VS Code's official source code, 8 differences were found between our @dnd-kit DnD implementation and VS Code's native HTML5 DnD. The most critical: @dnd-kit's default collision detection uses overlay rect intersection instead of pointer position, causing drop target highlights to never appear.

## What Changes

- **Fix #1 CRITICAL** — Add `collisionDetection={pointerWithin}` to `DndContext` so @dnd-kit checks pointer position like native drag events
- **Fix #2 HIGH** — Add `vft-tree--dragging` class to tree container during active drag
- **Fix #3 MEDIUM** — Only show drop target highlight on valid targets (not self/descendant drops) via `DndStateContext`
- **Fix #4 MEDIUM** — `pointerWithin` eliminates flicker; debounce deferred unless needed
- **Fix #5 LOW** — Document sector gap as comment (deferred feature)
- **Fix #6 HIGH** — Scope `.vft-row:hover` to `.vft-tree:not(.vft-tree--dragging)` to suppress hover during drag
- **Fix #7 LOW** — No change needed; virtual list limitation mitigated by overscan
- **Fix #8 LOW** — Refactor `DraggableTreeNodeRow` to use existing `useTreeDnd` hook, eliminating code duplication

## Capabilities

### New Capabilities
- `dnd-full-parity`: Complete DnD visual and behavioral parity with VS Code's file explorer

### Modified Capabilities
_(None)_

## Impact

- **DragAndDrop.tsx** — `pointerWithin` collision, `DndStateContext`, `useTreeDnd` cleanup
- **FileTree.tsx** — `isDragging` state, `vft-tree--dragging` class, `onDragStateChange` wiring
- **DraggableTreeNodeRow.tsx** — Use `useTreeDnd` hook, `useDndState` for validity check
- **styles.css** — Scoped hover rules
- **No API changes**
