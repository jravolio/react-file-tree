## Context

After researching VS Code's official source code, the DnD visual feedback has three specific issues:

1. **Wrong drop background color**: Our `rgba(83, 89, 93, 0.5)` is a transparent gray. VS Code uses `#062F4A` (an opaque deep blue) from the `listDropOverBackground` token. This makes the highlight nearly invisible on our dark sidebar background.

2. **CSS specificity conflict**: VS Code's `DefaultStyleController` applies `background-color: <color> !important` on `.drop-target` rows. Without `!important`, our `.vft-row--drop-target` background gets overridden by `.vft-row:hover` and `.vft-row--selected` which are more specific or applied later in the cascade.

3. **Drag ghost was incorrectly restyled**: The previous change made the drag overlay use sidebar background with no border-radius. VS Code's actual `.monaco-drag-image` is a compact pill badge: `border-radius: 10px`, selection colors, focus outline, 12px font, max-width 120px.

**VS Code source references:**
- `src/vs/base/browser/ui/list/listWidget.ts` — `DefaultStyleController` with `!important` drop target styles
- `src/vs/base/browser/ui/dnd/dnd.css` — `.monaco-drag-image` pill badge
- `src/vs/platform/theme/common/colors/listColors.ts` — `listDropOverBackground` = `#062F4A`

## Goals / Non-Goals

**Goals:**
- Drop target background is clearly visible on folder hover during drag
- Drop target highlight overrides all other row states (selected, hovered, focused)
- Drag ghost matches VS Code's pill badge exactly
- Color values match VS Code's official theme tokens

**Non-Goals:**
- Adding "drop between" insertion lines (VS Code has this but it's a separate feature)
- Changing the 4-sector drop zone detection (our implementation only does "into folder" vs "after file")
- Changing DnD logic or auto-expand behavior

## Decisions

### 1. Use `!important` on drop target background

**Decision:** Apply `background: var(--vft-list-dropBackground) !important` on `.vft-row--drop-target`.

**Rationale:** This matches VS Code exactly. The drop highlight must always be visible regardless of whether the row is selected, hovered, or focused. `!important` is the correct tool here — it's not a hack, it's the intended pattern from VS Code's own codebase.

### 2. Revert drag overlay to pill badge

**Decision:** Restore `.vft-drag-overlay` to: `border-radius: 10px`, `padding: 1px 7px`, `font-size: 12px`, `max-width: 120px`, `background: var(--vft-list-activeSelectionBackground)`, `color: var(--vft-list-activeSelectionForeground)`, `outline: 1px solid var(--vft-list-focusOutline)`, `outline-offset: -1px`.

**Rationale:** The VS Code `.monaco-drag-image` is definitively a pill badge, not a sidebar-colored card. The previous change was based on a misinterpretation of the reference image.

### 3. Update drop background color values

**Decision:** Change `--vft-list-dropBackground` to:
- Dark: `#062F4A` (opaque deep blue)
- Light: `#D6EBFF` (light blue tint)

**Rationale:** These are the exact values from VS Code's `listDropOverBackground` token definition in `listColors.ts`.

## Risks / Trade-offs

**[Previous change values being overwritten]** → The `vscode-background-and-dnd-parity` change set different values. This change corrects them based on VS Code source code research. No risk since we're converging toward the official implementation.
