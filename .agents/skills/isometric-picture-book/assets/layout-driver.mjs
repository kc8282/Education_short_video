/** Dependency-free canvas helpers. Bounds come from the same calls that draw. */
export const W = 1920, H = 1080;

export function rect(x, y, width, height) {
  for (const [k, v] of Object.entries({ x, y, width, height })) {
    if (!Number.isFinite(v)) throw new Error(`Non-finite layout ${k}`);
  }
  if (width <= 0 || height <= 0) throw new Error('A layout rectangle needs positive size');
  return { x, y, width, height };
}

export function inRect(parent, x, y, w, h) {
  if (x < 0 || y < 0 || x + w > parent.width || y + h > parent.height) {
    throw new Error('Safe rectangle exceeds its parent; resize content, do not clip');
  }
  return rect(parent.x + x, parent.y + y, w, h);
}

export const screenZones = () => ({
  screen: rect(0, 0, W, H),
  header: rect(1160, 60, 660, 82),
  subject: rect(260, 240, 1400, 500),
  annotation: rect(260, 800, 1120, 86),
  subtitles: rect(220, 950, 1200, 86),
  footer: rect(1480, 966, 340, 70),
});

/** Use one board/world mapping for object, label, arrow and camera. */
export function projectBox(box, view) {
  const zoom = view.zoom ?? 1;
  return rect((box.x - (view.cx ?? 0)) * zoom, (box.y - (view.cy ?? 0)) * zoom, box.width * zoom, box.height * zoom);
}
export function viewAt(t) {
  // Starter is fixed: no subject is accidentally carried across a safe edge.
  return { cx: 0, cy: 0, zoom: 1, t };
}
export function segmentTime(t, segment) {
  // The complete continuous render API includes its exact DUR hold frame;
  // `[a,b)` segment selection belongs to the caller, so t=10 is next S2 normally.
  if (t < segment.t0 || t > segment.t1) throw new RangeError(`outside declared clip interval`);
  if (segment.t1 <= segment.t0) throw new RangeError('a clip needs positive duration');
  const local = t - segment.t0;
  return { local, progress: local / (segment.t1 - segment.t0) };
}

export function textBox(ctx, text, zone, opts = {}) {
  const padding = opts.padding ?? 8;
  const maxWidth = zone.width - 2 * padding;
  let size = Math.min(opts.size ?? 56, zone.height - 2 * padding);
  ctx.save();
  const family = opts.font ?? '600 "Noto Serif SC", "Source Han Serif SC", serif';
  let metrics;
  do {
    ctx.font = `${opts.weight ?? 600} ${size}px ${family.replace(/^600\s*/, '')}`;
    metrics = ctx.measureText(text);
    if (metrics.width <= maxWidth || size <= (opts.minSize ?? 30)) break;
    size -= 2;
  } while (size >= (opts.minSize ?? 30));
  if (metrics.width > maxWidth) throw new Error(`Text requires more than the allotted lines: ${text}`);
  const align = opts.align ?? 'center';
  const x = align === 'left' ? zone.x + padding : align === 'right' ? zone.x + zone.width - padding : zone.x + zone.width / 2;
  const y = zone.y + zone.height / 2;
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  const bounds = rect(x - (align === 'center' ? metrics.width / 2 : align === 'left' ? 0 : metrics.width) - (metrics.actualBoundingBoxLeft || 0) * 0,
    y - Math.max(metrics.actualBoundingBoxAscent || size * 0.78, size * 0.78), metrics.width,
    Math.max(metrics.actualBoundingBoxAscent || size * 0.78, size * 0.78) + Math.max(metrics.actualBoundingBoxDescent || size * 0.25, size * 0.25));
  ctx.restore();
  return { bounds, x, y, size, font: ctx.font };
}

/** Ordinary glyph reveal for scaffold layout. Not native-stroke certified handwriting. */
export function writeProgress(ctx, text, zone, progress, opts = {}) {
  const fit = textBox(ctx, text, zone, opts);
  const chars = [...text];
  const covered = Math.max(0, Math.min(1, progress)) * chars.length;
  ctx.save();
  ctx.font = fit.font; ctx.fillStyle = opts.color ?? '#f5f0de';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const widths = chars.map(c => ctx.measureText(c).width);
  let cursor = fit.bounds.x;
  for (let i = 0; i < chars.length; i++) {
    if (i + 1 <= covered) ctx.fillText(chars[i], cursor + widths[i] / 2, fit.y);
    else if (i < covered) {
      ctx.save(); ctx.beginPath(); ctx.rect(cursor, zone.y, widths[i] * (covered - i), zone.height); ctx.clip();
      ctx.fillText(chars[i], cursor + widths[i] / 2, fit.y); ctx.restore();
    }
    cursor += widths[i];
  }
  ctx.restore();
  return fit.bounds;
}

export function rectStroke(ctx, bounds, color, width = 3) {
 ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.strokeRect(bounds.x,bounds.y,bounds.width,bounds.height);ctx.restore();
}

export function element(id, kind, bounds, layer = 'HOOK') {
  return { id, kind, layer, ...bounds };
}
