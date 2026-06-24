---
name: sketch-design-to-code
description: >
  Generates code from Sketch designs with 1:1 visual fidelity using
  Sketch MCP (`get_document_info`, `get_layer_tree_summary`, `get_screenshot`,
  `get_symbol_overrides`, `get_design_assets`, targeted `run_code`). Inspects
  existing project code and conventions first, maps symbols and overrides to
  reusable components, exports assets, and validates implementations against
  Sketch screenshots (web: running app vs `get_screenshot`).
  Use when implementing or updating UI in React, Tailwind, SwiftUI, Kotlin, or other technologies from an Sketch document, page, frame, or layer.
disable-model-invocation: false
---

# Sketch MCP to Code

Generate code from Sketch designs with project-aware reuse, symbol-driven components, and visual verification.

## Required Sketch guides

- `get_guide` with `topic: "mcp"` — always; MCP prerequisites, `run_code` rules, failure handling, and visual verification.
- `get_guide` with `topic: "use"` — Sketch inspection, symbols, overrides, stacks, styles, exports, and content verification.

Fetch guide subtopics on demand when the task needs them: `troubleshooting`, `layout`, `styling`, `symbols`, `assets`, and `prototyping`.

Inverse workflow: Sketch from code/URL is sketch-design-from-reference

## Prerequisites

- Sketch running with MCP enabled (Settings → General → Allow AI tools to interact with open documents).
- Target document open; user selection or explicit frame ID / share link (`https://sketch.com/s/<doc-uuid>/f/<frame-uuid>`).
- Project workspace accessible — agent can read source, configs, and package manifests.
- Know the target platform from user or repo signals (e.g. `package.json` → web, `*.xcodeproj` → iOS, `android/` → Android). Ask if ambiguous.

If MCP fails: stop and call `get_guide` with `topic: "troubleshooting"`; follow its MCP connection failure guidance. Do not implement from memory while MCP is unreachable.

## Steps

Follow these steps in order. The main flow should be enough for ordinary work; load a reference file only when the step needs more detail or examples.

### Step 1 — Confirm Sketch context

1. Probe document context with `get_document_info`.
2. Resolve implementation target (priority order):
  - Sketch share link — extract `/f/<canvas-frame-uuid>` from URLs like `https://sketch.com/s/<doc-uuid>/f/<frame-uuid>`; find that layer using the share-link guidance in `get_guide` with `topic: "use"`, and select it. Prefer this over current selection or name matching.
  - User-selected layer in Sketch.
  - Layer IDs or names via `get_document_info` / `get_layer_tree_summary`; use targeted `run_code` only if the dedicated tools cannot resolve the target. Confirm if multiple matches.
3. Treat a target frame as a full page or screen unless the user explicitly says it is a partial component, section, or crop.
4. Capture reference screenshot: `get_screenshot` on the target frame (`targetDocumentID` + `layerID`). This is the primary visual reference for implementation and validation.

If selection is empty and no share link resolved, stop and ask the user to select the target frame.

### Step 2 — Inspect the codebase

Inspect the project before creating files. Reuse matching components and tokens, match neighboring file layout and state patterns, and keep scope to the selected frame unless the user asked for more.

- Existing UI components? Check `src/components`, design system packages, and Storybook.
- Design tokens / theme? Check CSS variables, Tailwind `@theme`, `tokens.ts`, and asset catalogs.
- Target stack? Check `package.json`, `Podfile`, `build.gradle`, and framework imports.
- How to run? Check README, `npm run dev`, `yarn ios`, Makefile, and mise config.
- Folder for new work? Check the user request, feature modules, and pages/routes.

### Step 3 — Extract design structure and tokens

Start with dedicated read-only MCP tools before writing custom probes.

1. Call `get_document_info` for the document ID, pages, page layer counts, and top-level Frames/Graphics with positions and dimensions.
2. Call `get_layer_tree_summary` on the target page, frame, or layer for hierarchy, IDs, names, dimensions, text snippets, symbol-instance override counts, and stack hints.
3. Use targeted `run_code` only for details those tools do not expose: exact style values, pins/sizing, masks, symbol master IDs, override-capable layers, export settings, image sources, or custom geometry checks. Keep scripts small and flat: one probe or property concern per call, with a short title and JSON log.

