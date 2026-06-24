# Asset export patterns

Use this reference when Step 5 needs exact export behavior or platform path hints.

## Asset classification

Classify assets before exporting or coding them:

- `Image` / Bitmap layer → export the exact layer and use it as an image. Do not reconstruct embedded bitmap content as HTML/CSS unless explicitly requested.
- Pure illustration/path/vector group → export as an image when code recreation would add risk without semantic benefit. Prefer exact Sketch export for complex masks, gradients, shadows, or dense path groups.
- Icon/logo/brand mark/symbol artwork → export from the exact Sketch layer, rendered symbol instance, or source symbol when appropriate. Do not substitute approximate icon libraries unless the design uses a generic icon and the match is intentionally equivalent.
- Text-bearing UI, cards, navigation, page sections → implement as code. Do not export the whole group as an image unless the source design itself is an actual bitmap layer.
- Mixed card/section with text plus artwork → implement container, text, controls, and spacing as code; export only the inner artwork layer. Keep live text live and non-semantic artwork as assets.


## Rules

- Export icons, bitmaps, logos, and other designed assets from Sketch when the document contains them.
- Do not invent placeholder icon packs when the design has assets.
- Export production assets from the intended Sketch layer/group/instance, not by cropping full-frame screenshots or browser screenshots.
- Treat `get_screenshot` output as a validation reference, not an asset source.
- Use `get_guide` with `topic: "assets"` for the full `sketch.export` option surface.
- Use absolute `output` paths. Use explicit `filename` values for ad hoc fallback exports; when using configured `exportFormats`, let Sketch preserve the layer preset naming unless you are intentionally renaming the asset.
- Log full exported paths in JSON and verify files exist with `ls`.
- Use `get_screenshot` for image bytes in MCP tool results.

## Configured export formats

For any layer that is a serious export candidate, check `layer.exportFormats` before choosing export options. These presets are often more useful than a generic PNG recipe because they preserve the designer's configured file type, scale or absolute-size mode, prefix/suffix naming, and platform folder naming. Adjust the fallback `filename`, `formats`, and `scales` for the target platform and asset type, for example `formats: ['svg']` for simple vector icons or `scales: ['1.0', '2.0', '3.0']` for raster app assets. Configured export formats do not override asset classification: text-bearing UI should still be implemented as code, and mixed groups should still export only the non-semantic artwork child.

## Fidelity checks

- Verify exported dimensions against the Sketch layer frame before placing the asset.
- Inspect whether the export already includes opacity/alpha before adding CSS or platform opacity; double-applying opacity is a common logo-strip failure.
- Recreate masks, fades, and clipping from Sketch layer geometry. If the mask/fade is separate from the asset, implement or export that separate layer intentionally.
- For symbols, export the rendered instance so overrides are applied.

## Asset ledger and cleanup

Before finishing:

- Every file in the target asset folder is referenced by code or intentionally documented as shared project inventory.
- Every referenced asset exists on disk.
- Temporary screenshots, crop sources, inspection dumps, and unused export attempts are removed.
- The final summary distinguishes source bitmaps, exported artwork, and code-rendered UI when that distinction affected implementation.

## Typical project paths

- Vite/React: `public/assets/`.
- Next.js: `public/` or `src/assets/`.
- iOS: `Assets.xcassets`.
- Android: `app/src/main/res/drawable-*`.
