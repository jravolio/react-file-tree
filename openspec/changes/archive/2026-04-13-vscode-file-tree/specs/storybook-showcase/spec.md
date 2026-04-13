## ADDED Requirements

### Requirement: Storybook showcases all core features
The Storybook SHALL contain stories demonstrating every major feature of the tree component: basic rendering, expand/collapse, selection, keyboard navigation, drag-and-drop, inline editing, context menu, decorations, filtering, and theming.

#### Scenario: Basic tree story renders file structure
- **WHEN** the user opens the "Basic / File Tree" story
- **THEN** a tree is rendered with a sample file structure (folders, files, nesting)
- **AND** expand/collapse and selection work interactively

#### Scenario: Drag and drop story demonstrates reordering
- **WHEN** the user opens the "Interactions / Drag and Drop" story
- **THEN** the tree supports dragging items between folders
- **AND** visual drop indicators appear during drag

### Requirement: Storybook includes large tree performance story
A dedicated story SHALL demonstrate tree performance with 10,000+ nodes, showing smooth scrolling and interaction.

#### Scenario: Large tree story renders without lag
- **WHEN** the user opens the "Performance / Large Tree (10k nodes)" story
- **THEN** the tree renders with 10,000+ nodes
- **AND** scrolling is smooth
- **AND** expand/collapse operations are instant

### Requirement: Storybook includes accessibility story
A dedicated story SHALL demonstrate keyboard-only navigation and screen reader compatibility.

#### Scenario: Keyboard navigation story
- **WHEN** the user opens the "Accessibility / Keyboard Navigation" story
- **THEN** instructions for keyboard-only usage are displayed
- **AND** all keyboard shortcuts work (arrows, Enter, F2, Delete, Escape)

### Requirement: Storybook includes theming stories
Stories SHALL demonstrate dark theme, light theme, and custom theme configurations.

#### Scenario: Theme switcher story
- **WHEN** the user opens the "Theming / Theme Switcher" story
- **THEN** a control allows switching between dark, light, and custom themes
- **AND** the tree updates its appearance in real time

### Requirement: Storybook includes interaction tests
Stories SHALL include `play` functions that automate user interactions for regression testing.

#### Scenario: Interaction test verifies drag-and-drop
- **WHEN** the drag-and-drop story's `play` function executes
- **THEN** it programmatically drags an item, drops it into a folder
- **AND** verifies the tree structure updated correctly

#### Scenario: Interaction test verifies rename
- **WHEN** the inline editing story's `play` function executes
- **THEN** it programmatically triggers rename, types a new name, confirms
- **AND** verifies the item label updated

### Requirement: Storybook provides API documentation via controls
Each story SHALL expose relevant props as Storybook controls, allowing consumers to interactively configure the tree.

#### Scenario: Controls modify tree behavior
- **WHEN** the user toggles the "compactFolders" control in Storybook
- **THEN** the tree updates to show/hide compact folder paths
- **AND** the control reflects the current prop value

### Requirement: Storybook includes composition examples
Stories SHALL demonstrate common integration patterns: tree with preview panel, tree with breadcrumb, tree inside a resizable sidebar.

#### Scenario: Tree with preview panel example
- **WHEN** the user opens the "Examples / With Preview Panel" story
- **THEN** clicking a file in the tree shows a preview panel alongside it
