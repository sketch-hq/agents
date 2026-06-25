# Extraction patterns

Use this reference when Step 3 needs more detail than the main workflow provides.

## Tool order

Start with read-only MCP tools:

1. `get_document_info` — document ID, pages, page layer counts, and top-level Frames/Graphics with positions and dimensions.
2. `get_layer_tree_summary` — hierarchy, IDs, names, dimensions, text snippets, symbol-instance override counts, and stack hints for a page, frame, or layer.
3. Targeted `run_code` — only for properties not exposed by the dedicated tools, such as exact style values, pins/sizing, masks, symbol master IDs, override-capable layers, export settings, image sources, or custom geometry checks.

## Large trees

Use shallow-to-deep extraction:

1. Shallow map with `get_document_info` and `get_layer_tree_summary` at a limited depth.
2. Identify the critical children that affect the requested implementation.
3. Deep-dive only those subtrees with `get_layer_tree_summary` using their IDs or a larger depth.
4. Use `run_code` only after required nodes are identified and a summary omits needed details.

Do not code from a partial tree when major sibling or parent regions are still unknown.

## Asset classification probe

Before implementation, identify actual bitmap layers and major groups that might be code, artwork, or mixed content. Use `get_layer_tree_summary` first, then run a targeted probe only when the summary does not make the asset/code split obvious.

Classification heuristics:

- `Image` layer under the target → export that layer and use it as a bitmap unless the user asks for reconstruction.
- Group with text descendants → implement text-bearing structure in code unless the group is itself represented by an `Image` layer.
- Group with no text descendants and many shape/path descendants → candidate for illustration export.
- Symbol instance used as logo/icon artwork → candidate for exact Sketch export unless it maps cleanly to an existing project asset.
- Mixed group with text plus illustration → code the container and text; export only the inner illustration/artwork child.

## What to collect

- Hierarchy: IDs, names, types, visibility, lock state, and parent/child relationships.
- Layout: frame, resizing behavior, pins, stack layout, gap, padding, clipping, major region geometry, and whether the frame represents a full page/screen or an explicitly scoped component/section.
- Typography: font family, size, weight, line height, alignment, decoration, and text content.
- Styling: fills, borders, shadows, blur, corner radii, opacity, tint, masks, and shared style names.
- Tokens: document swatches, color variables, shared style names, and optional source library names.
- Symbols: nested symbols, symbol instances, master names, instance IDs, and override-capable fields.
- Assets: configured `layer.exportFormats`, image sources, bitmap layers, icons, logos, pure artwork groups, text-bearing UI groups, and mixed groups that need code-plus-asset splitting.

## Tokens and layout mapping

Map Sketch swatches and shared styles to the project's token system. Prefer existing project variables over new literals.

- `Family/Background` (`#...`) → `family.background` / `--color-family-background`.
- `Family/Border` (`#...`) → `family.border`.
- `Family/Brand` (`#...`) → `family.brand`.
- `Family/Text Primary` (`#...`) → `family.textPrimary`.
- `Family/Text Muted` (`#...`) → `family.textMuted`.

Map stack properties from summaries or targeted probes:

- `direction: Column` → `flex-col`.
- `direction: Row` → `flex-row`.
- `gap: N` → `gap-[Npx]` or a scale token if it matches.
- `padding: N` → `p-[Npx]`.
- `alignItems: Stretch` → `items-stretch`.
- `justifyContent: Start/Center/...` → `justify-start/center/...`.

Do not hand-eyeball gap values. Read them from `get_layer_tree_summary` when available, or with a short targeted `run_code` probe when the summary lacks the needed detail.

## Responsive layout intent

Assume the target frame defines a full page or screen unless the user explicitly says it is a partial component, section, or crop. Use the frame dimensions as the reference viewport for visual parity.

When Sketch exposes stacks, pins/resizing, or other relative layout constraints, translate those into responsive code rather than fixed absolute placement. When the design has no clear relative layout metadata, match the layout at the frame's viewport first, then keep containers, text, spacing, and media flexible for nearby viewport sizes where that does not change the reference appearance.

## Swatch probe example

```javascript
const sketch = require('sketch');
const doc = sketch.getSelectedDocument();
function hex(c) { return c ? String(c).slice(0, 7) : null; }
const swatches = doc.swatches.map(function (s) {
  return { name: s.name, hex: hex(s.color) };
});
console.log(JSON.stringify({ ok: true, swatches: swatches }));
```
