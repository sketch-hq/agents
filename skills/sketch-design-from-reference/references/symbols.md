# Symbol override patterns

Use this reference when inserting symbols, updating overrides, or assigning images through symbol instances.

Keep override scripts targeted: resolve one symbol instance, set one small group of related overrides, and log JSON. Do not mix symbol insertion, layout restructuring, and override mutation in one script.

## Basic rule

Repeated UI should normally become one symbol master with instances. Use overrides per instance instead of drawing repeated one-off groups.

For full symbol behavior, call `get_guide` with `topic: "symbols"`.

## Image override pattern

After `get_symbol_overrides` returns the `commonOverrideIDPrefix` for the image-bearing inner layer, build override IDs by appending `_<property>`. This is more robust than matching `affectedLayer.name`, which can break when the master changes.

```javascript
var inst = /* SymbolInstance */;
var prefix = '<commonOverrideIDPrefix from get_symbol_overrides>';
var byId = function (suffix) {
  return inst.overrides.find(function (o) { return o.id === prefix + '_' + suffix; });
};

var img = byId('image');
if (img) img.value = { path: '/' + 'tmp' + '/' + 'asset.png' };

var resize = byId('imageResizeBehavior');
if (resize) resize.value = 2;

console.log(JSON.stringify({
  ok: !!img,
  setImage: !!img,
  setResize: !!resize,
}));
```

Fallback to name matching only when you cannot get a fresh `commonOverrideIDPrefix`, and screenshot afterwards.

## Common failures

- Override has no effect: re-fetch `get_symbol_overrides`; the prefix or property may be stale.
- Image stretches inside a symbol slot: set `imageResizeBehavior`, or use a fixed-size Image layer inside the master.
- Asset appears outside the component: prefer a dedicated Image layer in the master plus per-instance image override.
