/* SAHNE 4 — DİKDÖRTGEN (46–64 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 4, start: 46, end: 64, name: "A rectangle", nameTr: "Dikdörtgen", concept: "πr · r = πr²", conceptTr: "πr · r = πr²", render });
})(window.LI = window.LI || {});
