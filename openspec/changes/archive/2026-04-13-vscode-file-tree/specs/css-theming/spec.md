## ADDED Requirements

### Requirement: All visual properties are configurable via CSS custom properties
The tree SHALL use CSS custom properties for all colors, spacings, and visual effects. No hardcoded colors SHALL exist in the component styles.

#### Scenario: Selection background is themeable
- **WHEN** the consumer sets `--vft-list-activeSelectionBackground: #264f78`
- **THEN** selected items display with that background color

#### Scenario: All CSS variables have sensible defaults
- **WHEN** no CSS variables are overridden by the consumer
- **THEN** the tree renders with a VS Code dark theme appearance by default

### Requirement: CSS variable naming mirrors VS Code's token system
The tree SHALL use CSS custom properties that map 1:1 to VS Code's theme tokens, using the `--vft-` prefix instead of `--vscode-`.

#### Scenario: List tokens are available
- **WHEN** the tree is rendered
- **THEN** the following CSS variables are available and functional:
  - `--vft-list-activeSelectionBackground`
  - `--vft-list-activeSelectionForeground`
  - `--vft-list-hoverBackground`
  - `--vft-list-hoverForeground`
  - `--vft-list-focusBackground`
  - `--vft-list-focusForeground`
  - `--vft-list-focusOutline`
  - `--vft-list-inactiveSelectionBackground`
  - `--vft-list-dropBackground`

#### Scenario: Tree-specific tokens are available
- **WHEN** the tree is rendered
- **THEN** the following CSS variables are available and functional:
  - `--vft-tree-indentGuidesStroke`
  - `--vft-tree-inactiveIndentGuidesStroke`
  - `--vft-tree-tableColumnsBorder`

### Requirement: Built-in dark and light themes
The tree SHALL ship with two built-in themes (dark and light) that match VS Code's default dark and light themes. Consumers apply a theme by importing the corresponding CSS file.

#### Scenario: Dark theme matches VS Code Dark+
- **WHEN** the consumer imports `@vscode-file-tree/react/themes/dark.css`
- **THEN** the tree renders with colors matching VS Code's Dark+ theme

#### Scenario: Light theme matches VS Code Light+
- **WHEN** the consumer imports `@vscode-file-tree/react/themes/light.css`
- **THEN** the tree renders with colors matching VS Code's Light+ theme

### Requirement: VS Code variable bridge
The tree SHALL provide an optional CSS file that maps `--vscode-*` variables to `--vft-*` variables, so the tree automatically inherits styling when used inside a VS Code webview or VS Code-themed application.

#### Scenario: Tree inherits VS Code webview theme
- **WHEN** the tree is rendered inside a VS Code webview that provides `--vscode-list-activeSelectionBackground`
- **AND** the consumer imports `@vscode-file-tree/react/themes/vscode-bridge.css`
- **THEN** the tree uses the webview's selection background color via the bridge mapping

### Requirement: Hover and focus states use theme colors
Hover and focus visual states SHALL use the configured CSS variables, not hardcoded opacity or filter values.

#### Scenario: Hover state uses theme color
- **WHEN** the user hovers over a tree item
- **THEN** the item's background changes to `--vft-list-hoverBackground`
- **AND** the item's text color changes to `--vft-list-hoverForeground`

#### Scenario: Focus state uses theme color
- **WHEN** a tree item receives focus
- **THEN** the item displays an outline using `--vft-list-focusOutline`

### Requirement: Indent guides use theme stroke color
Indent guide lines SHALL be styled using the `--vft-tree-indentGuidesStroke` CSS variable.

#### Scenario: Indent guides are visible with theme color
- **WHEN** a tree has nested items
- **THEN** vertical indent guide lines are rendered using `--vft-tree-indentGuidesStroke` color
- **AND** the guides connect parent-child relationships visually
