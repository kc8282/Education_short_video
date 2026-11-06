import { screenZones, segmentTime, viewAt, projectBox, writeProgress } from './local-layout-driver.mjs';
import { audit } from './local-subject-audit.mjs';
import { drawSubject, subject } from './subject.mjs';

/**
 * Build capture hooks after the topic geometry exists. No output exists until READY.
 * The supplied starter is neutral structure, never the teaching diagram itself.
 */
export async function mount(canvas, data) {
  if (!subject.implemented) {
    throw new Error('Topic subject not implemented: scaffold is not a film');
  }
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D required');
  canvas.width = data.width;
  canvas.height = data.height;
  const palette = data.style === 'chalkboard'
    ? { background: '#18372b', ink: '#f5f0de' }
    : { background: '#f1e8d8', ink: '#2a2e29' };
  function draw(t) {
    if (!Number.isFinite(t) || t < 0 || t > data.duration) {
      throw new RangeError('Time outside absolute film timeline');
    }
    const segment = data.segments.find(s => t >= s.t0 && t < s.t1) ?? (t === data.duration ? data.segments.at(-1) : undefined);
    if (!segment) throw new RangeError('Timeline discontinuity');
    const clock = segmentTime(t, segment);
    ctx.fillStyle = palette.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if (data.style === 'chalkboard') {
      ctx.strokeStyle = '#78674b';
      ctx.lineWidth = 20;
      ctx.strokeRect(90, 140, 1740, 780);
      ctx.strokeStyle = '#8f7955';
      ctx.lineWidth = 15;
      ctx.beginPath();
      ctx.moveTo(100, 915);
      ctx.lineTo(1820, 915);
      ctx.stroke();
    } else {
      ctx.strokeStyle = '#e3d7c3';
      ctx.lineWidth = 1;
      for (let y = 870; y > -400; y -= 90) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1600, y - 800); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(320, y - 800); ctx.lineTo(1920, y); ctx.stroke();
      }
    }
    const subjectMargins = projectBox(data.geometry.subject, viewAt(t));
    const objects = [{ id: subject.id, kind: 'subject', ...subjectMargins }];
    drawSubject(ctx, clock.local, subjectMargins);
    for (const [key, zone] of Object.entries(screenZones())) {
      if (key === 'subject') continue;
      const label = data.boardOrder.labels.find(item =>
        (key === 'header' && item.id === 'goal') ||
        (key === 'annotation' && item.id === 'relation') ||
        (key === 'klp' && item.id === 'klp'));
      const text = key === 'subtitles'
        ? 'Replace with measured voice-associated subtitles before filming' : label?.text;
      if (!text) continue;
      const bounds = writeProgress(ctx, text, zone, 1, {
        size: key === 'header' ? 45 : 42,
        minSize: 22,
        font: `500 42px ${data.style === 'chalkboard' ? 'system-ui' : '"Noto Serif SC", Georgia, serif'}`,
        color: palette.ink,
      });
      objects.push({ ...bounds, id: key, kind: key === 'subtitles' ? 'subtitle' : 'text' });
    }
    return objects;
  }
  const hooks = {
    DUR: data.duration,
    READY: false,
    EV: [],
    PROJECT: data,
    render(t) {
      const result = audit(draw(t), [], { frame: data.geometry.frame });
      if (!result.ok) throw new Error(result.errors.join('; '));
      return result;
    },
    TEXTS(t) { return draw(t).filter(item => item.kind === 'text' || item.kind === 'subtitle'); },
    VERIFY_LAYOUT(t) { return audit(draw(t)); },
  };
  // Published only after font layout has stabilized: no partially initialized capture page.
  await document.fonts.ready;
  hooks.READY = true;
  Object.assign(window, hooks);
  return hooks;
}
