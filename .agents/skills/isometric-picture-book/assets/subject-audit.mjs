/** Geometry audit. It is not a substitute for watching film/listening to narration. */
export function overlaps(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}
export function contains(outer, a, margin = 0) {
  return a.x >= outer.x + margin && a.y >= outer.y + margin && a.x + a.width <= outer.x + outer.width - margin && a.y + a.height <= outer.y + outer.height - margin;
}
export function audit(elements, subject = [], opts = {}) {
  const errors = [];
  const frame = opts.frame ?? { x: 0, y: 0, width: 1920, height: 1080 };
  const teaching = [...subject, ...elements.filter(x => x.kind === 'subject')];
  const text = elements.filter(x => x.kind === 'text' || x.kind === 'subtitle');
  for (const a of elements) {
    if (![a.x, a.y, a.width, a.height].every(Number.isFinite)) errors.push(`${a.id}: non-finite bounds`);
    else if (!contains(frame, a, opts.margin ?? 4)) errors.push(`${a.id}: outside frame safe area`);
  }
  for (let i = 0; i < text.length; i++) {
    for (let j = i + 1; j < text.length; j++) if (overlaps(text[i], text[j])) errors.push(`text/text ${text[i].id} / ${text[j].id}`);
    for (const s of teaching) {
      if (text[i].id === s.id) errors.push(`duplicate element id ${s.id}`);
      if (overlaps(text[i], s)) errors.push(`text/subject ${text[i].id} / ${s.id}`);
    }
  }
  for (const s of teaching) if (s.height < frame.height / 3) errors.push(`${s.id ?? 'subject'}: key teaching bounds ${(s.height / frame.height * 100).toFixed(1)}% < 33.3% height`);
  return { ok: errors.length === 0, errors, elementsChecked: elements.length, subjectGroups: teaching.length, mediaAccepted: false };
}
