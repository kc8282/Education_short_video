---
name: isometric-picture-book
description: Use when making an isometric-picture-book education short for a new subject or KLP where ordered movement, grouping, classification, sequence, or spatial cause and effect should carry the explanation.
---

# Isometric picture-book education lesson

## Overview and goal

Produce an original **30–45 s, 1920×1080** narrated education short for a given subject/KLP in one full-bleed true-isometric place. Meaningful objects or faceless people act out the rule; keyword/number lies on clear floor beside them, not on top. Colour is flat three-tone paper illustration. The sequence of purposeful movement—not a floating infographic, chatty cartoon or generic 3D diorama—is the explanation.

Before creating anything, read [style grammar](references/style-grammar.md), [pitfalls](references/pitfalls.md), [shared pipeline](../../../references/production-pipeline.md), [model routing](../../../references/model-routing.md), and mandatory [10 s gate](../../../standing-rules/teach-video-10s-gate.md). Suitable **subjects** include patterns, grouping/classifying, ordering, processes, food webs, transport routes, transformations, cause/effect, and other spatially representable KLPs. Prefer chalkboard for a long symbolic derivation or a correction without spatial action.

## Input contract

```yaml
subject: required name and grade/audience
klp: official code OR verifiable learning intent; never invent a code
source: verified facts/rule, review status, trial notice if required
language: zh by default
observable_goal: exactly one thing a learner can identify/explain
visual_logic: ordered action / grouping / sequence / spatial transformation / comparison
attributes_to_teach: shape, colour, phase, category, direction etc.; explicitly narrowed if needed
duration: target 40 s within 30–45 s
picture: 1920x1080; fixed isometric angle; 30 fps recommended for moving actors
output: new project path, segment evidence, full-film paths
```

Fill [NEW-TOPIC-BRIEF](../../../templates/NEW-TOPIC-BRIEF.md). The [scaffold generator](scripts/new_project.py) records the **new** subject, rule, objects, ordering and phase state; it does not borrow any sample's bricks, aircraft, garden storyline, exact problem or sequence.

## Main brain and tool stack

