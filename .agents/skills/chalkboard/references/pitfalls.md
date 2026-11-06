# Chalkboard pitfalls (transfer only the lessons)

## Subject and pedagogy

- Do not turn an authentic misconception into a dishonest authority's wrong teaching. Show a clearly voiced guess if needed.
- A key rule on two variables must track only what moves, leaving the invariant actually invariant. Highlighting both erases the meaning of emphasis.
- Do not force a wrong→wipe arc when a KLP needs direct classification, chronology, geometry construction or causal derivation. The strongest chalk move for the lesson, not the sample's fraction story, decides.
- Only one idea. Do not teach an entire chapter in 40 s. Keep optional equivalent/irreducible answers only if the KLP specifically requires them.
- A trial/unreviewed KLP requires a short footer/subtitle notice when the brief requests it; not a big watermark covering the worked example.

## Geometry and rendering

- A beautiful full board can still leave the taught problem too small. Measure the meaningful equation/diagram in screen space, not the 1080p size of the canvas.
- Board layout, subtitle, trial footer and side illustration need disjoint safe regions. Use actual measured text and drawn-object bounds, not line-height estimates.
- Reference strokes stored by object centre may erase the wrong denominator/part: set erase-target layers explicitly. A whole-frame mask can erase the invariant as well as the wrong number.
- Correction needs start, partially wiped and cleared key frames. An instantaneous disappear misses the chalk grammar and causes wrong-reading comprehension.
- Report module exports actually required by `render(t)`. Missing `.end` or camera/box units can silently defeat readcheck.
- Refrain from modifying to meet auto-results alone; inspect movie after full rebuild. Source/metadata filled with "passed" while previews failed is not evidence.

## Production discipline

- Generate actual fresh narrations from the final plain-language script, not a stale audio cache. If ASR differs, listen and report, don't assume either text or audio is right.
- Keep original current files separate from obsolete intermediate renders. Hash final mp4 and actual frames extracted from it.
- For smaller directing models, a long monolithic patch can fail and parallel jobs overwrite corrections. Award one bounded module/segment at a time; no concurrent writes to a canonical file.
- Missing provider/model credentials mean **not run**, not Opus as a claim. Actual fallback model and manual repairs belong in the run log.
- Derived stroke, music and font assets retain their own credits/licences. Do not bundle an unlicensed "cute Chinese" font or palette-only movie screenshot to claim a reference.
