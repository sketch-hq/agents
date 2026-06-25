# Reference extraction

Use this reference when Step 1 needs more detail for URL, screenshot, or code inputs. Record region structure carefully: what is sibling to what, what is full-bleed vs in-column, and what is fixed/pinned vs scrolling.

## Do not sketch from memory

Every layout decision, color, font size, and string should trace back to something captured below. If a value is unknown, measure or sample it from the reference before drawing.

## Fidelity spec (write this before drawing)

After extraction, produce a short written spec the validation loop will check against:

```
Regions (top → bottom):
  1. [name] — role, width, full-bleed|in-column, fixed|scrolls
  2. ...

Copy (verbatim where visible):
  - [region]: "exact heading", "button label", ...

Colors (hex or token):
  - page background: #
  - primary text: #
  - brand / links: #
  - surfaces / borders: #

Typography:
  - [role]: family, size, weight, line-height

Layout:
  - frame width: N px
  - content max-width: N px
  - columns: N
  - notable gaps/padding: ...

Assets:
  - [name]: source URL / SVG / export path / screenshot crop
```

Incomplete specs cause guessed layouts. If extraction is thin, spend more time on the reference before opening Sketch.

## URL references

1. Fetch or browse the URL.
   - Use the target viewport width.
   - Wait for visible content and fonts/assets when possible.
   - Scroll through the page before capture when lazy images, animations, sticky UI, or scroll-driven JavaScript may initialize content; return to the capture position afterwards.
   - Prefer screenshots taken after this trigger pass over first-paint-only screenshots.
2. Capture viewport width and main content max-width.
3. Inspect the source when available: HTML structure, linked stylesheets, inline styles, JavaScript bundles, framework component names, CSS variables, and asset imports.
4. Inspect computed styles for background, surface, border, text, link, and brand colors.
5. Capture font family, sizes, weights, and line heights for titles, body, labels, and buttons.
6. Copy visible strings verbatim: headings, labels, placeholders, body text, links, footer copy.
7. Capture layout mechanics: flex/grid direction, gap, padding, alignment, wrapping, item order, and which regions should become Sketch stacks.
8. Note region widths and vertical placement for each band: header, hero, main content, footer, fixed/pinned chrome.
9. Classify non-text visuals before drawing: export/import photos, illustrations, complex SVGs, product images, brand marks, screenshots, gradients/noise, and detailed icons as SVG/PNG/image assets; recreate only simple UI primitives or simple editable vectors in Sketch.
10. Export or identify icons/logos/images from SVGs, image URLs, sprites, DOM, inline SVG, or bundled asset imports. Do not rebuild complex artwork with ad hoc paths.

## Screenshot references

1. Measure target frame dimensions or ask the user.
2. Segment the screenshot top-to-bottom into regions.
3. For each region, note role, width, alignment, and whether it appears full-bleed, in-column, fixed, or scrolling.
4. Sample key colors or cross-check with source code when available.
5. List text blocks in reading order. Do not trust Sketch layer order until verified after construction.
6. Mark stack candidates: aligned rows/columns, repeated cards/list items, nav bars, forms, button groups, and structured content with consistent gaps/padding.
7. Mark asset candidates: photos, screenshots, illustrations, logos/brand marks, detailed icons, and any visual that would lose quality if approximated with primitive shapes.

## Code references

1. Find theme values: colors, radii, spacing, font sizes, font weights, and breakpoints.
2. Map existing components to Sketch symbols: buttons, inputs, text styles, cards, icon components, and repeated rows.
3. Extract inline SVGs or asset imports for logos and icons.
4. Distinguish simple inline SVG primitives from complex illustrations/images that should be exported/imported as SVG/PNG or placed in Image layers.
5. Capture layout constraints: flex/grid direction, gap, padding, alignment, wrapping, max-width, full-bleed sections, and fixed/pinned regions. These should become Sketch stack settings wherever the region is structured.
6. Distinguish in-column elements from full-bleed elements.

## Token hints

Map source tokens to Sketch swatches/shared styles where possible:

- `colors.border.*` → borders and input outlines.
- `colors.background.*` → page and surface fills.
- `colors.brand.*` → primary actions, links, active states.
- `colors.text.*` → body, secondary, and muted text.
- `fontSizes.*` / `lineHeights.*` → shared text styles.