- **`deepseek-v4.1-flash`** (Kevin alias **`deepseek-4.1-flash`**) writes bounded topic treatment, model data, movement/geometry, and renders/checks. Resolve available provider ID first; preserve session/failures/actual backend in `evidence/RUN.md`.
- **TokenHub optional.** OpenCode, shell or an actual DeepSeek-serving API works; no required TokenHub account/config. No CloudAgent as main brain. Do not call any output Opus-directed or quality-equivalent when it wasn't.
- Standard implementation is Canvas 2D (optional WebGL only for a justified effect, not this style's default). Headless Chrome captures deterministic `render(t)` frames; `edge-tts` or permitted equivalent synthesizes narration; `ffmpeg` muxes. Optional licensed lemo-opuscar engine/core helpers can replace an engine but not a new TREATMENT or gate; verify they exist instead of assuming.

## Pipeline

1. **KLP before picture:** specify the invariant, order, grouping or variable changed; what counts as a counterexample; which attributes the lesson promises. Provide source and classroom/safety constraints. No story replaces the exact educational relation.
2. **TREATMENT before reference demo:** ask DeepSeek for three original staging candidates in different places; choose one and explain one action → one learning meaning, opening, turn and recap. A multi-attribute example that shows colour/shape cannot pretend to establish both if only one is narrated. Write the factual array and any changed index/stage first.
3. **Style proof with actual code:** build topic objects in world metres (or another consistent declared unit) from simple solids and use true isometric projection (world axes ±30°, z upright). Sort by **floor footprint**, with a shared world→screen transform for everything. Key subject grouping should be **35–45% of frame height where practical**, always at least one third; large scenery is not a substitute. Target body text readable at roughly ≥36 px equivalent at 1080p; important labels larger.
4. **Voice and segment locks:** write short spoken lines aligned to each action start, generate TTS per line with `edge-tts` or equivalent, measure real WAV times and derive cues. One on-ground short keyword/number per beat, one accent meaning the rule. Nothing must teach more than the VO claims.
5. **Segments approximately 10 s:** typical arc (adapt to the chosen learning logic):
   - S1 ~0–10 s: one correct complete ordered state, recognizable and large. Do not introduce an answer-breaking counterexample yet.
   - S2 ~10–20 s: show what repeats/groups/moves, neutrally—do not prematurely reveal the answer or hidden exception.
   - S3 ~20–30 s: one purposeful change or counterexample, external ordinal/stage label and correct expectation.
   - S4 ~30–40/45 s: recap the rule and hold it visibly/readably; trial notice if brief requires.
6. **Each segment gate:** real preview + listened VO + ≥2 PNGs + geometry/layout check + hash + source changes → COO. Leave `COO-GATE.md` blank. **No S2 without S1 written 「段过」**, and so on. Do not jump to all-film self-approve or produce all 40 s in S1.
7. **Full film:** same absolute clock/coordinates; full re-render from the source is preferred to concatenating independently repositioned segment clips. Mux H264/AAC with `ffmpeg`; inspect full-speed A/V, at least three movie-derived frames, conclusion and all changes. Decode/hash/read time are integrity evidence only, never a PASS claim.

## Style grammar (hard musts)

- One **full-bleed real place**, not a board edge, floating frame, separate map cards or room→planet zoom. One place can be long and continuous but remains at one scale and fixed angle. No arbitrary perspective camera or montage of rotated views.
- Objects meaningful to the KLP, simplified into recognizable flat three-tone solids. Top warm-lifted, front base, side warm umber. **No outlines, gradients, glossy highlights, drop shadows or textured 3D look**. Warm paper background and one dark ink, one rule accent, one subject hue and modest neutral actor colours.
- For people where the topic truly needs human action: faceless rear-view restrained figures, feet anchored. Their ordered walking/waiting/sitting carries meaning; never let them pass through each other, walls or furniture. For object-led KLPs use large readable objects instead of people as decorative filler.
- A wall/roof/glass may be cut away or hinged open to expose what matters. No occlusion of floor words or key actors; use lower barriers or cutaways, not hidden labels.
- Keyword painted on clear floor, not on the object/actor/arrow. Type may land sequentially but stays up to read. No label, bracket, footnote, subtitle, number badge or highlight may intersect the teaching shape or other text. This **zero text-overlap-on-subject** and zero text/text rule includes projected outlines, current/past labels and camera motion endpoints.
- One accent for current rule/path/index, not decorative confetti. Directional marks occupy own reserved ground channel. One action per beat, no gratuitous zipping/teleport or comedic facial acting. Continuous slow 6–8% push/drift; foot/actor/path/labels stay coherently in bounds at both ends.
- Text completed ≥`Chinese chars/4.5 + Latin/other/15 + 1.5 s` read-hold; essential numbers ~2.5 s where practical. Meeting this arithmetic is not approval.

## Local implementation and geometry

See [implementation notes](references/implementation.md). The supplied `assets/layout-driver.mjs` gives safe rectangles, one camera transform, text measurement, clock and `assets/subject-audit.mjs` gives geometric collision rejects. Generate a small editable project using `scripts/new_project.py` rather than build a huge unreviewable browser page. It has no third-party dependencies; the starter has **no automatic educational objects** and announces implementation required until the model provides them.

Project implements `window.DUR / READY / render(t) / EV / TEXTS(t)` true bounds at 1920×1080. Desired scene data includes place, objects/actors, ordered array or phase graph, selected action and view. Functions can compute `project(world)`, `screenObjectBounds(...)`, `labelRect(...)`. The annotation reserve is computed from object bounds, not just assumed world floor coordinates; check actual pixel rectangles and occlusion after painter sorting.

Prefer actual measured pixel bounds and a full output geometry audit. Illustrations have silhouettes/facets beyond text; inspect them as well. For motion, check every actual frame (jumps/collision/teleport), or state exactly how many frames were sampled and inspect the gaps manually. A fixed still frame cannot validate animated motion.

When using existing lemo `iso` kit: body width floor anchoring vs box centre heights requires correct `bias`; use `tri(colour)` for warm face tones, not bare hex; disable glints on spheres. Demonstration planes, 72-seat counts, specific property modules and any non-MIT media are not reusable lesson input.

## Output checklist for COO / human gate

- [ ] Original verified subject/KLP and new TREATMENT; at most a small well-defined rule; no copied demo story, props, timeline, dialogue or score.
- [ ] Main subjects large enough; actual parts (e.g. individual shapes) readable—not empty ground or decorative cast.
- [ ] Full-bleed fixed true-iso, flat three-tone paper, restrained accents, physically intelligible movement.
- [ ] All visible text/annotation/subtitle/meaningful shape bounds disjoint and safe throughout; occluders lowered/cut away.
- [ ] All promised attributes and correct order/counterexample taught; later answers not revealed early.
- [ ] Every ~10 s segment current MP4+VO listened, ≥2 key frames, layout/motion notes, README/hash, COO approval chronology respected.
- [ ] Entire video current source, frames/contact sheet, actual final-frame A/V viewing, film hash/probe/decode and original sound.
- [ ] 30–45 s 1920×1080 with declared fps, narrated/SRT as brief requires, licence/asset credits and accurate KLP/review notice.
- [ ] RUN truthfully names actual DeepSeek route/session, tools, commands, failures/limits and not-DeepSeek work.
- [ ] `FULL-GATE.md` empty for external reviewer. Not claiming human/teacher/student/DeepSeek full-film PASS.

For exact source-sample failure lessons see [pitfalls](references/pitfalls.md): tiny subject, text-overlap, incomplete rule, partial render labels, stale audio, premature approval.
