---
name: sketch-design-from-reference
description: Recreates or builds UI designs in Sketch from a reference URL, screenshot, or source code with side-by-side screenshot fidelity validation using Sketch MCP (`get_document_info`, `get_layer_tree_summary`, `get_screenshot`, `get_design_assets`, `get_symbol_overrides`, targeted `run_code`). Use when the user wants to design, mock up, or reproduce a page or screen in Sketch from the web, an image, or code.
disable-model-invocation: false
---

# Sketch MCP to Design

Build or refine a Sketch design to match a reference. This skill is for design-in-Sketch work; the inverse workflow is `sketch-design-to-code`.

## Fidelity first

The goal is visual parity with the reference — not a plausible page with similar sections. Similar is not done. Do not stop when content exists; stop when side-by-side screenshot comparison passes the completion criteria in [references/validation.md](references/validation.md).

## Required Sketch guides

- `get_guide` with `topic: "mcp"` — always; MCP prerequisites, `run_code` rules, failure handling, and visual verification.
- `get_guide` with `topic: "use"` — Sketch editing, stacks, symbols, styles, overrides, assets, and prototyping.
- `get_guide` with `topic: "layout"` — before creating or restructuring Frames, Groups, stacks, page placement, sizing, pins, or container types.

Fetch guide subtopics on demand when the task needs them: `troubleshooting`, `layout`, `styling`, `symbols`, `assets`, and `prototyping`.

## Prerequisites

- Sketch running with MCP enabled (Settings → General → Allow AI tools to interact with open documents).
- A target document is open, or the user expects you to create/use a new document.
- A reference is available as a URL, screenshot, or source code.
- Scope is clear enough to act: full page vs single frame, target width, dark/light mode, and target page/frame when the document has several candidates.

If MCP is unavailable, stop and call `get_guide` with `topic: "troubleshooting"`. Do not guess layout from memory while MCP is unreachable.

## Steps

Follow these steps in order. The main flow should be enough for ordinary work; load a reference file only when the step needs more detail or examples.

### Step 1 — Confirm context and reference

1. Fetch the required guides.
2. Resolve the target document with `get_document_info`.
3. Classify the reference type:
  - URL — gather page title, viewport width, DOM structure, source HTML, linked or bundled JavaScript/CSS when available, computed colors/fonts, copy, and asset URLs.
  - Screenshot — gather dimensions, regions, text content, alignment, and key colors.
  - Code — gather theme tokens, font stack, spacing scale, component names, inline SVGs, and asset imports.
4. Extract a fidelity spec and capture a reference anchor screenshot at the target width before any layout mutations. The spec must include regions (top-to-bottom), verbatim copy, colors, typography, layout widths, and asset sources — see [references/reference-extraction.md](references/reference-extraction.md).

For reference-specific extraction, read [references/reference-extraction.md](references/reference-extraction.md). For comparison and completion gates, read [references/validation.md](references/validation.md) before Step 5.

### Step 2 — Discover reusable Sketch content

Inspect before mutating. Start with read-only MCP tools:

1. Call `get_document_info` for pages, top-level Frames/Graphics, layer counts, and existing layout candidates.
2. Call `get_layer_tree_summary` on candidate frames or relevant pages for hierarchy, IDs, names, dimensions, text snippets, symbol-instance override counts, and stack hints.
3. Call `get_design_assets` and `get_libraries` for reusable symbols/components and library assets.
4. Use targeted `run_code` only when summaries do not expose the needed detail.

Prefer editing an existing frame only when you are sure it maps to the requested design. Otherwise, create a new frame.

### Step 3 — Plan structure before pixels

Define the layer plan before drawing:

- Top-level regions and their order.
- Parent/child relationships and sibling groups.
- Region widths, content max-widths, and full-bleed vs in-column sections.
- Fixed/pinned areas vs scrolling content.
- Symbol candidates, stack candidates, asset candidates, and reusable stack patterns.

Do not impose a default page template. Match the reference's information architecture.

For every structured region, decide the Sketch stack model before drawing: direction, gap, padding, alignment, sizing, wrapping, and intended visual order. Use stacks for rows, columns, nav bars, toolbars, cards, lists, forms, button groups, and repeated content unless there is a specific reason the region must be freeform. Use manual coordinates for page-level placement, pinned chrome, overlays, masks, or genuinely freeform artwork.

