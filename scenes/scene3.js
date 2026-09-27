/* SAHNE 3 — DİLİMLE (28–46 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 3, start: 28, end: 46, name: "Slice it", nameTr: "Dilimle", concept: "8, 16, 32 slices", conceptTr: "8, 16, 32 dilim", render });
})(window.LI = window.LI || {});
