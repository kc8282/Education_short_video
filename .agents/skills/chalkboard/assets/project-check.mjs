import fs from 'node:fs';
import process from 'node:process';
import { pathToFileURL } from 'node:url';
import { audit } from './subject-audit.mjs';

export function check(root, mode = 'layout') {
  const file = pathToFileURL(root).href.endsWith('/') ? new URL('timeline.json', pathToFileURL(root)) : new URL(`file://${root}/timeline.json`);
  const data = JSON.parse(fs.readFileSync(pathToFileURL(`${root}/timeline.json`), 'utf8'));
  const errors = [];
  const segments = data.segments ?? [];
  segments.forEach((s, i) => {
    if (s.t1 - s.t0 > 12) errors.push(`${s.id}: over ~10 s gate`);
    if (segments[i + 1] && s.t1 !== segments[i + 1].t0) errors.push(`${s.id}: discontinuity`);
  });
  const targetDuration = data.duration;
  if (targetDuration < 30 || targetDuration > 45) errors.push('duration outside 30–45 s');
  if (segments.length && Math.abs(segments.at(-1).t1 - targetDuration) > .001) errors.push('last segment does not reach DUR');
  if (data.style === 'isometric-picture-book' && data.scene?.worldAxesDegrees !== 30) errors.push('scene.worldAxesDegrees must be fixed 30deg');
  if (styleList().indexOf(data.style) === -1) errors.push('unknown style');
  if (!data.director?.model?.startsWith('deepseek-v4.1-flash') && data.director?.model !== '01tokenhub/deepseek-v4.1-flash') errors.push('actual discovered DeepSeek model ID absent');
  const g = data.geometry ?? {};
  const geometry = g.frame && g.subject && g.labels ? audit([g.subject, ...g.labels], [], { frame: g.frame }) : { ok: false, errors: ['incomplete geometry contract'] };
  errors.push(...geometry.errors);
  // An unimplemented subject may be inspected for layout but must not masquerade as film-ready.
  if (['strict', 'render', 'full'].includes(mode) && !g.subject?.implemented) errors.push('topic geometry not implemented; no rendering/film claim');
  if (mode === 'full') {
    if (!fs.existsSync(pathToFileURL(`${root}/film.mp4`))) errors.push('film.mp4 is missing; no full review');
    const gate = pathToFileURL(`${root}/FULL-GATE.md`);
    if (!fs.existsSync(gate) || fs.statSync(gate).size) errors.push('FULL-GATE.md must be present and prefilled 0 bytes');
  }
  return { mode, ok: errors.length === 0, errors, geometry, mediaAccepted: false, subjectImplemented: !!g.subject?.implemented };
}
function styleList() { return ['chalkboard', 'isometric-picture-book']; }
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const result = check(process.argv[2] || '.', process.argv[3] || 'layout');
  console.log(JSON.stringify(result, null, 2));
  process.exitCode = result.ok ? 0 : 1;
}
