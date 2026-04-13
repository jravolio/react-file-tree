## ADDED Requirements

### Requirement: Drop target background uses correct VS Code color
The `.vft-row--drop-target` class SHALL use `--vft-list-dropBackground` with value `#062F4A` for dark theme and `#D6EBFF` for light theme, matching VS Code's `listDropOverBackground` token.

#### Scenario: Dark theme drop target
- **WHEN** a user drags an item over a folder in dark theme
- **THEN** the folder row shows a deep blue background (`#062F4A`)

#### Scenario: Light theme drop target
- **WHEN** a user drags an item over a folder in light theme
- **THEN** the folder row shows a light blue background (`#D6EBFF`)

### Requirement: Drop target background overrides all row states
The `.vft-row--drop-target` background SHALL use `!important` to ensure it is visible even when the target row is selected, hovered, or focused, matching VS Code's `DefaultStyleController` behavior.

#### Scenario: Drop target on selected row
- **WHEN** a user drags an item over a folder that is currently selected
- **THEN** the folder row shows the drop background color, not the selection color

#### Scenario: Drop target on hovered row
- **WHEN** a user drags an item over a folder (which triggers hover)
- **THEN** the folder row shows the drop background color, not the hover color

### Requirement: Drag ghost matches VS Code's pill badge
The `.vft-drag-overlay` SHALL visually match VS Code's `.monaco-drag-image`: pill-shaped (`border-radius: 10px`), compact (`padding: 1px 7px`, `font-size: 12px`, `max-width: 120px`), using active selection colors and focus outline.

#### Scenario: Single item drag ghost
- **WHEN** a user drags a single tree node
- **THEN** the drag overlay appears as a compact pill badge with the node's name, selection background/foreground colors, and a 1px focus outline

#### Scenario: Long filename truncation
- **WHEN** a user drags a node with a long filename
- **THEN** the drag overlay truncates the name with ellipsis at 120px max width

### Requirement: Drop target preserves text color
The `.vft-row--drop-target` SHALL apply `color: inherit !important` to prevent text color changes when the drop highlight is active.

#### Scenario: Text remains readable on drop target
- **WHEN** a user drags an item over a folder
- **THEN** the folder row text color remains the inherited color, not the selection foreground
