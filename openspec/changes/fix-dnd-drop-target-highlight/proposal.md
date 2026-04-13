## Why

The drag-and-drop drop target highlight on folders is not visible — the background doesn't change when dragging over a folder. Additionally, the drag ghost overlay and drop background color don't match VS Code's official implementation. After researching VS Code's source code (`src/vs/base/browser/ui/list/listWidget.ts`, `src/vs/base/browser/ui/dnd/dnd.ts`), several discrepancies were found that need correction to achieve 1:1 parity.

## What Changes

- **Fix drop background color** — Change `--vft-list-dropBackground` from `rgba(83, 89, 93, 0.5)` to `#062F4A` (VS Code Dark+ default from `listDropOverBackground` token). Light theme: `#D6EBFF`.
- **Fix drop target CSS specificity** — Add `!important` to `.vft-row--drop-target` background, matching VS Code's `DefaultStyleController` which uses `!important` to ensure drop highlighting always shows over selected/hovered/focused states.
- **Fix drag ghost to pill badge** — Revert drag overlay to match VS Code's `.monaco-drag-image`: `border-radius: 10px`, `padding: 1px 7px`, `font-size: 12px`, `max-width: 120px`, background from `--vft-list-activeSelectionBackground`, color from `--vft-list-activeSelectionForeground`, `outline: 1px solid var(--vft-list-focusOutline)`, `outline-offset: -1px`. Remove the sidebar-colored styling from the previous change.
- **Add color inherit on drop target** — VS Code applies `color: inherit !important` on drop targets to prevent text color changes.

## Capabilities

### New Capabilities
- `dnd-visual-parity`: Drag-and-drop visual feedback matching VS Code's official implementation exactly.

### Modified Capabilities
_(No existing specs modified.)_

## Impact

- **CSS** — `styles.css`: update `.vft-row--drop-target` and `.vft-drag-overlay` styles. Theme variable values.
- **Theme files** — Update `--vft-list-dropBackground` in `dark.css`, `light.css`, base `styles.css`.
- **No API changes** — No prop, callback, or type changes.
