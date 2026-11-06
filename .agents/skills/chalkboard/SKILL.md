---
name: chalkboard
description: Use when making a code-drawn classroom chalkboard education short for a new subject or KLP, especially a worked example, misconception correction, or one idea that develops by writing and rewriting.
---

# Chalkboard education lesson

## Overview and goal

Produce an original **30–45 s, 1920×1080** narrated education short for a given subject/KLP. Think like a teacher at one clean slate: a claim grows stroke by stroke; attention follows one chalk colour; an optional misconception is wiped once and corrected **in the same camera position**. It is not a static slide, generic handwriting font fade, rainbow whiteboard, or a reference demo with changed nouns.

Load [style grammar](references/style-grammar.md), [known pitfalls](references/pitfalls.md), [shared pipeline](../../../references/production-pipeline.md), [model routing](../../../references/model-routing.md), and [10 s gate](../../../standing-rules/teach-video-10s-gate.md). Work in the brief's separate output directory. Suitable **subjects** include mathematics, science, language grammar, geography, history causality and other concept/rule lessons; choose isometric instead when physical ordering and spatial action carry the reasoning.

## Input contract

```yaml
subject: required name and grade/audience
klp: official code OR verifiable learning intent; never invent a code
source: supplied rule/fact and review status; trial/unreviewed label if applicable
language: zh by default; say any alternative explicitly
observable_goal: one thing a learner can say/do after the film
misconception: optional specific wrong claim that visual correction can teach
duration: 40 s default within 30–45 s
picture: 1920x1080; 30 fps preferred for handwriting
output: new project path, evidence path, per-segment and full-film paths
```

