## Why

The tree component's background color and drag-and-drop visual feedback don't match VS Code's default dark theme. The component has no explicit background color (relying on the parent container), and the Storybook demos use `#1e1e1e` (editor background) instead of VS Code's sidebar background (`#252526`). The drag overlay uses a blue selection-colored pill with `border-radius: 4px` and heavy `box-shadow`, whereas VS Code's drag ghost is a minimal, semi-transparent label with the standard sidebar background styling.

## What Changes

- **Tree background color** — Add `--vft-sideBar-background` CSS variable to `.vft-tree` defaulting to `#252526` (VS Code Dark+ sidebar). Apply it as `background-color` on the tree container. Update dark/light theme files with the correct sidebar colors.
- **Drag overlay styling** — Update the `.vft-drag-overlay` to match VS Code's drag ghost: use sidebar background with slight transparency, remove heavy `box-shadow` and `border-radius`, use a 1px border matching the table column border color, and match VS Code's compact label style.
- **Drop target feedback** — Verify `--vft-list-dropBackground` value matches VS Code's exact `list.dropBackground` token. Ensure drop target highlighting applies correctly on folder rows during drag.
- **Storybook container backgrounds** — Update all story decorators to use `#252526` (sidebar) instead of `#1e1e1e` (editor) so demos look correct out of the box.

## Capabilities

### New Capabilities
- `tree-background-and-dnd-visuals`: Background color variable for the tree container and refined drag-and-drop visual feedback matching VS Code's file explorer.

### Modified Capabilities
_(No existing spec-level behavior changes — these are styling/visual fixes.)_

## Impact

- **CSS** — `styles.css`: add `background-color` to `.vft-tree`, update `.vft-drag-overlay` styling. Theme files: add sidebar background variable.
- **Storybook** — Update decorator `background` values in all story files.
- **No API changes** — No prop, callback, or type changes.
