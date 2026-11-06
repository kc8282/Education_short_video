# Shared production pipeline

## 1. Lock meaning before look

Use the subject and verified KLP. Write one observable learning outcome, prerequisite vocabulary, misconception(s), rule(s) actually taught and exclusions. For multiple attributes (colour, shape or conflicting variables), either teach all promised ones or explicitly narrow the lesson; never imply completeness from half a rule. Mark trial/unreviewed KLP status supplied by the brief, including a compact on-screen footer if required.

## 2. New treatment, not demo substitution

Have the actual DeepSeek director produce three candidate teaching arcs and select one. Record the arc, single learning turn, needed visual geometry, a cue/beat table and sound design. This happens before looking at a reference demo. A reference can teach brush strokes or projection only—not story, camera table, problem values, props sequence, dialogue, soundtrack, end card, or branding. A one-file same-template substitution is not a new direction. Compare structure/opening/shot path/sound/ending before delivery; at least four must differ from any reference demo.

## 3. A small reproducible picture API

A website title is not a render API. Each project keeps one absolute timeline in seconds, deterministic PRNG (not `Math.random()`), no incremental animation hidden between captures, and fonts loaded before drawing. Expose:

```js
window.DUR = 40;                  // derive from actual voice timings, not padding
window.render = (t) => { /* draw any frame independently at 1920×1080 */ };
window.READY = true;              // only after assets/fonts load
window.EV = [];                   // optional drawing / VO / sound events
window.TEXTS = (t) => [];          // every visible text's true screen bounds
```

Capture with headless Chromium screenshots → ffmpeg, or any local equivalent that samples `render(t)`. Write segment endpoints as an absolute `[start,end)` range. For continuous scenes, build the full source but render and gate each 10 s interval; at the end, re-render the full source rather than hard-joining independently drifting MP4s. A segment can be a hard-cut independently rendered shot if the treatment says so. Preserve at least two key PNGs per segment including start/mid/end of critical animations.

## 4. Voice first, synchronized

Make voice lines short, concrete, and synchronized to the named action. `edge-tts` (e.g. a suitable language/voice) is one option, not mandatory; use a permitted local/online equivalent if needed and disclose it. Measure each generated WAV and lock picture/subtitle timing to those measurements. Listen for meaning, pronunciation and duplication; ASR diff is auxiliary evidence only. Export `.srt` if subtitles are in the film. On-board words are keywords, not a full transcript.

## 5. Layout and media checks

Main teaching subject in its key shot at least one third of the frame height; for primarily object-based isometric lessons target 35–45% of height for the whole subject grouping (not a distant decorative scene). More important than that numeric proxy: the actual meaningful geometry is readable, not empty platform/ground. Use one world→screen transform for marker, text and subject. Verify **zero text/subject, text/text, annotation/subject overlap**, including borders, camera endpoints, subtitles and changing labels.

Check all rendered frames when practical using true exported bounds; also open actual key frames at full size. Record measurements rather than assuming a screenshot's approximate safety. Inspect transitions for blank frames, residuals, wrong-layer erasure, NaN, clipping and occlusion. Codec/probe/decode/hash are output integrity—not a teaching approval.

## 6. Mux and review

Keep original/openly licensed audio only; music subordinate to speech. Target roughly −14 to −16 LUFS integrated (or the brief's stated level), ≤−1.5 dBFS true peak. Mux local H.264 + AAC with `ffmpeg`; verify duration, fps, 1920×1080, full decode, silence, black frames, current source hash and final VO. Do not stop any pre-existing service or kill an unrelated process. See the [delivery checklist](delivery-checklist.md) and mandatory [10 s rule](../standing-rules/teach-video-10s-gate.md).
