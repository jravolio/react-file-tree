## ADDED Requirements

### Requirement: Inline rename replaces label with text input
When rename mode is activated (F2, context menu, or API), the item's label SHALL be replaced with an editable text input pre-filled with the current name, with the name portion (without extension) selected.

#### Scenario: F2 activates rename with name selected
- **WHEN** the user presses F2 on a focused file "index.ts"
- **THEN** a text input appears in place of the label
- **AND** the text "index" is selected (extension ".ts" is not selected)
- **AND** the input is focused and ready for typing

#### Scenario: F2 on a folder selects the full name
- **WHEN** the user presses F2 on a focused folder "components"
- **THEN** a text input appears with the full name "components" selected

### Requirement: Enter confirms rename
Pressing Enter in the rename input SHALL confirm the rename and call the `onRename` callback with the item ID and new name.

#### Scenario: Confirm rename with Enter
- **WHEN** the user types "newName.ts" in the rename input and presses Enter
- **THEN** the `onRename` callback is called with `{ id, newName: "newName.ts" }`
- **AND** the text input is replaced by the label showing the new name
- **AND** focus returns to the tree item

### Requirement: Escape cancels rename
Pressing Escape SHALL cancel the rename operation and restore the original name.

#### Scenario: Cancel rename with Escape
- **WHEN** the user modifies the name in the rename input and presses Escape
- **THEN** the rename is cancelled
- **AND** the original name is restored
- **AND** focus returns to the tree item

### Requirement: Clicking outside confirms rename
Clicking outside the rename input (blur) SHALL confirm the rename, matching VS Code behavior.

#### Scenario: Blur confirms rename
- **WHEN** the user types a new name and clicks elsewhere in the tree
- **THEN** the rename is confirmed with the current input value
- **AND** the `onRename` callback is called

### Requirement: New file creation shows inline input
When the "New File" action is triggered, a new inline input SHALL appear at the correct position within the target folder, allowing the user to type the filename.

#### Scenario: New file inline input in folder
- **WHEN** the user triggers "New File" on a folder
- **THEN** the folder expands if collapsed
- **AND** an empty text input appears as the first child of the folder
- **AND** the input is focused and ready for typing

#### Scenario: Confirming new file creation
- **WHEN** the user types "newFile.ts" in the new file input and presses Enter
- **THEN** the `onCreate` callback is called with `{ parentId, name: "newFile.ts", type: "file" }`
- **AND** the input is replaced by a new tree item with the given name

#### Scenario: Cancelling new file creation
- **WHEN** the user presses Escape in the new file input
- **THEN** the input is removed
- **AND** no `onCreate` callback is called

### Requirement: New folder creation shows inline input
When the "New Folder" action is triggered, a new inline input SHALL appear at the correct position within the target folder for typing the folder name.

#### Scenario: New folder inline input
- **WHEN** the user triggers "New Folder" on a folder
- **THEN** the folder expands if collapsed
- **AND** an empty text input appears as the first child with a folder icon
- **AND** the input is focused and ready for typing

#### Scenario: Confirming new folder creation
- **WHEN** the user types "utils" in the new folder input and presses Enter
- **THEN** the `onCreate` callback is called with `{ parentId, name: "utils", type: "folder" }`

### Requirement: Rename input validates against invalid characters
The rename input SHALL prevent submission of names containing invalid filesystem characters (/, \, :, *, ?, ", <, >, |) and SHALL show a validation error.

#### Scenario: Invalid character shows error
- **WHEN** the user types "file/name.ts" in the rename input
- **THEN** a validation error message appears below the input
- **AND** pressing Enter does not confirm the rename

#### Scenario: Empty name shows error
- **WHEN** the user clears the rename input to empty
- **THEN** a validation error "A file or folder name must be provided" appears
- **AND** pressing Enter does not confirm the rename
