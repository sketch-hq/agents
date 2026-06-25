# Symbol → code mapping patterns

Concrete patterns for translating Sketch symbols and overrides into code components. All names below are placeholders — replace them with whatever the document actually defines.

## Symbol → component

Each Sketch master maps to one code component. Each instance with different overrides maps to a different prop set of that component (not a separate component).

### Templating rule

```
Master: <Family>/<Variant>      → Component: <Family><Variant>
Overrides on instances:         → Props on the component
```

Don't model variants as separate components when the only difference is override values — drive variants from props.

### Override → prop mapping (general)

For the full MCP override surface, call `get_guide` with `topic: "symbols"`. Typical code mapping:

- `stringValue` on a Label/Text layer → `label`, `placeholder`, `title`, or `text`.
- `image` on an inner Image layer → `iconSrc`, `imageSrc`, or Image source.
- `textColor` / color swatch override → class name referencing a theme token, or a `tone` / `variant` prop.
- `symbolID` swap → child component `variant` prop.
- `isVisible` → conditional render (`{cond && <X />}`).
- `imageResizeBehavior` → platform `object-fit` / equivalent; use numeric values from `get_symbol_overrides` (see `get_guide` with `topic: "symbols"`).
- `horizontalSizing` / `verticalSizing` → layout container class (`flex-1`, `w-full`, fixed width prop).

### Worked example: a labeled-icon button

Sketch master `<Family>/<IconButton>` exposes two affected layers via `get_symbol_overrides`:

```
get_symbol_overrides(instanceId, kind: 'all') →
  commonOverrideIDPrefix=".../LABEL"   properties: stringValue, textColor, …
  commonOverrideIDPrefix=".../ICON"    properties: image, imageResizeBehavior, …
```

React:

```tsx
type IconButtonProps = {
  label: string
  iconSrc: string
  iconAlt?: string
  onClick?: () => void
}

export function IconButton({ label, iconSrc, iconAlt = '', onClick }: IconButtonProps) {
  return (
    <button type="button" onClick={onClick} className="...">
      <img src={iconSrc} alt={iconAlt} className="h-[17px] w-[17px]" />
      <span>{label}</span>
    </button>
  )
}

// Multiple Sketch instances of the same master → one component, data-driven list
const items = [
  { label: '<Label A>', iconSrc: '/assets/icon-a.png' },
  { label: '<Label B>', iconSrc: '/assets/icon-b.png' },
]
items.map((it) => <IconButton key={it.label} {...it} />)
```

SwiftUI sketch:

```swift
struct IconButton: View {
  let label: String
  let iconName: String
  var body: some View { /* HStack(icon + label) */ }
}
```

### Composition: symbols inside symbols

Mirror nesting in code. If an outer Sketch master *contains* an inner master, expose the outer component as a composition over the inner one, not flattened into a single component. This preserves the override model on the design side and keeps code refactors local.

Use `instance.overridesForExpandedLayer(nested)` (see `get_guide` with `topic: "symbols"`) to map nested overrides to the inner component's props.

## Symbol groups → page sections

Translate each major region group into its own component/section — not one monolithic file unless the project does. Parent/child and sibling structure must come from `get_layer_tree_summary` or a targeted hierarchy probe, not from an assumed page template.

For token and layout mapping, use [extraction.md](extraction.md). For asset export from symbol masters or image layers, use [assets.md](assets.md). For screenshot comparison, use [validation.md](validation.md).
