# Local isometric implementation

## Data model first

Timeline records the stage, world unit, actual ordered objects and phase/invariant—for example:

```js
const LESSON = {
  place: 'original scene selected from KLP',
  unit: 'm',
  unitOfOrder: ['category-or-shape-A', 'category-or-shape-B'],
  instances: [/* explicit ordered subject-specific objects */],
  invariant: 'what does not change',
  change: { at: 23, itemIndex: null, before: 'A', after: 'B' },
  annotationReserve: 'calculated or explicitly reserved clear ground band'
};
```

This is illustrative vocabulary, not a mandated sample. For categories a class list is meaningful; for a biological reaction a phase/energy/material graph is meaningful; the generator needs this KLP-specific data before it can draw.

## Projection contract

Common orientation `x` down-right, `y` down-left, `z` up:

```js
function project({x, y, z = 0}, cam) {
  return {
    x: cam.cx + (x - y) * Math.cos(Math.PI / 6) * cam.k,
    y: cam.cy + ((x + y) * Math.sin(Math.PI / 6) - z) * cam.k
  };
}
```

For an actual lesson store world geometry (footprint, z, height), project each silhouette vertex/facet and derive tight pixel bounds including outline. Sort footprints with the complete actor semantics: maintain render queue entries for object vs billboard, then `iso.flush()` in a compatible kit, or implement the same explicit painter-sort discipline. Do not project arbitrary centre; anchor person at feet.

Screen label boxes have to be moved into clear space and checked with shape bounds. The starter reserves appropriate non-overlapping screen rectangle regions; a real isometric topic can change them *if* the no-overlap and size audits pass at every state. Annotation position can be from a ground-plane transform but then an unforeseen tall object can still cover it; audit screen-space occlusion separately.

## Standalone scaffolding

Copy the two no-dependency helper modules or use an equivalent existing licensed engine. `layout-driver` keeps screen zones and view transform shared. `subject-audit` has normal edge/rect semantics (touching is fine, intersecting is not), `contains`, small-subject reject, `text/text` and `text/subject` detection. Projects must include custom object extents and real `TEXTS(t)` returns.

The starter `src/subject.mjs` intentionally draws only a construction marker, not misleading biological or physical placeholders. It cannot generate an educationally valid film before `subject.implemented = true` and the model provides the actual diagram. Mandatory `render(t)` contract lives in `src/app.mjs`; use a browser driver already discovered (e.g. Playwright) or existing lemo tools, not a hallucinated screenshot command.

`node scripts/verify-project.mjs layout` audits timeline geometry, subject scale, collisions (all at AGGREGATED placeholder labour data until real frames exist), not film teaching. `strict` also demands `subject.implemented`. Run test helper from skill folder `node scripts/verify.mjs test`. Then provide a generated contact sheet and genuine listening of final voice; do not mark PASS from terminal status.
