/* SAHNE 1 — BİR DAİRE (0–10 s)  Alanı ne kadar?
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** cubes of an L × W × H prism; when(q) gives each cube's arrival time (Infinity = never) */
  function cubes(L, W, H) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x++) out.push({ x, y, z });
    return out.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  function fillT(ctx, O, c, B, t, a, when, hot, seed) {
    let n = 0;
    container(ctx, O, c, B[0], B[1], B[2], a, seed, () => cubes(...B).forEach((q, i) => {
      const t0 = when(q); if (!(t >= t0)) return; n++;
      const k = seg(t, t0, t0 + 0.3);
      block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.2, 1, 1, 1, a * k, hot ? hot(q) : 0, seed + 100 + i * 3);
    }));
    return n;
  }
  function edges(ctx, env, O, c, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(O, c, ...p), Q = Pj(O, c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const [L, W, H] = B;
    let q = m([0, 0, 0], [L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([L, 0, 0], [L, W, 0]); F().T(ctx, labels[1], q[0] + 50, q[1] + 12, o);
    q = m([L, W, 0], [L, W, H]); F().T(ctx, labels[2], q[0] + 48, q[1], o);
  }
  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  const TAU = Math.PI * 2;
  function fillPoly(ctx, P, a, fills, seed, w = 2.5) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fills.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    if (w > 0) Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.85, seed, taper: [0, 0] });
  }
  /** one slice: apex, bisector direction phi, half-angle h, radius R */
  function slice(ctx, apex, phi, h, R, a, even, seed) {
    const P = [apex]; for (let j = 0; j <= 10; j++) { const u = phi - h + (2 * h * j) / 10; P.push([apex[0] + R * Math.cos(u), apex[1] + R * Math.sin(u)]); }
    fillPoly(ctx, P, a, [even ? amber(a * 0.42) : `rgba(${LI.INK_RGB},${a * 0.07})`], seed, 1.8);
  }
  const angd = (a, b) => { let d = b - a; while (d > Math.PI) d -= TAU; while (d < -Math.PI) d += TAU; return d; };
  /** a circle cut into n slices that travel into a row between tMove and tMove + 2.6 */
  function slices(ctx, env, n, t, tCut, tMove, a, seed) {
    if (a <= 0) return;
    const L = KD.L(env), C = [L.C.x, L.C.y], R = L.C.R, h = Math.PI / n, w = TAU * R / n;
    const x0 = L.ROW.x - (Math.PI * R + w / 2) / 2, y0 = L.ROW.y, cut = seg(t, tCut, tCut + 0.8);
    for (let i = 0; i < n; i++) {
      const th = (i + 0.5) * TAU / n - Math.PI / 2, even = i % 2 === 0;
      const tx = even ? x0 + (i / 2) * w + w / 2 : x0 + ((i + 1) / 2) * w, ty = even ? y0 : y0 + R * Math.cos(h);
      const ph = even ? Math.PI / 2 : -Math.PI / 2;
      const k = inOut(seg(t, tMove + (i / n) * 1.4, tMove + (i / n) * 1.4 + 1.2));
      const lift = Math.sin(Math.PI * k) * 40;
      slice(ctx, [lerp(C[0], tx, k), lerp(C[1], ty, k) - lift], th + angd(th, ph) * k, h, R, a * (cut > 0 || k > 0 ? 1 : 1), even, seed + i * 3);
    }
    if (cut < 1 && cut > 0) { /* the knife: radii drawn one by one */
      for (let i = 0; i < n; i++) { const al = seg(cut, i / n, i / n + 0.2); if (al <= 0) continue; const u = i * TAU / n - Math.PI / 2; Ink.path(ctx, [C, [C[0] + R * Math.cos(u), C[1] + R * Math.sin(u)]], { w: 2.5, alpha: a * al, seed: seed + 500 + i, taper: [0, 0] }); }
    }
  }
  function brace(ctx, p, q, a, txt, side, s, seed) {
    if (a <= 0) return; const dx = q[0] - p[0], dy = q[1] - p[1], d = Math.hypot(dx, dy), nx = -dy / d * side, ny = dx / d * side, o = 18;
    Ink.path(ctx, [[p[0] + nx * 6, p[1] + ny * 6], [p[0] + nx * o, p[1] + ny * o], [q[0] + nx * o, q[1] + ny * o], [q[0] + nx * 6, q[1] + ny * 6]], { w: 2.5, alpha: a, seed, taper: [0, 0], color: LI.AMBER_RGB });
    F().T(ctx, txt, (p[0] + q[0]) / 2 + nx * (o + s * 0.55), (p[1] + q[1]) / 2 + ny * (o + s * 0.55), { size: s * 0.72, alpha: a, halo: true, color: A.amber });
  }
  function review(ctx, env, t, a) {
    if (a <= 0) return;
    const L = KD.L(env), V = L.RV, s = L.G.s, f = F();
    // rectangle 5 × 3
    const [rx, ry, rc] = V.rect, k1 = a * seg(t, 11.4, 11.9);
    if (k1 > 0) {
      fillPoly(ctx, [[rx, ry], [rx + 5 * rc, ry], [rx + 5 * rc, ry - 3 * rc], [rx, ry - 3 * rc]], k1, [amber(k1 * 0.25)], 70000);
      ctx.strokeStyle = `rgba(${LI.INK_RGB},${k1 * 0.25})`; ctx.lineWidth = 1.3; ctx.beginPath();
      for (let i = 1; i < 5; i++) { ctx.moveTo(rx + i * rc, ry); ctx.lineTo(rx + i * rc, ry - 3 * rc); }
      for (let j = 1; j < 3; j++) { ctx.moveTo(rx, ry - j * rc); ctx.lineTo(rx + 5 * rc, ry - j * rc); } ctx.stroke();
      f.T(ctx, 'a · b', rx + 2.5 * rc, ry + s * 0.8, { size: s * 0.66, alpha: k1, halo: true, color: A.amber });
    }
    // parallelogram: cut the left triangle and move it to the right
    const [px, py, pc] = V.par, k2 = a * seg(t, 14.2, 14.7), m = inOut(seg(t, 15.4, 17.0));
    if (k2 > 0) {
      fillPoly(ctx, [[px + 2 * pc, py], [px + 5 * pc, py], [px + 7 * pc, py - 3 * pc], [px + 2 * pc, py - 3 * pc]], k2, [amber(k2 * 0.25)], 70100);
      const dx = 5 * pc * m;
      fillPoly(ctx, [[px + dx, py], [px + 2 * pc + dx, py], [px + 2 * pc + dx, py - 3 * pc]], k2, [amber(k2 * 0.4)], 70120);
      f.T(ctx, 'taban · yükseklik', px + 4.5 * pc, py + s * 0.8, { size: s * 0.6, alpha: k2, halo: true, color: A.amber });
    }
    // circumference: the rim rolls out into a segment 2πr long
    const [cx, cy, cr] = V.circ, k3 = a * seg(t, 18.4, 18.9), u = seg(t, 19.4, 21.4);
    if (k3 > 0) {
      const P = []; for (let j = 0; j <= 48; j++) { const v = Math.PI / 2 + j / 48 * TAU * (1 - u); P.push([cx + cr * Math.cos(v), cy + cr * Math.sin(v)]); }
      if (P.length > 1 && u < 1) Ink.path(ctx, P, { w: 4, alpha: k3, seed: 70200, taper: [0, 0], color: LI.AMBER_RGB });
      const y = cy + cr, len = TAU * cr * u;
      if (u > 0) Ink.path(ctx, [[cx, y], [cx - len, y]].map((q) => [q[0] + TAU * cr / 2, q[1]]), { w: 4, alpha: k3, seed: 70210, taper: [0, 0], color: LI.AMBER_RGB });
      ctx.beginPath(); ctx.arc(cx, cy, cr, 0, 7); ctx.strokeStyle = `rgba(${LI.INK_RGB},${k3 * 0.3})`; ctx.lineWidth = 2; ctx.stroke();
      f.T(ctx, 'çevre: 2 · π · r', cx, y + s * 0.8, { size: s * 0.6, alpha: k3 * seg(t, 21.0, 21.4), halo: true, color: A.amber });
    }
  }

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bu dairenin alanı ne kadar?'],
      [10.6, 27.8, 'Bildiklerimizi hatırlayalım'],
      [28.4, 45.8, 'Daireyi dilimleyip yeniden dizelim'],
      [46.4, 63.8, 'Dilimler bir dikdörtgene dönüşüyor'],
      [64.4, 79.8, 'Farklı dairelerde deneyelim'],
    ]);
  }

  function figure(ctx, env, t) {
    const L = KD.L(env), a = END(t), s = L.G.s, C = [L.C.x, L.C.y], R = L.C.R;
    // S1 and S5: a whole circle with its radius
    const a1 = (win(t, 4.6, 10.2) + win(t, 64.8, 79.8)) * a;
    if (a1 > 0) {
      ctx.beginPath(); ctx.arc(C[0], C[1], R, 0, 7); ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a1})`; ctx.fill(); ctx.fillStyle = amber(a1 * 0.3); ctx.fill();
      const P = []; for (let j = 0; j <= 60; j++) P.push([C[0] + R * Math.cos(j / 60 * TAU), C[1] + R * Math.sin(j / 60 * TAU)]);
      Ink.path(ctx, P, { w: 3.5, alpha: a1, seed: 71000, taper: [0, 0] });
      const k = a1 * seg(t, t < 40 ? 6.0 : 65.4, (t < 40 ? 6.0 : 65.4) + 0.5);
      if (k > 0) { Ink.path(ctx, [C, [C[0] + R, C[1]]], { w: 3, alpha: k, seed: 71010, taper: [0, 0] }); F().T(ctx, 'r', C[0] + R / 2, C[1] - s * 0.5, { size: s * 0.7, alpha: k, halo: true }); }
      // S5: squares on the radius, about 3 and a bit fit
      const q = a1 * win(t, 66.4, 79.8);
      if (q > 0) {
        fillPoly(ctx, [C, [C[0] + R, C[1]], [C[0] + R, C[1] - R], [C[0], C[1] - R]], q * 0.9, [amber(q * 0.5)], 71020);
        F().T(ctx, 'r²', C[0] + R / 2, C[1] - R / 2, { size: s * 0.8, alpha: q, halo: true });
      }
    }
    review(ctx, env, t, win(t, 10.8, 27.8) * a);
    // S3–S4: 8, 16 and 32 slices
    [[8, 29.4, 31.0, 35.8], [16, 36.0, 37.2, 40.8], [32, 41.0, 42.2, 63.8]].forEach(([n, tc, tm, te], i) => slices(ctx, env, n, t, tc, tm, win(t, tc - 0.3, te) * a, 72000 + i * 500));
    const b = win(t, 47.4, 63.8) * a;
    if (b > 0) {
      const w = TAU * R / 32, x0 = L.ROW.x - (Math.PI * R + w / 2) / 2, y0 = L.ROW.y;
      brace(ctx, [x0 + w / 4, y0 + R], [x0 + w / 4 + Math.PI * R, y0 + R], b * seg(t, 47.4, 47.8), 'π · r', 1, s, 73000);
      brace(ctx, [x0 + w / 4 + Math.PI * R, y0 + R], [x0 + w / 4 + Math.PI * R, y0], b * seg(t, 49.0, 49.4), 'r', 1, s, 73010);
    }
    tally(ctx, env, t, [[66.4, 79.8, 'r = 10 cm: 3,14 · 10 · 10'], [68.0, 79.8, '= 314 cm²', true], [71.4, 79.8, 'r = 5 cm: 3,14 · 25 = 78,5 cm²']]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[6.2, 10.2, 'Karelerle saymak zor: kenarlar eğri'],
      [11.4, 14.0, 'Dikdörtgenin alanı: a · b'], [14.2, 18.2, 'Paralelkenar kesilip dikdörtgen olur: taban · yükseklik'], [18.4, 27.8, 'Çemberin uzunluğu: 2 · π · r'],
      [29.4, 45.8, 'Daireyi eş dilimlere kesip ters-düz dizelim'],
      [47.4, 63.8, 'Taban: çemberin yarısı, π · r · Yükseklik: r'],
      [65.4, 79.8, 'Alan = π · r²: yarıçaplı karenin 3 katından biraz fazla']]);
    exprs(ctx, t, at(W, 1), [[8.4, 10.2, 'Bildiğimiz şekillerden yardım alalım'], [22.6, 27.8, 'Dikdörtgene dönüştürmek işe yarar'],
      [38.6, 45.8, 'Dilimler inceldikçe şekil dikdörtgene benziyor'],
      [51.0, 63.8, 'Alan = π · r · r = π · r²'],
      [73.0, 79.8, '314 ≈ 3 · 100 + 14: kareden 3 tane ve biraz']]);
    exprs(ctx, t, at(W, 2), [[24.2, 27.8, 'Daireyi de bir dikdörtgene çevirebilir miyiz?', true], [42.8, 45.8, 'Kenarlar gittikçe düzleşiyor', true],
      [55.0, 63.8, 'Dairenin alanı = π · r²', true], [76.0, 79.8, 'Bağıntı her dairede işliyor', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['Daireyi eş dilimlere kes', 80.6], ['Ters-düz diz: dikdörtgene benzer', 81.6], ['Taban π · r, yükseklik r', 82.6], ['Dairenin alanı = π · r²', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A circle', nameTr: 'Bir daire', concept: 'How big is it?', conceptTr: 'Alanı ne kadar?', render });
})(window.LI = window.LI || {});
