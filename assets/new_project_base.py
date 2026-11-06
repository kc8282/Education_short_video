"""Generate a lightweight, topic-neutral film scaffold, never a finished lesson."""
from pathlib import Path
import argparse
import json

SOURCE_ROOT = Path(__file__).resolve().parent
# Generated verification defaults to a local copy, not any repository installation.
GENERATED_VERIFY = """import { check } from './project-check.mjs';
const result = check(process.cwd(), process.argv[2] || 'layout');
console.log(JSON.stringify(result, null, 2));
process.exitCode = result.ok ? 0 : 1;
"""

def emit(path, content):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content if isinstance(content, bytes) else content.encode('utf-8'))

def runtime_api(style):
    path=SOURCE_ROOT / f'runtime-{style}.mjs'
    return path.read_text(encoding='utf-8')

def generate(style, skill_root=None):
    p=argparse.ArgumentParser(description=f'Create a neutral {style} scaffold; never a finished lesson.')
    p.add_argument('output', type=Path)
    p.add_argument('--subject', required=True)
    p.add_argument('--klp', required=True)
    p.add_argument('--goal', required=True)
    p.add_argument('--language', default='zh')
    p.add_argument('--model', default='deepseek-v4.1-flash')
    a=p.parse_args();root=a.output.resolve()
    if skill_root is None:
        skill_root = SOURCE_ROOT
    skill_root = Path(skill_root).resolve()
    assert (skill_root/'assets'/'layout-driver.mjs').is_file(), f'invalid skill assets: {skill_root}'
    if root.exists() and any(root.iterdir()):
        raise SystemExit('Refusing nonempty output; never overwrite an existing workdir')
    root.mkdir(parents=True,exist_ok=True)
    data = dict(
        version=1, style=style, subject=a.subject,
        **{'KLP code': a.klp},
        language=a.language, goal=a.goal,
        source={'status': 'SUPPLY VERIFIED SOURCE/REVIEW STATUS', 'source': None},
        director={'model': a.model, 'requested': 'deepseek-v4.1-flash', 'tokenhub_required': False},
        duration=40, fps=30, width=1920, height=1080,
        segments=[
            {'id': 'S01', 't0': 0, 't1': 10, 'goal': 'Establish one correct subject state'},
            {'id': 'S02', 't0': 10, 't1': 20, 'goal': 'Explain rule neutrally; no later spoiler'},
            {'id': 'S03', 't0': 20, 't1': 30, 'goal': 'One meaningful invariant/counterexample'},
            {'id': 'S04', 't0': 30, 't1': 40, 'goal': 'Recap, trial notice if supplied, full hold'},
        ],
        boardOrder={
            'invariant': 'SUPPLY the exact verified KLP invariant; not a sample story',
            'mode': 'write; optional wipe; correction' if style == 'chalkboard' else 'order; neutral rule; one change; recap',
            'labels': [
                {'id': 'goal', 'text': a.goal, 'start': 0, 'end': 9.5, 'layer': 'HOOK'},
                {'id': 'relation', 'text': 'SUPPLY exact verified keyword/relation', 'start': 10.2, 'end': 19.5, 'layer': 'RULE'},
                {'id': 'change', 'text': 'SUPPLY verified invariant/counterexample', 'start': 20.2, 'end': 29.5, 'layer': 'CHANGE'},
                {'id': 'recap', 'text': a.goal, 'start': 30.2, 'end': 39.5, 'layer': 'SUMMARY'},
                {'id': 'klp', 'text': a.klp, 'start': 0, 'end': 40, 'layer': 'META'},
            ],
        },
        geometry={
            'frame': {'x': 0, 'y': 0, 'width': 1920, 'height': 1080},
            'subject': {'id': 'topic-geometry', 'kind': 'subject', 'implemented': False, 'x': 260, 'y': 240, 'width': 1400, 'height': 500},
            'labels': [
                {'id': 'header', 'kind': 'text', 'x': 1160, 'y': 60, 'width': 660, 'height': 82},
                {'id': 'annotation', 'kind': 'text', 'x': 260, 'y': 800, 'width': 1120, 'height': 86},
                {'id': 'subtitles', 'kind': 'subtitle', 'x': 220, 'y': 950, 'width': 1200, 'height': 86},
                {'id': 'klp', 'kind': 'text', 'x': 1480, 'y': 966, 'width': 340, 'height': 70},
            ],
        },
        assets={'fonts': [], 'voice': [], 'foley': [], 'generated_media': False},
        review={'producer': 'NOT A PASS', 'fully_directed_by_deepseek': False},
    )
    if style == 'isometric-picture-book':
        data['worldUnit'] = 'm'
        data['scene'] = {
            'place': None, 'worldAxesDegrees': 30,
            'objects': [], 'order': [], 'change': None, 'invariant': None,
            'view': {'cx': 960, 'cy': 490, 'k': 1}, 'sourceOriginal': True,
        }
    else:
        data['boardOrder']['subject'] = {'id': 'topic-geometry', 'implemented': False}
    emit(root/'timeline.json',json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    for name in ('layout-driver','subject-audit'):
       emit(root/f'src/local-{name}.mjs',(skill_root/'assets'/f'{name}.mjs').read_bytes())
    emit(root/'scripts/verify-project.mjs',GENERATED_VERIFY)
    generated_check=(skill_root/'assets'/'project-check.mjs').read_text(encoding='utf-8').replace("from './subject-audit.mjs'", "from '../src/local-subject-audit.mjs'")
    emit(root/'scripts/project-check.mjs',generated_check)
    for target in ('src','scripts'):emit(root/target/'package.json','{"type":"module"}\n')
    emit(root/'src/app.mjs',runtime_api(style))
    colour='#f5f0de' if style=='chalkboard' else '#365d4e'
    emit(root/'src/subject.mjs',f"""// Intentionally not a film: director supplies this KLP's actual diagrams/actors/layers.
export const subject={{id:'topic-geometry',implemented:false}};
export function drawSubject(ctx,t,box){{
 ctx.save();ctx.strokeStyle='{colour}';ctx.lineWidth=5;ctx.setLineDash([18,16]);
 ctx.strokeRect(box.x,box.y,box.width,box.height);ctx.restore();
}}
// Derive actual silhouettes/world footprints and text bounds. Do not copy a demo scene.
// Any native handwriting, isometric object geometry, erase targets or motion interpolation goes here.
""")
    emit(root/'src/segments/s01.mjs',"""// One bounded DeepSeek request designs KLP-specific geometry/actions for [0,10).
export const segment={id:'S01',t0:0,t1:10};
// Maintain correct initial state. Do not leak later-segment answers or anomalies.
""")
    emit(root/'index.html',"""<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Original education short · new topic</title><style>html,body{margin:0;width:100%;height:100%;overflow:hidden}canvas{display:block;width:100vw;height:100vh}</style></head><body><canvas id="stage"></canvas><script type="module">import{mount}from'./src/app.mjs';const data=await fetch('./timeline.json').then(r=>r.json());await mount(document.querySelector('#stage'),data);</script></body></html>""")
    emit(root/'BRIEF.md',f"""# BRIEF · {a.subject}

- KLP code/intent: `{a.klp}`; verified source/review status: **to be supplied, never invented**
- Observable goal: {a.goal}
- Language: `{a.language}`; duration 30–45s; picture 1920×1080; separate output `{root}`
- Style: `{style}`; director `deepseek-v4.1-flash` (alias `deepseek-4.1-flash`), actual discovered ID logged
- TokenHub optional; no CloudAgent director; no Opus claim; no reference-demo story/assets
""")
    emit(root/'TREATMENT.md',f"""# TREATMENT · {a.subject}

Status: **director has not written this**. Not a finished or approved treatment.

DeepSeek supplies three original arcs/places and selected rationale; teaching geometry/invariant;
voice/action cue table; four ~10s segments; original sound; zero-overlap/subject-size plan.
Goal verified by supplied source: {a.goal}. Demo technique only after this document; never borrow story,
dialogue, soundtrack, props, camera table or all-film timestamps. S1 must be only its own ~10s.
""")
    emit(root/'README.md',f"""# ORIGINAL {style} scaffold — NOT an education film

Before rendering, the actual DeepSeek model writes TREATMENT and accurately implements
`src/subject.mjs` (and related data) for the new KLP. `mount` deliberately refuses any
film render while its `implemented` flag is false; production must gate that flag on real topic code, not merely flip it. The generic layout below is a neutral
structure, **not validated pedagogy or a claim about this topic**.

- `node scripts/verify-project.mjs layout`: static safe layout/clock only
- `node scripts/verify-project.mjs strict`: rejects unimplemented subject
- `node scripts/verify-project.mjs full`: demands media and blank external gate, not automatic approval
- Discover local headless browser/capture (or optional licensed lemo helpers): **not bundled as magic**
- Serve only on a chosen free port; await `window.READY`, sample absolute `render(t)`, record command/source
- Use `edge-tts` or permitted equivalent per line, measure WAVs then lock cues; listen to actual voice
- About 10s each: MP4+≥2 frames+listened VO+layout notes → COO segment approval → next; full human A/V audit
- `ffmpeg` muxes H264/AAC; original/licensed font/audio/engine credits retained; gate docs empty initially
- No KLP correctness, native handwriting, teacher/student approval or DeepSeek full-film success is claimed
""")
    emit(root/'evidence/RUN.md',"""# RUN
No model session or rendered media exists merely because a scaffold was created.
Record discovered actual DeepSeek provider/model/session, true other assistance/environment,
exact commands, output hashes, test and listening gaps and external gate decisions. Never imply PASS.
""")
    for name in ('COO-GATE.md','FULL-GATE.md','CREDITS'):emit(root/name,'')
    print(root)
