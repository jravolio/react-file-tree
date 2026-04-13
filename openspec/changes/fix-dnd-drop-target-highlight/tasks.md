## 1. Fix Drop Target CSS

- [x] 1.1 Change `--vft-list-dropBackground` from `rgba(83, 89, 93, 0.5)` to `#062F4A` in `styles.css`
- [x] 1.2 Add `!important` to `.vft-row--drop-target` background rule
- [x] 1.3 Add `color: inherit !important` to `.vft-row--drop-target`
- [x] 1.4 Update `--vft-list-dropBackground` to `#062F4A` in `themes/dark.css`
- [x] 1.5 Update `--vft-list-dropBackground` to `#D6EBFF` in `themes/light.css`

## 2. Fix Drag Ghost to Pill Badge

- [x] 2.1 Change `.vft-drag-overlay` `background` to `var(--vft-list-activeSelectionBackground)`
- [x] 2.2 Change `.vft-drag-overlay` `color` to `var(--vft-list-activeSelectionForeground)`
- [x] 2.3 Set `border-radius: 10px` on `.vft-drag-overlay`
- [x] 2.4 Set `padding: 1px 7px` on `.vft-drag-overlay`
- [x] 2.5 Set `font-size: 12px` on `.vft-drag-overlay`
- [x] 2.6 Set `max-width: 120px`, `overflow: hidden`, `text-overflow: ellipsis` on `.vft-drag-overlay`
- [x] 2.7 Add `outline: 1px solid var(--vft-list-focusOutline)` and `outline-offset: -1px` on `.vft-drag-overlay`
- [x] 2.8 Remove `border` property from `.vft-drag-overlay` (replaced by outline)

## 3. Verification

- [x] 3.1 Run build — `pnpm build`
- [x] 3.2 Run tests — `pnpm --filter @vscode-file-tree/core exec vitest run`
- [ ] 3.3 Start Storybook and verify: folder drop target shows deep blue highlight, drag ghost is a pill badge, both match VS Code reference
