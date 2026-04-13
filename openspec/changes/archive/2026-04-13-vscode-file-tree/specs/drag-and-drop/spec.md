## ADDED Requirements

### Requirement: Items can be dragged to reorder within the tree
The tree SHALL allow dragging items (files and folders) and dropping them into folder targets to move them. The drag operation SHALL support both single and multi-selected items.

#### Scenario: Dragging a single file into a folder
- **WHEN** the user drags a file and drops it onto a folder
- **THEN** the `onMove` callback is called with the dragged item ID and target folder ID
- **AND** the tree updates to show the item in its new location

#### Scenario: Dragging multiple selected items
- **WHEN** multiple items are selected and the user drags any one of them
- **THEN** all selected items are included in the drag operation
- **AND** the drag preview shows the count of items being dragged

### Requirement: Drop zone indicators match VS Code's visual feedback
The tree SHALL display drop zone indicators during drag operations that match VS Code's exact visual feedback: a highlighted bar for drop-between positions and a highlighted folder background for drop-into-folder positions.

#### Scenario: Hovering over a folder during drag shows drop-into indicator
- **WHEN** the user drags an item and hovers over a folder
- **THEN** the folder's background is highlighted with the drop target color
- **AND** the folder is visually distinct from non-target items

#### Scenario: Hovering between items shows drop-between indicator
- **WHEN** the user drags an item and hovers between two items at the same level
- **THEN** a horizontal line indicator appears between the items showing the drop position

#### Scenario: Invalid drop target shows no indicator
- **WHEN** the user drags a folder and hovers over one of its own descendants
- **THEN** no drop indicator is shown (prevents circular nesting)

### Requirement: Auto-expand folders on drag hover
When dragging an item and hovering over a collapsed folder for 500ms, the folder SHALL automatically expand to allow dropping into its children.

#### Scenario: Folder auto-expands during drag hover
- **WHEN** the user drags an item and hovers over a collapsed folder for 500ms
- **THEN** the folder automatically expands
- **AND** the user can continue dragging into the folder's children

#### Scenario: Brief hover does not auto-expand
- **WHEN** the user drags an item and hovers over a collapsed folder for less than 500ms before moving away
- **THEN** the folder does not expand

### Requirement: Drag preview shows item representation
During a drag operation, the tree SHALL display a custom drag preview showing the dragged item's icon and name. For multi-item drags, the preview SHALL show the count.

#### Scenario: Single item drag preview
- **WHEN** the user starts dragging a single file
- **THEN** a drag preview appears showing the file's icon and name

#### Scenario: Multi-item drag preview
- **WHEN** the user starts dragging 5 selected items
- **THEN** a drag preview appears showing the first item's icon and name with a badge showing "5"

### Requirement: Drag operations are cancellable
The user SHALL be able to cancel a drag operation by pressing Escape or dropping in an invalid area.

#### Scenario: Escape cancels drag
- **WHEN** the user is dragging items and presses Escape
- **THEN** the drag operation is cancelled
- **AND** no items are moved
- **AND** all drop indicators are removed

#### Scenario: Drop in invalid area cancels operation
- **WHEN** the user drops items outside the tree or on an invalid target
- **THEN** the drag operation is cancelled and items remain in their original positions

### Requirement: Scroll during drag
The tree SHALL auto-scroll when the user drags an item near the top or bottom edge of the tree viewport.

#### Scenario: Dragging near bottom edge scrolls down
- **WHEN** the user drags an item within 40px of the tree's bottom edge
- **THEN** the tree automatically scrolls downward
- **AND** scrolling speed increases as the cursor gets closer to the edge

#### Scenario: Dragging near top edge scrolls up
- **WHEN** the user drags an item within 40px of the tree's top edge
- **THEN** the tree automatically scrolls upward
