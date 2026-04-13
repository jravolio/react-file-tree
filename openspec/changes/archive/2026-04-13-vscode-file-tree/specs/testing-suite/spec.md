## ADDED Requirements

### Requirement: Unit tests cover all tree state logic
Vitest unit tests SHALL cover all tree state management: expansion, selection, focus, filtering, decoration resolution, and compact folder computation.

#### Scenario: Expansion state tests
- **WHEN** the test suite runs expansion-related tests
- **THEN** tests verify: expand folder, collapse folder, collapse all, expand to node, toggle expansion, nested collapse clears descendant selection

#### Scenario: Selection state tests
- **WHEN** the test suite runs selection-related tests
- **THEN** tests verify: single select, multi-select (Ctrl+Click), range select (Shift+Click), select all, clear selection, selection preserved across expand/collapse

### Requirement: Unit tests cover keyboard navigation logic
Vitest unit tests SHALL cover all keyboard navigation state transitions independently from DOM rendering.

#### Scenario: Arrow navigation tests
- **WHEN** the test suite runs keyboard navigation tests
- **THEN** tests verify: down arrow moves focus, up arrow moves focus, right arrow expands/enters, left arrow collapses/exits, Home/End, boundaries (first/last item)

### Requirement: Integration tests cover user interactions
Playwright tests SHALL cover end-to-end user interactions in a real browser: click to select, keyboard navigation, drag-and-drop, inline rename, context menu, filter search.

#### Scenario: Click interaction tests
- **WHEN** the Playwright test suite runs click tests
- **THEN** tests verify: single click selects, Ctrl+Click multi-selects, Shift+Click range selects, double click activates, right click opens context menu

#### Scenario: Drag-and-drop interaction tests
- **WHEN** the Playwright test suite runs DnD tests
- **THEN** tests verify: drag file to folder, drag multiple items, cancel drag with Escape, auto-expand on hover, invalid drop target rejection

#### Scenario: Inline editing interaction tests
- **WHEN** the Playwright test suite runs inline editing tests
- **THEN** tests verify: F2 starts rename, Enter confirms, Escape cancels, blur confirms, new file creation, new folder creation, validation errors

### Requirement: Visual regression tests capture styling
Playwright screenshot tests SHALL capture the tree in key visual states for regression detection.

#### Scenario: Visual states captured
- **WHEN** the visual regression test suite runs
- **THEN** screenshots are captured for: default state, selected item, hovered item, focused item, drag in progress, context menu open, filter active, inline edit active, dark theme, light theme

### Requirement: Accessibility tests verify ARIA compliance
Automated accessibility tests SHALL verify correct ARIA attributes, keyboard operability, and color contrast.

#### Scenario: ARIA attribute tests
- **WHEN** the accessibility test suite runs
- **THEN** tests verify: tree has role="tree", items have role="treeitem", expanded folders have aria-expanded="true", selected items have aria-selected="true", tree has aria-label

#### Scenario: Keyboard operability tests
- **WHEN** the keyboard accessibility test suite runs
- **THEN** tests verify: all interactive elements are reachable via keyboard, focus is visible, no keyboard traps exist

### Requirement: Performance benchmarks prevent regression
A performance test suite SHALL measure and assert on key metrics: initial render time, scroll frame rate, expand/collapse response time for trees with 10,000+ nodes.

#### Scenario: Initial render performance
- **WHEN** the performance benchmark runs with a 10,000-node tree
- **THEN** initial render completes in under 100ms

#### Scenario: Scroll performance
- **WHEN** the performance benchmark scrolls through a 10,000-node tree
- **THEN** average frame rate stays above 55fps

### Requirement: Tests follow VS Code's testing patterns
The test structure SHALL mirror VS Code's test organization: tests co-located near source, `.test.ts` file naming, describe/it block structure, setup/teardown patterns.

#### Scenario: Test file naming and location
- **WHEN** a source file exists at `packages/core/src/useTreeState.ts`
- **THEN** its test file exists at `packages/core/src/__tests__/useTreeState.test.ts`

#### Scenario: Test structure uses describe/it pattern
- **WHEN** a test file is opened
- **THEN** it uses `describe` blocks for grouping and `it` blocks for individual test cases
