# Validation checklist

Use this reference when comparing generated code to the Sketch design.

## Screenshot loop

Start with `get_guide` with `topic: "mcp"` for screenshot capture and generic visual verification. For Sketch content checks, also use `get_guide` with `topic: "use"`.

For web targets:

1. Run the app at a viewport width comparable to the Sketch frame.
2. Capture the running UI in the browser.
3. Compare it with `get_screenshot` for the same frame.
4. Fix the largest visible mismatch first.
5. Re-screenshot after targeted fixes.

For non-web targets, compare simulator/emulator output when feasible. If not feasible, validate structurally and state what was not visually verified.

## Code-specific checks

- Web parity: running UI matches `get_screenshot` at a similar viewport width.
- States and interactions: hover, focus, disabled, selected, or expanded states if present in the design.
- Asset rendering: icons/images use exported paths and render at the correct scale.
- Asset source fidelity: actual Sketch bitmap layers are exported as bitmaps; text-bearing UI is not flattened into images unless the source is itself a bitmap.
- Exact details: logos, avatars, user images, social marks, product marks, gradients, fades, masks, and clipped artwork match the Sketch source, not an approximate substitute.
- Alpha and compositing: exported assets are not double-faded with extra code opacity, and separate Sketch fades/masks are represented intentionally.
- Asset hygiene: referenced assets exist, no active asset is unused, and temporary screenshots/crops/export attempts are removed.
- Responsiveness / constraints: pins, stacks, and resizing come from extracted data, not eyeballing. If relative layout metadata exists, verify the implementation follows it; otherwise verify parity at the frame viewport first and keep nearby viewport behavior flexible where practical.
- Accessibility basics: labels, contrast, and focus order where applicable.
- Tokens in code: swatches/shared styles map to the project theme, not stray hex values.
- Component reuse: repeated symbol instances are represented by reusable components and data where appropriate.

## Mismatch recovery

If implementation does not match the design:

1. Re-fetch `get_screenshot`.
2. Deep-dive the affected subtree with `get_layer_tree_summary`.
3. Use targeted `run_code` only for missing values such as colors, radii, exact text style, pins, or stack properties.
4. Confirm the code reflects the extracted hierarchy: all major regions, correct parents, exported assets, and mapped tokens.
5. If the mismatch involves imagery, confirm whether the source is an `Image` layer, pure artwork group, symbol/logo asset, or text-bearing UI before changing the implementation strategy.
6. Re-run the visual comparison.
