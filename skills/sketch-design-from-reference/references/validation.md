# Validation loop

Use this reference whenever comparing the Sketch frame to the URL, screenshot, or code reference. Similar is not done. The task is incomplete while major visible mismatches remain.

## Reference anchor (required before drawing)

Before the first layout mutation:

1. Capture a reference screenshot at the target viewport/frame width (browser screenshot, user attachment, or rendered code preview).
2. Record the reference width and height.
3. Write a fidelity spec from extraction — not from memory:
   - Region list top-to-bottom with roles (header, hero, sidebar, footer, etc.).
   - Exact visible copy for headings, labels, buttons, links, and key body text.
   - Measured or computed values: page background, surface fills, text colors, brand/link colors, border colors.
   - Typography: family, size, weight, line height for each text role.
   - Layout: max content width, column count, major gaps/padding, full-bleed vs in-column bands.
   - Asset inventory: logos, photos, icons, illustrations (with source URLs or export paths).

Keep the reference screenshot and fidelity spec available for every comparison pass. Do not rely on what you remember from earlier in the session.

## Screenshot loop (every batch)

Follow `get_guide` with `topic: "mcp"` → Visual Verification & Completion.

1. Capture a full-frame `get_screenshot` of the Sketch target at the same width as the reference anchor.
2. Compare visually against the reference anchor — not against your mental model of the page.
3. List deltas using the taxonomy below. Be specific (region, layer role, property, expected vs actual).
4. Fix the largest structural or content mismatch first, then spacing, then typography/color, then asset polish.
5. Screenshot again after each meaningful batch.
6. Do not start the next top-level region until the current region passes the region gate (below).

## Region gate

Work top-to-bottom through the fidelity spec regions. For each region:

1. Screenshot the Sketch frame (or crop mentally to that band).
2. Compare that band to the reference at the same vertical slice.
3. Check:
   - Region exists and is in the correct order.
   - Correct parent/sibling structure (not just "content is somewhere on the page").
   - Copy matches verbatim where visible in the reference.
   - Alignment, width, and full-bleed vs in-column behavior match.
   - Dominant colors and type sizes are close to extracted values — not generic defaults.
   - Non-text visuals use real assets when the reference does, not placeholder rectangles or guessed vector shapes.
4. Only mark the region pass when no major delta remains for that band.
5. Move to the next region.

If the whole page looks roughly right but regions fail individually, the design is not done.

## Delta taxonomy

When comparing, classify every mismatch:

- Missing region: no footer, no sidebar, hero section absent.
- Wrong structure: two columns instead of three; nav items in wrong group.
- Wrong order: footer above content; CTA before headline.
- Missing content: button label wrong/missing; only 2 of 4 nav links.
- Wrong copy: paraphrased or invented text instead of reference strings.
- Spacing: gap too large/small; section padding wrong; misaligned column.
- Sizing: frame too narrow/wide; image aspect wrong; button too short.
- Typography: wrong size/weight; body styled like heading.
- Color: background, text, link, or border color off vs spec.
- Assets: placeholder block instead of logo/photo; wrong icon; stretched image.
- Extra content: layers or sections not in the reference.

Fix in priority order: missing region → wrong structure/order → missing/wrong copy → spacing/sizing → typography/color → assets.

## Completion criteria

Do not hand off early. Before claiming the task is complete, all of the following must be true:

1. Full-frame Sketch screenshot was compared to the reference anchor at matching width.
2. Every region in the fidelity spec was checked with the region gate.
3. No major deltas remain:
   - No missing top-level regions or primary content blocks.
   - No wrong column/layout model for the page.
   - No invented or paraphrased copy for primary UI (headings, nav, CTAs, form labels).
   - No placeholder rectangles where the reference shows real logos, photos, or icons (unless the user explicitly asked for placeholders).
   - Page background and primary text/surface colors match the spec — not Sketch defaults.
4. Minor deltas (1–2 px spacing, sub-pixel color drift, font substitution when the exact family is unavailable) are listed explicitly in the handoff.

If major deltas remain, keep iterating with targeted fixes (Step 7). Do not stop because the layout is in the ballpark or the main sections exist.

## Content checks

- Region structure matches the reference: same parent/sibling relationships where practical.
- Top-level full-bleed vs in-column behavior is correct.
- Text content is complete, verbatim where visible, and in reading order.
- Shared styles/swatches match source tokens or sampled colors — not guessed grays and blues.
- Repeated UI uses symbols/instances when appropriate.
- Assets are real imported/exported assets, not placeholders, once geometry is stable.

## Mismatch recovery

If the Sketch output looks unlike the reference:

1. Re-open the reference anchor screenshot — do not compare from memory.
2. Re-read the fidelity spec; note which regions or properties were never extracted (go back to reference-extraction if needed).
3. Capture a fresh full-frame `get_screenshot`.
4. List deltas by region using the taxonomy above.
5. Deep-dive the worst region with `get_layer_tree_summary` or a targeted probe.
6. Fix one category at a time (structure, then copy, then spacing, etc.) with small `run_code` edits.
7. Re-screenshot and re-run the region gate for affected bands.
8. If you catch yourself improvising layout or copy, stop and re-extract from the reference.

## Handoff

In the final response, state:

- Target frame/artboard name and ID.
- Reference anchor width and source (URL, attachment, code preview).
- Symbols used or created.
- Tokens/swatches/shared styles used or created.
- Regions that passed the region gate.
- Remaining major deltas (should be none) and minor deltas (listed honestly).
- What was verified by side-by-side screenshot comparison vs what was only checked structurally.