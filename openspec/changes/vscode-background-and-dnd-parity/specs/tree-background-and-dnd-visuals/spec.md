## ADDED Requirements

### Requirement: Tree container has sidebar background color
The `.vft-tree` element SHALL have a `background-color` set via `--vft-sideBar-background` CSS variable, defaulting to `#252526` for the dark theme and `#f3f3f3` for the light theme, matching VS Code's `sideBar.background` token.

#### Scenario: Default dark theme background
- **WHEN** the tree renders with no custom theme overrides
- **THEN** the tree container has `background-color: #252526`

#### Scenario: Light theme background
- **WHEN** the light theme CSS is applied
- **THEN** the tree container has `background-color: #f3f3f3`

#### Scenario: Custom background override
- **WHEN** a consumer sets `--vft-sideBar-background: #ff0000` on a parent element
- **THEN** the tree container uses `background-color: #ff0000`

### Requirement: Drag overlay matches VS Code drag ghost styling
The `.vft-drag-overlay` SHALL visually match VS Code's drag ghost: using the sidebar background color, a subtle border, no border radius, and a minimal box shadow.

#### Scenario: Drag overlay appearance
- **WHEN** a user drags a tree node
- **THEN** the drag overlay has `background: var(--vft-sideBar-background)`, `border: 1px solid var(--vft-tree-tableColumnsBorder)`, no `border-radius`, and a subtle shadow (`0 1px 3px rgba(0, 0, 0, 0.3)`)

#### Scenario: Drag overlay content
- **WHEN** a user drags a single node
- **THEN** the drag overlay displays the node's name

#### Scenario: Multi-node drag overlay
- **WHEN** a user drags multiple selected nodes
- **THEN** the drag overlay displays the first node's name and a count badge showing the total number of dragged items

### Requirement: Storybook demos use sidebar background
All Storybook story decorators SHALL use `#252526` as the container background color instead of `#1e1e1e`, matching the VS Code sidebar context.

#### Scenario: Story container background
- **WHEN** any story renders with its default decorator
- **THEN** the wrapping container has `background: #252526`
