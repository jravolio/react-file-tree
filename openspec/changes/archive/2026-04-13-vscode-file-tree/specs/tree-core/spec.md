## ADDED Requirements

### Requirement: Virtual scrolling renders only visible nodes
The tree SHALL use virtual scrolling to render only the nodes within the visible viewport plus a configurable overscan buffer. The DOM SHALL contain at most `viewportNodes + (2 * overscanCount)` tree item elements at any time, regardless of the total node count.

#### Scenario: Large tree renders efficiently
- **WHEN** a tree with 10,000 nodes is rendered in a 500px tall container with 32px row height
- **THEN** the DOM contains at most ~20 tree item elements (viewport nodes + overscan)
- **AND** scrolling is smooth with no frame drops below 60fps

#### Scenario: Scrolling updates visible nodes
- **WHEN** the user scrolls down by 200px
- **THEN** nodes that leave the viewport above are removed from DOM
- **AND** new nodes entering the viewport below are added to DOM
- **AND** the scroll position is visually continuous (no jumps)

### Requirement: Tree supports expand and collapse of folders
The tree SHALL allow folder nodes to be expanded and collapsed. Expanding a folder SHALL reveal its children. Collapsing a folder SHALL hide all descendants.

#### Scenario: Expanding a collapsed folder
- **WHEN** a collapsed folder node is expanded
- **THEN** its direct children become visible in the tree
- **AND** the folder's twistie icon rotates to the expanded state
- **AND** the flat visible-node list is updated to include the children

#### Scenario: Collapsing an expanded folder
- **WHEN** an expanded folder node is collapsed
- **THEN** all its descendants are hidden from the tree
- **AND** the folder's twistie icon rotates to the collapsed state
- **AND** any selection within collapsed descendants is cleared

#### Scenario: Collapse all folders
- **WHEN** the user triggers the "Collapse All" action
- **THEN** all expanded folders in the tree are collapsed to show only root-level items

### Requirement: Tree supports single and multi-selection
The tree SHALL support single selection (click), additive selection (Ctrl/Cmd+Click), and range selection (Shift+Click). Selection state SHALL be visually indicated with a distinct background color.

#### Scenario: Single click selects one item
- **WHEN** the user clicks on a tree item
- **THEN** that item becomes the only selected item
- **AND** any previously selected items are deselected
- **AND** the selected item displays the active selection background color

#### Scenario: Ctrl/Cmd+Click toggles individual selection
- **WHEN** the user Ctrl+Clicks (Cmd+Click on macOS) on a tree item
- **THEN** that item's selection state is toggled
- **AND** all other selections remain unchanged

#### Scenario: Shift+Click selects a range
- **WHEN** the user Shift+Clicks on a tree item
- **THEN** all visible items between the anchor (last clicked) item and the clicked item become selected
- **AND** the previous selection is replaced by this range

### Requirement: Tree maintains focus state separate from selection
The tree SHALL track a focused item independently from selected items. The focused item SHALL have a visible focus indicator (outline or border). Only one item can be focused at a time.

#### Scenario: Focus follows keyboard navigation
- **WHEN** the user presses the Down arrow key
- **THEN** focus moves to the next visible item
- **AND** the focus indicator moves to the newly focused item
- **AND** selection does not change (unless Shift is held)

#### Scenario: Focus indicator is visible
- **WHEN** an item has focus
- **THEN** a focus outline/border is rendered around that item
- **AND** the focus style is distinct from the selection style

### Requirement: Tree supports controlled and uncontrolled modes
The tree SHALL work in uncontrolled mode (manages its own expansion/selection state) by default. The tree SHALL also support controlled mode where the consumer provides state and change handlers.

#### Scenario: Uncontrolled mode with default state
- **WHEN** a tree is rendered without `expandedIds` or `selectedIds` props
- **THEN** the tree manages expansion and selection internally
- **AND** all folders start collapsed by default (unless `defaultExpandedIds` is provided)

#### Scenario: Controlled expansion state
- **WHEN** a tree is rendered with `expandedIds` and `onExpandChange` props
- **THEN** the tree uses the provided `expandedIds` for rendering
- **AND** expansion changes call `onExpandChange` instead of modifying internal state

### Requirement: Tree exposes imperative API via ref
The tree SHALL expose an imperative API via React ref that allows programmatic control: `open(id)`, `close(id)`, `select(ids)`, `scrollTo(id)`, `focus(id)`.

#### Scenario: Programmatic scroll to node
- **WHEN** `treeRef.current.scrollTo('deep-nested-id')` is called
- **THEN** the tree scrolls to make the target node visible
- **AND** all ancestor folders are expanded if collapsed
- **AND** the target node receives focus

### Requirement: Tree uses ARIA tree pattern
The tree root SHALL have `role="tree"`. Each node SHALL have `role="treeitem"`. Expandable nodes SHALL have `aria-expanded`. Selected nodes SHALL have `aria-selected="true"`. The tree SHALL have an accessible label via `aria-label` or `aria-labelledby`.

#### Scenario: Screen reader announces tree structure
- **WHEN** a screen reader user focuses the tree
- **THEN** the screen reader announces it as a tree with the provided label
- **AND** each item is announced with its name, level, position in set, and expanded/collapsed state

#### Scenario: Aria attributes update on state change
- **WHEN** a folder is expanded
- **THEN** its `aria-expanded` attribute changes from `"false"` to `"true"`
- **AND** the screen reader announces the state change
