## ADDED Requirements

### Requirement: Arrow key navigation matches VS Code
The tree SHALL support arrow key navigation matching VS Code's exact behavior. Up/Down arrows move focus between visible items. Right arrow expands a collapsed folder or moves to first child. Left arrow collapses an expanded folder or moves to parent.

#### Scenario: Down arrow moves focus to next visible item
- **WHEN** focus is on a tree item and the user presses Down arrow
- **THEN** focus moves to the next visible item in the tree
- **AND** if the current item is the last visible item, focus does not move

#### Scenario: Up arrow moves focus to previous visible item
- **WHEN** focus is on a tree item and the user presses Up arrow
- **THEN** focus moves to the previous visible item in the tree
- **AND** if the current item is the first visible item, focus does not move

#### Scenario: Right arrow expands collapsed folder
- **WHEN** focus is on a collapsed folder and the user presses Right arrow
- **THEN** the folder expands to reveal its children
- **AND** focus remains on the folder

#### Scenario: Right arrow on expanded folder moves to first child
- **WHEN** focus is on an expanded folder and the user presses Right arrow
- **THEN** focus moves to the first child of the folder

#### Scenario: Right arrow on file node does nothing
- **WHEN** focus is on a file node (no children) and the user presses Right arrow
- **THEN** nothing happens (focus remains on the file node)

#### Scenario: Left arrow collapses expanded folder
- **WHEN** focus is on an expanded folder and the user presses Left arrow
- **THEN** the folder collapses
- **AND** focus remains on the folder

#### Scenario: Left arrow on collapsed folder moves to parent
- **WHEN** focus is on a collapsed folder (or file) and the user presses Left arrow
- **THEN** focus moves to the parent folder
- **AND** if the item has no parent (root level), focus does not move

### Requirement: Enter key opens files and toggles folders
The Enter key SHALL open the focused file (trigger the `onActivate` callback) or toggle the expand/collapse state of the focused folder.

#### Scenario: Enter on file triggers activation
- **WHEN** focus is on a file node and the user presses Enter
- **THEN** the `onActivate` callback is called with the file node's data

#### Scenario: Enter on folder toggles expansion
- **WHEN** focus is on a folder node and the user presses Enter
- **THEN** the folder's expanded state is toggled

### Requirement: F2 key initiates inline rename
Pressing F2 SHALL enter inline edit mode for the focused item, matching VS Code's rename behavior.

#### Scenario: F2 starts rename mode
- **WHEN** focus is on a tree item and the user presses F2
- **THEN** the item enters inline edit mode with the current name selected
- **AND** a text input replaces the item label

### Requirement: Delete key triggers delete action
Pressing Delete (or Backspace on macOS) SHALL trigger the `onDelete` callback for the currently selected items.

#### Scenario: Delete key on selected items
- **WHEN** one or more items are selected and the user presses Delete
- **THEN** the `onDelete` callback is called with the selected item IDs

### Requirement: Escape key clears selection and exits modes
Pressing Escape SHALL cancel any active mode (rename, filter) and clear the current selection.

#### Scenario: Escape during rename cancels edit
- **WHEN** an item is in inline edit mode and the user presses Escape
- **THEN** the edit is cancelled and the original name is restored

#### Scenario: Escape with active filter clears filter
- **WHEN** the filter widget is active and the user presses Escape
- **THEN** the filter is cleared and the full tree is restored

### Requirement: Ctrl+A selects all visible items
Pressing Ctrl+A (Cmd+A on macOS) SHALL select all currently visible items in the tree.

#### Scenario: Select all visible items
- **WHEN** the user presses Ctrl+A while the tree is focused
- **THEN** all visible (non-hidden) items in the tree become selected

### Requirement: Home and End keys navigate to first and last items
Home SHALL move focus to the first visible item. End SHALL move focus to the last visible item.

#### Scenario: Home key moves to first item
- **WHEN** the user presses Home
- **THEN** focus moves to the first visible item in the tree

#### Scenario: End key moves to last item
- **WHEN** the user presses End
- **THEN** focus moves to the last visible item in the tree

### Requirement: Shift+Arrow keys extend selection
Holding Shift while pressing Up/Down arrows SHALL extend the selection range from the anchor point.

#### Scenario: Shift+Down extends selection downward
- **WHEN** an item is focused and the user presses Shift+Down
- **THEN** focus moves to the next item and it is added to the selection
- **AND** the anchor point remains at the original item

#### Scenario: Shift+Up extends selection upward
- **WHEN** an item is focused and the user presses Shift+Up
- **THEN** focus moves to the previous item and it is added to the selection

### Requirement: Typeahead search jumps to matching items
Typing characters while the tree is focused SHALL jump focus to the next item whose name starts with the typed characters. The typeahead buffer SHALL reset after 500ms of inactivity.

#### Scenario: Typing a character jumps to matching item
- **WHEN** the tree is focused and the user types "p"
- **THEN** focus moves to the next visible item whose name starts with "p"

#### Scenario: Rapid typing builds search prefix
- **WHEN** the user types "pa" quickly (within 500ms)
- **THEN** focus moves to the next item whose name starts with "pa"

#### Scenario: Typeahead buffer resets after timeout
- **WHEN** the user types "p" and waits more than 500ms
- **THEN** the typeahead buffer is cleared
- **AND** subsequent typing starts a new search
