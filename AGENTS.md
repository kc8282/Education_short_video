# Agent guide

## Choose, then load

A teaching brief needs one style. Load the full `SKILL.md` at **`.agents/skills/chalkboard/`** or **`.agents/skills/isometric-picture-book/`** before the TREATMENT. Follow its linked local references. Do not select from the folder name alone. These are reusable production methods for other subjects and KLPs, not the archive of any already filmed story.

## Working contract

1. Work in the brief's separate output folder. Do not modify an existing sample, other agents' jobs, or protected ports. Generated movie assets remain outside this style repository unless explicitly requested.
2. Necessary inputs: subject/grade, KLP code or verifiable intent, language (default `zh`), 30–45 s target, output paths. Use supplied facts; record source and trial/teacher-review status. No invented official KLP code.
3. Main brain is `deepseek-v4.1-flash` (alias `deepseek-4.1-flash`) through a discovered provider ID. Read [references/model-routing.md](references/model-routing.md). **TokenHub is optional**; never invent its endpoint or credentials. **No CloudAgent as director**.
4. Have DeepSeek create/modify the topic-specific TREATMENT, timeline, visual geometry and checks, while keeping the supplied contracts. No dropping a new string array into an old demo to call it a new lesson.
5. Prove look with actual drawing code, then follow [10-second gate](standing-rules/teach-video-10s-gate.md). The director may use tools sequentially for each smaller segment; serialize writes to canonical files and do not let a later model call overwrite a reviewed correction.
6. If a model, provider or rendering dependency is unavailable, report that blocker, not a fictional substitute result. Always identify the actual backend in `evidence/RUN.md`. Automatic layout checks do not replace frame viewing or VO listening.

## Optional starter

`scripts/new_project.py` creates a neutral scaffold with input data, a `render(t)` contract, layout bounds, and explicit `subject.mjs` implementation points. It has zero third-party drawing dependencies. The default scene deliberately contains **no lesson objects**; the director must implement topic-specific illustrations before calling verify/render. This avoids shipping fake diagrams for an unknown subject.

Lemo tooling is optional. Never assume it exists merely because this method was distilled from it. Its engine/fonts/audio keep their own licences. Preserve upstream licence files in each derived film; see `NOTICE.md`.

## Adding a method after Kevin approves it

1. Confirm the owner has explicitly approved this named method for inclusion, not merely looked at a sample.
2. Create `.agents/skills/<style>/SKILL.md`, `references/style-grammar.md`, `references/pitfalls.md`, and (only where useful) a neutral lightweight script/asset. Keep one style per directory.
3. Apply it to a genuinely different subject/KLP before the gate. Record unseen-subject trials privately if they contain private source material. Do not include private samples, huge videos or credentials in this public repository.
4. Link it from both README files. Preserve the DeepSeek input/model/honesty/gate contract and all source-specific licences. Do not call an added skill PASS without the appropriate human review.
5. Check no large MP4, original sample archive, private path or secret is staged. Verify relative links and any included scripts in a temporary directory.
