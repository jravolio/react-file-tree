## ADDED Requirements

### Requirement: Icons resolve by file extension
The tree SHALL resolve file icons by file extension using a configurable icon theme mapping. The mapping SHALL support compound extensions (e.g., `.test.ts`, `.module.css`).

#### Scenario: TypeScript file gets TypeScript icon
- **WHEN** a file named "index.ts" is rendered
- **THEN** the TypeScript icon is displayed based on the `.ts` extension mapping

#### Scenario: Compound extension takes priority
- **WHEN** a file named "app.test.ts" is rendered and the icon theme has both `.ts` and `.test.ts` mappings
- **THEN** the `.test.ts` icon is used (more specific match wins)

### Requirement: Icons resolve by folder name
The tree SHALL resolve folder icons by folder name using a configurable mapping (e.g., "node_modules" gets a special icon, "src" gets a special icon).

#### Scenario: Known folder name gets special icon
- **WHEN** a folder named "node_modules" is rendered
- **THEN** the node_modules-specific folder icon is displayed

#### Scenario: Unknown folder name gets default folder icon
- **WHEN** a folder named "my-custom-folder" is rendered with no specific mapping
- **THEN** the default folder icon is displayed

### Requirement: Icons resolve by exact filename
The tree SHALL support icon resolution by exact filename (e.g., "package.json", ".gitignore", "Dockerfile").

#### Scenario: package.json gets npm icon
- **WHEN** a file named "package.json" is rendered
- **THEN** the npm/package.json-specific icon is displayed

#### Scenario: Filename match takes priority over extension
- **WHEN** a file named "tsconfig.json" is rendered and the theme has both a `.json` extension mapping and a `tsconfig.json` filename mapping
- **THEN** the `tsconfig.json` filename icon is used

### Requirement: Icon themes are pluggable
The tree SHALL accept an `iconTheme` prop that defines the complete icon mapping. A default Seti-inspired theme SHALL be provided as an optional import.

#### Scenario: Custom icon theme overrides defaults
- **WHEN** the consumer provides a custom `iconTheme` prop
- **THEN** all icon resolution uses the custom theme

#### Scenario: Default icon theme works out of box
- **WHEN** no `iconTheme` prop is provided
- **THEN** the tree uses the built-in default icon theme

### Requirement: Expanded folder icons differ from collapsed
Expanded folders SHALL display a different icon than collapsed folders (e.g., open folder vs closed folder), matching VS Code behavior.

#### Scenario: Collapsed folder shows closed icon
- **WHEN** a folder "src" is collapsed
- **THEN** the closed folder icon is displayed

#### Scenario: Expanded folder shows open icon
- **WHEN** a folder "src" is expanded
- **THEN** the open folder icon is displayed

### Requirement: Icons support SVG and CSS class approaches
The icon theme system SHALL support icons defined as SVG strings/components or as CSS class names, allowing consumers to use either approach.

#### Scenario: SVG icon renders inline
- **WHEN** the icon theme defines a `.ts` icon as an SVG React component
- **THEN** the SVG is rendered inline next to the file label

#### Scenario: CSS class icon applies class name
- **WHEN** the icon theme defines a `.ts` icon as a CSS class `"codicon-file-typescript"`
- **THEN** the icon element has the specified CSS class applied