### Step 4 — Establish tokens and base frame

Create or match document swatches/shared styles for background, border, text, brand, muted text, and important surfaces. Set the page/frame background intentionally and clear accidental fills from structural groups. For symbol details, call `get_guide` with `topic: "symbols"`.

Use values from the reference: computed CSS, sampled screenshot colors, or code tokens. For styling details, call `get_guide` with `topic: "styling"`.

### Step 5 — Build layout incrementally

Apply small, reversible `run_code` edits. One script should perform one small action.

Never build a whole page, top-level region, or multi-section layout in one script. Do not combine probing, creating, styling, and reordering in the same run. Keep scripts flat: bootstrap, find target by ID, perform one mutation, log JSON. Avoid deep helper functions, nested IIFEs, and long control-flow trees.

Build from outside in:

1. Page frame and background.
2. Top-level region containers from the layer plan.
3. Stack settings for each region before detailed children.
4. Text, shapes, and symbol instances inside each region in small sibling batches.
5. Fixed/pinned regions after their parent structure is correct.

Build one top-level region at a time. After each region's content batch:

1. `get_screenshot` the frame at the reference anchor width.
2. Compare that region band to the reference anchor — list deltas using the taxonomy in [references/validation.md](references/validation.md).
3. Fix major mismatches before starting the next region.

After structural edits, re-query with `get_layer_tree_summary` or screenshot the frame. For safe reorder/reparent patterns, read [references/editing-patterns.md](references/editing-patterns.md).

### Step 6 — Symbols, assets, and overrides

Use existing document/library symbols before drawing repeated one-off layer groups. Repeated UI should normally become one symbol master with instances and overrides.

Before drawing detailed shapes, classify each non-text visual. Export/import photos, screenshots, illustrations, complex SVGs, product imagery, brand marks, detailed icons, gradients, and noise as SVG/PNG/image assets. Recreate only simple UI primitives, simple editable vectors, dividers, pills, and basic shapes in Sketch.

For icons/logos/images, establish layout with simple placeholders first, then import/assign real image assets once geometry and stack order are stable. Prefer symbol image overrides on dedicated layers for repeated assets.

For symbol override patterns, read [references/symbols.md](references/symbols.md). For import/export details, call `get_guide` with `topic: "assets"`.

### Step 7 — Targeted fixes only

When the user reports an issue or screenshot comparison shows a mismatch:

1. Inspect the current layer with `get_layer_tree_summary` or a targeted probe before mutating.
2. Change only the reported property: one frame value, text style, color, layer order, stack property, or override.
3. Re-screenshot and confirm child counts are unchanged unless deletion was intentional.

If layout breaks or layers are lost, say so immediately and tell the user to Undo/Revert before continuing.

### Step 8 — Final validation and handoff

Do not claim done until completion criteria pass — see [references/validation.md](references/validation.md) → Completion criteria.

1. Capture a full-frame `get_screenshot` at the reference anchor width.
2. Run the region gate for every band in the fidelity spec against the reference anchor screenshot.
3. If any major delta remains, return to Step 7 and iterate. Do not hand off with "close enough" layouts.
4. Summarize symbols used, tokens/styles created, target artboard/frame name and ID, regions verified, and any remaining minor deltas.
5. Do not run `zoomToFitCanvas` until the task is complete.

## Rules

Direction-specific rules for Sketch → design. Generic MCP/script rules come from `get_guide` with `topic: "mcp"` and Sketch content rules come from `get_guide` with `topic: "use"`.

