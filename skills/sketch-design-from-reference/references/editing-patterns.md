# Safe editing patterns

Use this reference for structural edits such as reorder, reparent, and child-count-sensitive changes.

Keep `run_code` scripts small and flat: bootstrap, find the target by ID, perform one structural edit, and log JSON. Do not combine probing, creation, styling, and reordering in the same script.

## Reorder stack children

Do not use `parent.layers = [...]`; it can delete siblings or duplicate IDs and crash Sketch. Set `layer.index` on each child, then apply stack layout.

```javascript
const sketch = require('sketch');
var stackId = '<STACK-LAYER-UUID>';
var stack = sketch.find('#' + stackId, sketch.getSelectedDocument())[0];
if (!stack) {
  console.log(JSON.stringify({ ok: false, error: 'NOT_FOUND' }));
} else {
  var before = stack.layers.length;
  var order = ['<CHILD-A-NAME>', '<CHILD-B-NAME>', '<CHILD-C-NAME>'];
  for (var i = 0; i < order.length; i++) {
    var L = stack.layers.find(function (l) { return l.name === order[i]; });
    if (L) L.index = i;
  }
  stack.stackLayout.apply();
  console.log(JSON.stringify({
    ok: true,
    childCountBefore: before,
    childCountAfter: stack.layers.length,
  }));
}
```

If `childCountAfter !== childCountBefore`, tell the user to Undo immediately.

## Reparent into a sibling region

Move children with `child.parent = newParent`; never rewrite a parent's entire `layers` array.

```javascript
const sketch = require('sketch');
const doc = sketch.getSelectedDocument();
var frame = sketch.find('#' + '<FRAME-UUID>', doc)[0];
var sourceStack = frame.layers.find(function (l) { return l.name === '<SOURCE-STACK-NAME>'; });
var beforeSource = sourceStack.layers.length;

var region = frame.layers.find(function (l) { return l.name === '<REGION-NAME>'; });
if (!region) {
  region = new sketch.Group({
    parent: frame,
    name: '<REGION-NAME>',
    frame: { x: 0, y: 0, width: sourceStack.frame.width, height: 56 },
  });
}
var beforeRegion = region.layers.length;

['<CHILD-UUID-A>', '<CHILD-UUID-B>'].forEach(function (id) {
  var l = sketch.find('#' + id, doc)[0];
  if (l) l.parent = region;
});

region.frame = {
  x: region.frame.x,
  y: frame.frame.height - 24 - region.frame.height,
  width: region.frame.width,
  height: region.frame.height,
};

console.log(JSON.stringify({
  ok: true,
  source: { id: sourceStack.id, before: beforeSource, after: sourceStack.layers.length },
  region: { id: region.id, before: beforeRegion, after: region.layers.length },
}));
```

If `beforeSource + beforeRegion !== sourceStack.layers.length + region.layers.length`, stop and tell the user to Undo.

## Frame safety

When assigning a computed `frame`, check `Number.isFinite` on `x`, `y`, `width`, and `height` first. Do not write the frame if any value is non-finite.
