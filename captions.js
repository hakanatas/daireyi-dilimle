/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 7. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Dairenin alanı ne kadar?', en: 'How big is the circle?',
      note: 'Bu dairenin alanı ne kadar? Karelerle saymak zor, çünkü kenarı eğri. Bildiğimiz şekillerden yardım alalım.' },
    { scene: 2, start: 10.8, end: 18.2, tr: 'Dikdörtgen ve paralelkenar', en: 'Rectangle and parallelogram',
      note: 'Dikdörtgenin alanı a çarpı b. Paralelkenardan bir üçgen kesip öbür yana taşıyınca dikdörtgen olur: taban çarpı yükseklik.' },
    { scene: 2, start: 18.4, end: 27.8, tr: 'Çevre: 2 · π · r', en: 'Circumference: 2 · π · r',
      note: 'Çemberin uzunluğu 2 çarpı pi çarpı r. Şekli dikdörtgene dönüştürmek işe yaradı; daireyi de dönüştürebilir miyiz?' },
    { scene: 3, start: 28.8, end: 38.4, tr: 'Dilimle ve diz', en: 'Slice and line up',
      note: 'Daireyi 8 eş dilime keselim ve dilimleri bir yukarı, bir aşağı dizelim.' },
    { scene: 3, start: 38.6, end: 45.8, tr: 'Dilimler inceldikçe', en: 'As the slices get thinner',
      note: '16 dilim, sonra 32 dilim. Dilimler inceldikçe kenarlar düzleşiyor, şekil bir dikdörtgene benziyor.' },
    { scene: 4, start: 46.8, end: 54.8, tr: 'Taban π · r, yükseklik r', en: 'Base π · r, height r',
      note: 'Dikdörtgenin tabanı çemberin yarısı: pi çarpı r. Yüksekliği yarıçap: r. Alanı pi çarpı r çarpı r.' },
    { scene: 4, start: 55.0, end: 63.8, tr: 'Alan = π · r²', en: 'Area = π · r²',
      note: 'Dairenin alanı pi çarpı r kare.' },
    { scene: 5, start: 64.8, end: 72.8, tr: 'r = 10 cm: 314 cm²', en: 'r = 10 cm: 314 cm²',
      note: 'Yarıçapı 10 santimetre olan daire: 3,14 çarpı 100, 314 santimetrekare. Yarıçaplı karenin 3 katından biraz fazla.' },
    { scene: 5, start: 73.0, end: 79.8, tr: 'r = 5 cm: 78,5 cm²', en: 'r = 5 cm: 78.5 cm²',
      note: 'Yarıçap 5 santimetre olursa 3,14 çarpı 25, 78,5 santimetrekare. Bağıntı her dairede işliyor.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Dilimle, diz, dikdörtgen', en: 'Slice, line up, rectangle',
      note: 'Aklında kalsın: daireyi dilimleyip dizince tabanı pi r, yüksekliği r olan bir dikdörtgene benzer.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Alan = π · r²', en: 'Area = π · r²',
      note: 'Dairenin alanı pi çarpı r kare!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
