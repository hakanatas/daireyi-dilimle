/* Shared layout + Nokta helpers for "Daireyi Dilimle". */
(function (LI) {
  'use strict';
  const { clamp } = LI.E;
  LI.KD = {
    /** positions for 16:9 and 9:16 */
    L(env) {
      return env.V
        ? {
          CX: { x: 0, y: -780, s: 42, w: 980 },
          G: { s: 40 }, ST: { x: 0, y: -560, c: 40 }, C: { x: 0, y: -560, R: 160 }, ROW: { x: 0, y: -360 }, RV: { rect: [-330, -590, 36], par: [60, -590, 36], circ: [0, -390, 50] }, TL: { x: 0, y: [-330, -275, -220], s: 38 }, PN: { x: 0, y0: -330, dy: 60 }, EX: { y: -600 }, NL: { x0: -400, x1: 400, y: -380 },
          W: { x: 0, y: [-110, -30, 50], s: 42, w: 980 },
          SUM: { x: 0, y: [-240, -150, -60, 40], s: 42, w: 980 },
          nx: -360, gy: 560, s: 1.15 }
        : {
          CX: { x: 60, y: -445, s: 48, w: 1300 },
          G: { s: 44 }, ST: { x: -380, y: -150, c: 40 }, C: { x: -380, y: -150, R: 150 }, ROW: { x: 330, y: -225 }, RV: { rect: [-640, -40, 44], par: [-240, -40, 44], circ: [360, -140, 60] }, TL: { x: 340, y: [-300, -230, -160], s: 44 }, PN: { x: 560, y0: -330, dy: 60 }, EX: { y: -290 }, NL: { x0: -220, x1: 640, y: -60 },
          W: { x: 110, y: [128, 196, 262], s: 46, w: 1250 },
          SUM: { x: 110, y: [10, 90, 170, 250], s: 48, w: 1250 },
          nx: -800, gy: 262, s: 1.15 };
    },
    cam(env, o = {}) { return Object.assign({ x: env.V ? 0 : -60, y: env.V ? 60 : 0, zoom: 1, rot: 0, tilt: 1 }, o); },
    /** pupils + face toward a world point */
    look(p, target) {
      const e = LI.Nokta.eyes(p)[0];
      const dx = target[0] - e[0], dy = target[1] - e[1], d = Math.hypot(dx, dy) || 1;
      p.lookX = clamp(dx / d * 1.1, -1, 1); p.lookY = clamp(dy / d * 1.1, -1, 1);
      p.turn = clamp(dx / 900, -0.5, 0.5);
      return p;
    },
    /** a short ground stroke under Nokta */
    ground(ctx, env, x, gy) { LI.Ambient.ground(ctx, x - 360, x + 360, gy + 6, { alpha: 0.32 }); },
  };
})(window.LI = window.LI || {});