1. Patch, do not rebuild. If content exists, fix frames, styles, overrides, or order instead of deleting and recreating major regions.
2. Baseline child counts before and after reorder, reparent, add, or remove operations.
3. Never assign `parent.layers = [...]`; use `layer.index` for reorder and `child.parent = newParent` for reparent.
4. Match the reference's region structure; the same visual content should have the same parent/sibling relationship unless there is a deliberate reason to diverge.
5. Screenshot after each meaningful batch and use the screenshot deltas to choose the next edit.
6. Structured layout uses stacks by default. If siblings behave like flex, grid, list, form, nav, or card content in the reference, create or preserve a Sketch stack instead of hand-positioning every child.
7. Assets are assets. Do not redraw complex artwork, photos, screenshots, or brand marks as low-fidelity vector approximations; export/import or assign image/SVG assets.
8. No guessing. Do not invent layout, copy, colors, spacing, or assets from memory or generic UI patterns. Extract from the reference; if a value is missing, re-fetch or ask the user.
9. Reference anchor always. Compare Sketch output to the captured reference screenshot — not to your recall of the page.
10. Completion gate. Do not stop because sections exist or the page "looks similar." Stop when [references/validation.md](references/validation.md) completion criteria pass.

## Pitfalls

- Recreating the page to fix a small mismatch wastes tuned work and introduces new bugs. Make surgical edits from screenshot deltas.
- Placing images directly on symbol instances can break hierarchy or fail in the API. Put image layers in the master and drive per-instance image overrides.
- Skipping screenshots hides layout, ordering, and color errors. Screenshot every batch.
- Reordering with `parent.layers = [...]` can delete children or duplicate object IDs. Use safe reorder patterns instead.
- Stack order can look inverted if index and packing direction are misunderstood. Use `get_guide` with `topic: "layout"` and verify with screenshot.
- Whole page or region scripts are hard to validate, debug, and recover from. Split by region, stack setup, and small sibling batches.
- Structured layout built with manual frames drifts when spacing or order changes. Use Sketch stacks for rows, columns, lists, forms, navs, cards, and repeated regions.
- Complex artwork rebuilt as primitive shapes produces low-quality approximations. Export/import SVG/PNG or use image overrides; reserve shapes for simple UI primitives.
- First-paint-only page screenshots can miss lazy images and scroll-triggered UI states. Use browser or agent tools, scroll to trigger content, then capture the target viewport.
- Premature completion: agent adds header/body/footer with generic styling and stops. Run the region gate and completion criteria; keep fixing until major deltas are gone.
- Improvised copy and colors: paraphrased headings, lorem-style filler, or default grays/blues instead of extracted values. Use the fidelity spec verbatim; re-sample colors from the reference.
- Placeholder permanence: gray boxes left as "logos" or "hero images." Export/import real assets before handoff unless the user asked for placeholders.

## Troubleshooting

For bridge/tool-call failures, parser errors, MCP connection problems, or screenshot failures, call `get_guide` with `topic: "troubleshooting"` before retrying.

For document-operation failures:

- Layout/stack/order issues → `get_guide` with `topic: "layout"`.
- Symbol override issues → `get_guide` with `topic: "symbols"`.
- Export/import/image issues → `get_guide` with `topic: "assets"`.

### Design-build symptoms

- Child count dropped after a script: tell the user to Undo, then inspect the operation. Do not repeat a bulk layer assignment.
- `get_screenshot` is empty or wrong: re-resolve the frame/layer ID, then screenshot the page or parent frame if needed.
- Symbol override has no effect: re-fetch `get_symbol_overrides`, rebuild the override ID from `commonOverrideIDPrefix + '_' + property`, then screenshot.
- Text overlaps in a row stack: inspect child order and gap; fix one stack property or child index at a time.

## References

- `get_guide` with `topic: "mcp"` — MCP tools, `run_code`, troubleshooting, visual verification, and completion rules
- `get_guide` with `topic: "use"` — Sketch editing, stacks, symbols, styles, overrides, assets, and content verification
- `get_guide` with `topic: "layout"` — stacks, page placement, sizing, pins, container types, reorder/reparent, and layout drift
- [Reference extraction](references/reference-extraction.md)
- [Safe editing patterns](references/editing-patterns.md)
- [Symbol override patterns](references/symbols.md)
- [Validation loop](references/validation.md)
- [Sketch JavaScript API](https://developer.sketch.com/reference/api/llms.txt)
- [StackLayout](https://developer.sketch.com/reference/api/stacklayout.txt)
- [Symbol overrides](https://developer.sketch.com/reference/api/symbol-override.txt) (confirm via `get_symbol_overrides` in MCP)