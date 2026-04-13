## Context

This is a Storybook-only change. No source code modifications needed — just a new story file showcasing the sidebar background and drag-and-drop visual parity changes.

## Goals / Non-Goals

**Goals:**
- Create a dedicated story file for background and DnD visual showcase
- Each story demonstrates one visual aspect with clear instructions
- Stories use the existing `sampleTree` data and `moveNodes` utility

**Non-Goals:**
- Modifying component source code
- Adding new component features
- Changing existing stories

## Decisions

### 1. Story organization

**Decision:** Create a single new file `BackgroundAndDnD.stories.tsx` under `title: "Visual Parity"`.

**Rationale:** Groups all visual parity stories under one Storybook section. Doesn't pollute existing `Interactions` or `Features` categories which focus on functionality.

### 2. Side-by-side background comparison

**Decision:** The Sidebar Background story renders two trees side by side — one on `#252526` (correct sidebar) and one on `#1e1e1e` (old editor background) — so the difference is immediately visible.

**Rationale:** The colors are close enough that seeing one in isolation may not reveal the issue. A direct comparison makes the fix obvious.

## Risks / Trade-offs

None — purely additive Storybook content.
