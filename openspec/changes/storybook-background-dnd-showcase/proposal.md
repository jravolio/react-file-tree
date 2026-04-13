## Why

The recent background and drag-and-drop visual parity changes (`--vft-sideBar-background`, drag overlay restyling) have no dedicated Storybook stories to showcase and validate them. The existing DragAndDrop story in `Interactions.stories.tsx` demonstrates the move logic but doesn't focus on the visual aspects: sidebar background color, drag ghost appearance, drop target highlighting, or multi-select drag overlay styling. Dedicated stories make it easy to visually verify these match the VS Code reference.

## What Changes

- **New story file** `BackgroundAndDnD.stories.tsx` under `apps/storybook/src/stories/` with the following stories:
  - **Sidebar Background** — Shows the tree with the correct `#252526` sidebar background, with a side-by-side comparison against the editor background (`#1e1e1e`) to demonstrate the difference.
  - **Drag Ghost Styling** — DnD-enabled tree with instructions to drag items and observe the minimal drag overlay (sidebar-colored, no border-radius, subtle shadow).
  - **Multi-Select Drag** — DnD-enabled tree with pre-selected items to demonstrate the count badge on the drag overlay.
  - **Drop Target Highlight** — DnD-enabled tree showcasing the `list.dropBackground` highlight when hovering over folder drop targets.
  - **Auto-Expand on Hover** — DnD-enabled tree with collapsed folders to demonstrate the 500ms auto-expand behavior when dragging over a folder.

## Capabilities

### New Capabilities
- `background-dnd-stories`: Storybook stories dedicated to showcasing sidebar background color and drag-and-drop visual feedback.

### Modified Capabilities
_(None)_

## Impact

- **Storybook only** — New story file, no source code changes.
- **No API changes** — No props, types, or behavior changes.
