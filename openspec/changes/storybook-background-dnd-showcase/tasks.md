## 1. Create Story File

- [x] 1.1 Create `apps/storybook/src/stories/BackgroundAndDnD.stories.tsx` with Meta under `title: "Visual Parity"`
- [x] 1.2 Add `SidebarBackground` story — two trees side by side on `#252526` vs `#1e1e1e` with labels
- [x] 1.3 Add `DragGhostStyling` story — DnD-enabled tree with instructions to drag and observe the overlay
- [x] 1.4 Add `MultiSelectDrag` story — DnD-enabled tree with instructions to Ctrl+Click select multiple items then drag
- [x] 1.5 Add `DropTargetHighlight` story — DnD-enabled tree with instructions to drag over folders and observe highlight
- [x] 1.6 Add `AutoExpandOnHover` story — DnD-enabled tree with all folders collapsed, instructions to drag over a folder and wait 500ms

## 2. Verification

- [x] 2.1 Run build — `pnpm build`
- [ ] 2.2 Start Storybook and verify all 5 stories render correctly under "Visual Parity" section