Copy [NEW-TOPIC-BRIEF](../../../templates/NEW-TOPIC-BRIEF.md), identify exclusions and the precise teaching geometry. The default scaffold creates data and layout only; it deliberately invents no scientific or mathematical diagram. Use [new_project.py](scripts/new_project.py) and see [local implementation choices](#local-implementation).

## Main brain and dependencies

- Main directing/code brain is **`deepseek-v4.1-flash`**, also requested by Kevin as **`deepseek-4.1-flash`**. Resolve a real provider/model ID, perform a small request, and write exact ID/session/tool failures to `evidence/RUN.md`.
- OpenCode/shell/provider API routes are acceptable after discovery. **TokenHub is optional**, never a prerequisite; do not require its secret, or assume any old TokenHub example is a valid endpoint. **No CloudAgent as main brain** and no Opus identity claims.
- Existing lemo-opuscar chalk engines/render helpers are optional. Their design targets another directing model; no equivalent DeepSeek full-film quality claim. Own stack requires only local HTML Canvas 2D (WebGL2 optional for post), deterministic frame capture, `edge-tts` or other usable TTS, audio mixer, and `ffmpeg`.

## Production order

1. **Facts:** write one observable learning outcome and verify every board equation/claim from provided sources. Record whether a teacher has reviewed. Do not add unrequested syllabus scope.
2. **New TREATMENT before demo:** ask a bounded DeepSeek request for three different teaching arcs, selected arc, visual focus, before/after state, 4–6 beats and sound map. Choose 'misconception → correction' only when it helps this KLP; otherwise a worked derivation/evolution without a wrong answer is correct. No demo story, dialogue, props sequence, soundtrack, or shot list.
3. **Look proof:** implement a small `src/` with the real topic's objects, layer structure and camera. Render a key frame and a later full-information frame. Subject in key shot ≥⅓ frame height; main text legible at 1080p (large Chinese teaching marks typically 300–450 px, minor labels ≥55 px; smaller subtitles remain separate).
4. **Voice first:** write concise natural language lines that explain why, not board-speak (`A+B` without meaning). Generate each line independently via suitable `edge-tts` voice or permitted equivalent, measure actual durations, then lock visual/EV/subtitle cues to them. Preserve actual wording; listen and report real ASR mismatch, never invent a perfect transcript. Music/foley remain subordinate.
5. **One timeline:** `render(t)` returns any frame independently using elapsed seconds. No wall clock, unseeded randomness, or video frame accumulation dependency. Maintain `DUR`, `READY`, `EV`, true bounds from `TEXTS(t)`. Wrong-claim, other-claim and structural strokes are separate layers; erasing removes only its target.
6. **Segment gate:** first **S1 alone is ~10 s**, not the entire film. Render S1 (`[0,10)`) with sound and ≥2 frames, run layout/read checks, view the real frames and listen. Send actual preview/hash plus short README and an empty `COO-GATE.md` to COO. **Wait for a written COO 「段过」 before S2.** Repeat S2–S4 (or similar) and full-film review. Do not assign PASS to yourself.
7. **Whole film:** keep the board/camera/coordinates continuous; generate full source using final chronology instead of stitching drifting clocks. Mux H264+AAC using `ffmpeg` (about −14 to −16 LUFS; peak ≤−1.5 dBFS). Inspect full speed with audio and current full-clip key frames. COO or a human reviewer—not a clean `readcheck` or `ffprobe`—fills the final external gate.

## Style musts

- Clean deep ink-green board, wooden frame/tray, subtle grain; one classroom-wide shot shows a physical room. No dusty overlay, glowing chalk, floating UI or ghost old lesson.
- **White = structure, one accent = the conceptual part being tracked**, pale second chalk only for a wrong/other voice. No decorative accent arrows or rainbow.
- Real stroke progression using centre-line data and correct stroke order, pressure profile and controlled width—not polyline plotter handwriting or a typeset font wipe. Somebody literate in the script must review its structure; don't claim certified stroke order.
- Only keywords/short worked representation on board; spoken lesson explains the rest. Text and annotation never overlap the subject/equation: assert geometry and review actual 1080p images. No subtitles over the traced claim; no moving camera removes text while being read.
- If a correction is used: show the wrong value clearly; a single visible progressive soft leader-edge mask wipes only its layer; leave unaffected structure; correct in the same place from the same view. No unexplained disappearance or two needless erasures.
- `CJK ÷ 4.5 + Latin/numerals ÷ 15 + 1.5 s` after a block completes is the default reading budget; a completed board is not considered readable during animation. Simplify words, don't speed essential strokes into illegibility.

## DeepSeek working pattern

Write small, explicit per-segment `src/*.mjs` functions with input data and absolute timelines, not one giant patch. In source and assertions define the subject bounds, equation parts/layers, tracked component (keeping its identifier/colour across transforms), `wipe` target and one shared world→screen transform. The director may use this repository's renderer, optional existing library, or its own equivalent while preserving `window.render(t)` and bounds.

After every bounded request, examine changed files and tests rather than accepting self-attestation. Serialize writes to source; don't launch parallel authors overwriting the board. Set `task.status` as "plan", "segment-in-review", "segment-approved", "full-in-review", rather than inventing "PASS". Record if DeepSeek produced only text or code versus generated actual render frames.

## Local implementation

The [assets/layout-driver.mjs](assets/layout-driver.mjs) helper supplies canvas scaling, text measured bounds, centred subject layout, camera, segment clock and zero-overlap geometry assertions. Include it locally or retain equivalent behaviour if choosing existing lemo code.

`scripts/new_project.py OUTPUT --subject ... --klp ... --goal ...` creates a neutral no-dependency scaffold (`index.html`, timeline, small editable modules, gate docs, layout verifier), defaulting to ordinary chalk-progress glyph masks **not certified hand-authored CJK centre lines**. For native stroke quality, replace that starter with readable authored path data or the licensed lib as appropriate. Its example write->wipe->rewrite works with coloured geometries, not a lesson secret unknown to the model.

It has no picture automatically inserted for an unknown KLP; the scene says "implementation required" until real subject illustrations are supplied. This is failing-safe design, not a finished film. Verify with `node scripts/verify.mjs layout`. For a real capture, choose discovered Chrome/React-free browser automation, or existing lemo `core/render/still.mjs`/`video.mjs`; specify rather than pretend a CLI was executed. Node ≥20, headsless Chrome and FFmpeg availability must actually be checked.

## COO / human output checklist

Producer supplies actual unchecked evidence; never prefill approval:

- [ ] TREATMENT, verified KLP source/status and explicitly original topic logic; no borrowed demo story/music.
- [ ] Each ~10 s segment: real MP4+VO, ≥2 selected stills, timing/layout evidence, hash, exact path and empty COO gate.
- [ ] Main writing/diagram occupies sufficient scale; all text/equation/annotation/subtitle bounds disjoint at all times and camera endpoints.
- [ ] Accurate key chalk grammar: stroke order checked by a reader; if correction, one layer-scoped visible wipe; no residual wrong strokes.
- [ ] Whole film frames, contact sheet, actual listened narration, continuous progress and final held frame.
- [ ] `film.mp4` 1920×1080, 30–45 s, chosen fps / H264+AAC / decode / loudness / hash / SRT where needed.
- [ ] `evidence/RUN.md` with real DeepSeek ID/session, tools, commands, discovered deps, tests, failures and remaining limits.
- [ ] `TREATMENT`, source, deterministic build steps, `CREDITS` and retained font/audio/engine licences.
- [ ] `FULL-GATE.md` empty for COO/human review; no teacher, student, handwriting, model or film PASS claimed.

See also [pitfalls](references/pitfalls.md): lesson overload, small subject, crossing correction, mis-erasure, legal fonts and overclaiming evidence.