Collect enough data to explain hierarchy, layout, typography, styling, reusable styles, tokens, symbols, assets, and geometry for the selected frame and relevant descendants. Before coding, produce a short asset classification ledger for major regions and export candidates: actual Bitmap/Image layers, pure illustration/path artwork, icon/logo/symbol artwork, text-bearing UI, and mixed UI that should be split into coded structure plus exported inner artwork. For export candidates, record configured `layer.exportFormats` when present; they capture designer intent for file type, scale or absolute-size variants, prefix/suffix naming, and platform folder naming. For layout, identify whether the design uses stacks, pins/resizing, or other relative layout constraints; those define responsive intent. For large trees, shallow-map first, then deep-dive only critical subtrees.

For extraction examples, asset classification probes, and large-tree strategy, read [references/extraction.md](references/extraction.md).

### Step 4 — Plan the component map

Produce a brief symbol/component map before coding. Repeated instances of the same Sketch master should normally become one reusable component with data-driven props. Nested symbols should normally become composed components, not flattened code.

```
Sketch master                  → Code component        → Overrides / props
<Family>/<Variant A>           → <Family><VariantA>    → <override props>
<Family>/<Variant B>           → <Family><VariantB>    → <override props>
<Family>/<Container>           → <Family><Container>   → <override props>
<Family>/<Atom>                → <Family><Atom>        → <override props>
```

Call `get_symbol_overrides` per distinct instance (`kind: all`) when symbols or overrides matter. For symbol mapping examples, read [references/symbol-to-code.md](references/symbol-to-code.md).

### Step 5 — Export assets

Export icons, bitmaps, logos, pure artwork groups, and other designed assets from exact Sketch layers or symbol sources when the document contains them. Do not invent placeholder icon packs for designed assets, and do not crop production assets from full-frame screenshots; screenshots are for verification. Before choosing fallback export options, inspect each export candidate for configured `layer.exportFormats`; when they exist, prefer passing those formats to `sketch.export` so exported files preserve the document's format, size, and naming presets. Put exports in project-conventional paths or a temp directory, log full paths, and verify files exist.

For asset classification details, exact export rules, fidelity checks, and path examples, read [references/assets.md](references/assets.md).

### Step 6 — Implement code

Translate design → project conventions with 1:1 visual parity vs the Sketch screenshot and extracted context:

- Match spacing, alignment, sizing, and hierarchy.
- Match typography and color usage.
- Preserve responsive/constraint-based layout intent from stacks, pins/resizing, and relative layout metadata when present.
- Prefer tokenized values; avoid unnecessary hardcoded literals.
- Prefer incremental updates over broad rewrites when editing existing UI.
- Follow the asset classification ledger: actual bitmap layers may stay bitmap, pure artwork can be exported, text-bearing UI should be code, and mixed groups should keep layout/text in code while exporting only inner artwork.

1. Tokens — CSS/Tailwind `@theme`, Swift `Color` extensions, Android `colors.xml`, or the project equivalent.
2. Symbol components — props mirror overrides; defaults match master values.
3. Screen/page — composes sections; spacing from stack `gap` / frame layout. If the design uses stacks or relative layout, implement those constraints responsively. If it does not, match the page layout at the viewport defined by the frame while keeping containers, spacing, and media flexible where doing so does not break the reference.
4. Assets — reference exported paths from exact Sketch sources; use platform-idiomatic `img` / `Image` / `AsyncImage`.

Do not over-engineer — no extra abstractions for one-off layers.

### Step 7 — Runnable web apps: setup, run, compare

When the target is a web app:

1. Existing runnable? Follow README / `package.json` scripts / mise. Start dev server (`npm run dev`, etc.).
2. No runnable yet? Ask the user: "There's no web dev setup in this project. Should I scaffold a runnable app (e.g. Vite + React + Tailwind) in a new folder?" If yes, create minimal scaffold, wire the page, document how to run in README.
3. Open the page (dev URL or preview).
4. Compare browser screenshot vs Sketch `get_screenshot` on the same frame (see [validation.md](references/validation.md)).
5. Iterate targeted fixes → re-screenshot both sides until parity is reasonable.

Log what you verified in the final reply.

### Step 8 — Other platforms

When the target is mobile or native (no browser loop):

1. Generate code following platform conventions and existing project structure.
2. If the user can run a simulator/emulator, offer to build and compare; otherwise validate structurally using [validation.md](references/validation.md) where applicable.
3. State clearly what was not visually verified and what the user should run locally.

### Step 9 — Finalize and validate

Before claiming done, run the validation checks against the latest Sketch screenshot and implementation (web: after browser comparison).

