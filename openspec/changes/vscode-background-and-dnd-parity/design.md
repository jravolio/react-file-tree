## Context

The tree component currently has no `background-color` — it inherits from its parent. Storybook demos wrap it in a container with `background: #1e1e1e` (VS Code's editor background), but VS Code's sidebar/explorer panel uses `#252526`. The drag overlay uses a blue selection-colored pill (`#04395e`) with `border-radius: 4px` and `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4)`, which looks more like a tooltip than VS Code's minimal drag ghost.

VS Code's actual sidebar and drag ghost colors (from the default Dark+ theme):
- Sidebar background: `#252526`
- Light theme sidebar: `#f3f3f3`
- Drag ghost: uses the `sideBar.background` with a border, no heavy shadow
- Drop highlight: `list.dropBackground` = `rgba(83, 89, 93, 0.5)` (matches our current value)

## Goals / Non-Goals

**Goals:**
- Tree component has a correct default background color matching VS Code's sidebar
- Drag overlay visually matches VS Code's drag ghost style
- Storybook demos use the correct sidebar background
- Theme files include sidebar background variable

**Non-Goals:**
- Changing drag-and-drop logic or behavior (auto-expand, drop validation, etc.)
- Adding new DnD features (sort between, nested drop indicators)
- Changing any component APIs or props

## Decisions

### 1. Add `--vft-sideBar-background` CSS variable

**Decision:** Add a new CSS variable `--vft-sideBar-background` to `.vft-tree` and apply it as `background-color`. Default to `#252526` for dark theme.

**Rationale:** VS Code's sidebar uses `sideBar.background` token. Our naming convention follows `--vft-<VS Code token name>`. This lets consumers override it, and the vscode-bridge theme can map it from `--vscode-sideBar-background`.

### 2. Drag overlay styling to match VS Code

**Decision:** Update `.vft-drag-overlay` to:
- Background: `var(--vft-sideBar-background)` with slight transparency
- Border: `1px solid var(--vft-tree-tableColumnsBorder)`
- Remove `border-radius: 4px` (VS Code uses none or minimal)
- Reduce `box-shadow` to a subtler `0 1px 3px rgba(0, 0, 0, 0.3)`
- Keep current font sizing and layout

**Rationale:** VS Code's drag ghost is a minimal card that blends with the sidebar, not a prominent floating pill. The reference image confirms this — the drag preview is a subtle, semi-transparent overlay.

### 3. Update Storybook decorator backgrounds

**Decision:** Change all story decorator `background` values from `#1e1e1e` to `#252526`.

**Rationale:** Stories should demonstrate the component as it would appear in a VS Code sidebar context, not the editor context.

## Risks / Trade-offs

**[Consumers may have set their own background on a parent]** → The tree's `background-color` can be overridden via the CSS variable. Since we previously had no background, consumers who relied on the parent's background might see a double-background. This is low risk since the sidebar color is very close to common dark backgrounds.

**[Drag overlay change is purely visual]** → No functional changes. If the styling doesn't match perfectly, it can be tuned without any code changes.
