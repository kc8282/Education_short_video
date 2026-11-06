# Model routing: DeepSeek without a provider lock-in

## Discovery first

The skill's model is **`deepseek-v4.1-flash`**; `deepseek-4.1-flash` is the user's alias for that same intended model family. A provider may expose a more specific runtime ID. The director discovers then chooses an actually available Flash ID; it does not guess endpoint names or silently swap to a larger/other-family model.

On a machine with OpenCode:

```sh
opencode models | grep -i 'deepseek.*flash'
# Example, only if this exact ID is returned:
DIRECTOR=opencode/deepseek-v4.1-flash-free
opencode run --model "$DIRECTOR" --format json \
  --file /absolute/path/to/SKILL.md -- \
  BRIEF.md /absolute/path/to/.agents/skills/<style>/SKILL.md /absolute/path/to/other\-reference.md -- 'Apply the binding full SKILL. Produce ... for the new intake.'
# OpenCode 1.19.x variadic -f/run arguments: `--` ends option parsing.
# Without it a prompt may be mistaken for another attached file.
# For a large brief use an instruction file in a scratch folder and give its absolute path explicitly.
```

On private workstations the ID could be `01tokenhub/deepseek-v4.1-flash`; **TokenHub is optional**, not a requirement. An OpenAI-compatible shell/API client is also fine if its provider actually serves the intended model. Keep API keys in the service/environment's normal secret store, never in the film or this repository. For HTTP routes, consult the live provider's documentation for available model IDs and multimodal support, then redact headers/tokens from run logs.

Before production, make a small text-only request and record the JSON event with session ID and stop reason in `evidence/`. For image input, separately verify the client tool's image attachment (not just whether `opencode models` lists a name). A text response is not evidence that a full movie was created.

## Discipline for a smaller director

- Reduce each request: one treatment, one segment, or one bounded fix. Write all path targets.
- Use this repository's contracts as fixed scaffolding; keep content in explicit timeline data and small functions. Ask the model to explain and check geometry, not to generate one huge monolithic patch.
- Only one designated process writes canonical scene files; no parallel patch jobs trampling an accepted correction.
- At each segment, inspect at actual 1080px output and listen to its voice. Automatic or model self-review cannot approve itself.
- Preserve the real provider, model ID, command/session, tool failures, fallbacks and unfinished work in `evidence/RUN.md`. Never print an Opus label to make a run look official. **No CloudAgent as main director.**

## ## Initial availability evidence

On 2026-11-06 (Asia/Shanghai), this box's `opencode models` returned `opencode/deepseek-v4.1-flash-free`. A tiny independent text request via that exact ID returned the requested compact JSON with a recorded OpenCode session, `reason:"stop"`, and zero cost reported by the CLI. This tests routing only, not full-film quality, vision, TTS or provider permanence. Free availability can change; rediscover each new environment.

No DeepSeek-directed end-to-end film was produced by this seed task. The source samples used other recorded models and separate human/tool correction; those samples do not prove equivalent DeepSeek quality.

OpenCode 1.19.3 was also smoke-tested with the `--` separator form; its tiny Chinese planning response returned normally. Some earlier longer probes without `--` stalled or read the prompt as a file; always use the separator when attaching skills and inspect whether an actual `text` event arrived. Nothing is assumed merely from exit 0 without an output event.

## Skill application smoke (method, not a full film)

Using OpenCode with the actual SKILL.md attachment and `--` delimiter, two fresh text-only tasks returned meaningful new-topic plans and explicit no-render/no-pass limits: water molecule identity versus spacing (`chalkboard`, session `ses_e4ee2c68affeyCmoZU5b4VNrXn`) and classifying animal examples by supplied shared traits (`isometric-picture-book`, session `ses_e4ee2be6dffez2gZbwKSsbfae6`). Both preserved four ~10 s segments, COO gating, large subject, non-overlap layout, render/TTS/ffmpeg evidence and actual-model routing. These validate instruction use on different subjects only; the generated illustrations in those text plans and their future science/grammar/renderer quality remain unproven.

Separately, generated neutral projects for those two different subjects were run by the seed executor (not authored by DeepSeek) through Chrome: 7 absolute-time points per style including `DUR=40`, `READY=true`, `render(t)` determinism, scene-specific geometry and true overlap rejects. `window.VERIFY_LAYOUT(t)` returns that audit; `window.render(t)` is a report object after drawing, so frame capture writes canvas pixels instead of interpreting the report as PNG. These tests validate scaffolding/clock/layout fault rejection, not film grade quality. No TTS or full MP4 was rendered in this seed task. Limited snapshots like this cannot establish deepseek full-film reliability.