- Ensure build/typecheck passes for the stack used.
- Summarize: files added/changed, symbol → component map, how to run (with URL if web).
- Document intentional deviations (technical limits, accessibility improvements).
- Mention remaining symbol reuse opportunities if repetition was left inline.
- Do not assume stale Sketch data — re-query with `run_code` when values are uncertain.

For code-specific screenshot checks and mismatch recovery, read [references/validation.md](references/validation.md).

## Rules

Direction-specific rules for Sketch → code. All generic Sketch MCP rules come from `get_guide` with `topic: "mcp"` → Critical Rules, from `get_guide` with `topic: "use"` → Mandatory Constraints, and Visual Verification & Completion — follow them in addition to the points below.

1. Project first — read existing code before creating components or folders.
2. Symbols → components — overrides → props; never copy-paste three identical button implementations.
3. Tokens over hex — prefer document swatches and shared styles; hardcode only when unlinked in Sketch.
4. Frame scope — assume a frame is a full page or screen unless the user says it is only a component, section, or crop.
5. Responsive intent — follow stacks, pins/resizing, and relative layout when present; otherwise match the frame viewport first and keep layout flexible where practical.
6. Minimal diff — implement the requested frame; no drive-by refactors.
7. Ask before scaffolding — new runnable web app only when none exists and user agrees (unless they already asked for a standalone implementation folder).
8. Live data — re-query Sketch when unsure; do not rely on outdated extraction from earlier in the session.
9. Asset classification — bitmap-in-design may stay bitmap; text-bearing UI, cards, forms, navigation, and sections should be implemented as code unless the source is an actual bitmap layer.
10. Exact exports — export production assets from selected Sketch layers/groups/symbols, never by cropping a verification screenshot.

## Pitfalls

Code-only pitfalls below. Bridge/script issues are in `get_guide` with `topic: "mcp"` → Common Mistakes; document-operation issues are in `get_guide` with `topic: "use"` → Common Content Mistakes.

- Flattening symbols loses the override model. Use one master → one component; see [symbol-to-code.md](references/symbol-to-code.md).
- Flattening text-bearing cards or sections into images makes the result fragile and inaccessible; export only source bitmap layers or non-semantic artwork.
- Rebuilding source bitmap content as HTML/CSS can also be wrong; if Sketch says the content is an Image layer, use the exported bitmap unless the user explicitly asks for reconstruction.
- Cropping assets from screenshots bakes in accidental pixels, scale, masks, and neighboring content. Select and export the exact Sketch layer instead.
- Using `fs` in `run_code` fails because `fs is not a core package`. Use `mkdir -p` in shell and export in Sketch script only.
- Using the wrong region model misses UI outside the walked subtree. In Step 3, shallow-probe the hierarchy and map every major sibling/parent group before coding.
- Monolithic `run_code` scripts are hard to debug and recover from. Use one small flat script per probe or concern; do not combine probe, mutation, styling, and export setup in one call.

## Troubleshooting

Bridge/tool-call failures: call `get_guide` with `topic: "troubleshooting"` and analyze `run_code` failures before retrying. For Sketch document-operation failures, call the relevant topic (`layout`, `symbols`, or `assets`) for the failed area.

### Empty selection / screenshot fails

- Ask user to select target frame, or resolve from share link `/f/<uuid>`.
- Re-run target resolution with explicit `layerID` on `get_screenshot`.

### Implementation doesn't match design

- Re-fetch `get_screenshot`, deep-dive the mismatching subtree, and compare against [references/validation.md](references/validation.md).
- Confirm code reflects the extracted hierarchy: all major regions, correct parents, exported assets, and mapped tokens.

### Existing project uses different patterns

- Follow project patterns over skill examples (e.g. styled-components vs Tailwind).
- Map symbols to whatever component system the repo uses.

### User wanted mobile but repo is web (or vice versa)

- Stop and confirm platform before large implementation.

## References

- `get_guide` with `topic: "mcp"` — MCP workflow, `run_code`, visual verification, and completion rules
- `get_guide` with `topic: "use"` — Sketch inspection, stacks, symbols, styles, exports, and content verification
- [Extraction patterns](references/extraction.md)
- [Symbol → code mapping patterns](references/symbol-to-code.md)
- [Asset export patterns](references/assets.md)
- [Validation checklist](references/validation.md)
- [Sketch MCP server docs](https://www.sketch.com/docs/mcp-server/)
- [Sketch JavaScript API](https://developer.sketch.com/reference/api/llms.txt)
