## 1. Add Tree Background Color

- [x] 1.1 Add `--vft-sideBar-background: #252526` CSS variable to `.vft-tree` in `styles.css`
- [x] 1.2 Add `background-color: var(--vft-sideBar-background)` to `.vft-tree` in `styles.css`
- [x] 1.3 Add `--vft-sideBar-background: #252526` to `themes/dark.css`
- [x] 1.4 Add `--vft-sideBar-background: #f3f3f3` to `themes/light.css`
- [x] 1.5 Add `--vft-sideBar-background: var(--vscode-sideBar-background, #252526)` mapping to `themes/vscode-bridge.css`

## 2. Update Drag Overlay Styling

- [x] 2.1 Change `.vft-drag-overlay` `background` from `var(--vft-list-activeSelectionBackground)` to `var(--vft-sideBar-background)`
- [x] 2.2 Change `.vft-drag-overlay` `color` from `var(--vft-list-activeSelectionForeground)` to `var(--vft-foreground)`
- [x] 2.3 Remove `border-radius: 4px` from `.vft-drag-overlay`
- [x] 2.4 Add `border: 1px solid var(--vft-tree-tableColumnsBorder)` to `.vft-drag-overlay`
- [x] 2.5 Change `box-shadow` from `0 2px 8px rgba(0, 0, 0, 0.4)` to `0 1px 3px rgba(0, 0, 0, 0.3)` on `.vft-drag-overlay`

## 3. Update Storybook Decorator Backgrounds

- [x] 3.1 Change `background: "#1e1e1e"` to `background: "#252526"` in `FileTree.stories.tsx` decorator
- [x] 3.2 Change `background: "#1e1e1e"` to `background: "#252526"` in `Interactions.stories.tsx` decorator
- [x] 3.3 Change `background: "#1e1e1e"` to `background: "#252526"` in `Features.stories.tsx` decorator
- [x] 3.4 Update `background: "#1e1e1e"` occurrences in `Examples.stories.tsx` to `#252526`

## 4. Verification

- [x] 4.1 Run build — `pnpm build`
- [x] 4.2 Run tests — `pnpm --filter @vscode-file-tree/core exec vitest run`
- [ ] 4.3 Start Storybook and verify: tree background matches VS Code sidebar, drag overlay is minimal and matches reference image
