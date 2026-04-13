## ADDED Requirements

### Requirement: Right-click opens context menu at cursor position
Right-clicking on a tree item SHALL open a context menu positioned at the cursor location, matching VS Code's context menu behavior.

#### Scenario: Right-click on file shows file context menu
- **WHEN** the user right-clicks on a file item
- **THEN** a context menu appears at the cursor position
- **AND** the menu contains file-relevant actions (Open, Rename, Delete, Copy, Cut, Copy Path, Copy Relative Path)
- **AND** the right-clicked item becomes selected if not already

#### Scenario: Right-click on folder shows folder context menu
- **WHEN** the user right-clicks on a folder item
- **THEN** a context menu appears with folder-relevant actions (New File, New Folder, Rename, Delete, Copy, Cut, Collapse Folder, Copy Path)

#### Scenario: Right-click on empty area shows background context menu
- **WHEN** the user right-clicks on empty space within the tree
- **THEN** a context menu appears with background actions (New File, New Folder, Paste, Collapse All)

### Requirement: Context menu supports keyboard navigation
The context menu SHALL support keyboard navigation: Up/Down arrows to move between items, Enter to select, Escape to close.

#### Scenario: Arrow keys navigate menu items
- **WHEN** the context menu is open and the user presses Down arrow
- **THEN** focus moves to the next menu item

#### Scenario: Enter selects menu item
- **WHEN** a menu item is focused and the user presses Enter
- **THEN** the menu item's action is executed
- **AND** the context menu closes

#### Scenario: Escape closes menu
- **WHEN** the context menu is open and the user presses Escape
- **THEN** the context menu closes
- **AND** focus returns to the tree item that was right-clicked

### Requirement: Context menu supports extensible action registration
The tree SHALL accept a `contextMenuItems` prop that allows consumers to define custom context menu actions with conditions for when they appear.

#### Scenario: Custom action appears in context menu
- **WHEN** the consumer registers a custom action `{ label: "Deploy", when: (node) => node.type === 'file' }`
- **AND** the user right-clicks on a file
- **THEN** the "Deploy" action appears in the context menu

#### Scenario: Conditional action hidden when condition is false
- **WHEN** a custom action has `when: (node) => node.type === 'folder'`
- **AND** the user right-clicks on a file
- **THEN** the action is not shown in the context menu

### Requirement: Context menu supports separators and grouping
The context menu SHALL support visual separators between groups of actions, matching VS Code's grouped menu layout.

#### Scenario: Separators divide action groups
- **WHEN** the context menu is configured with groups ["edit", "---", "file", "---", "custom"]
- **THEN** horizontal separator lines appear between the groups

### Requirement: Context menu closes on outside click
The context menu SHALL close when the user clicks anywhere outside the menu.

#### Scenario: Click outside closes menu
- **WHEN** the context menu is open and the user clicks outside it
- **THEN** the context menu closes

### Requirement: Context menu respects viewport boundaries
The context menu SHALL reposition itself to stay within the viewport if it would otherwise overflow the screen edges.

#### Scenario: Menu near right edge repositions left
- **WHEN** the user right-clicks near the right edge of the viewport
- **THEN** the context menu opens to the left of the cursor instead of the right
