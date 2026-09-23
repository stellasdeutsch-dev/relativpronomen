/* Relativpronomen · Stellas — interactions */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EASE = 'cubic-bezier(.2,.8,.2,1)';

  /* ============================================================
     Illustration kit — flat landscapes drawn in SVG
     ============================================================ */
  let gid = 0;
  const K = {
    sky(a, b, W, H) {
      const id = 'sky' + (++gid);
      return `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="${W}" height="${H}" fill="url(#${id})"/>`;
    },
    sun: (x, y, r, c = '#FFF4D2') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".95"/>`,
    cloud: (x, y, s = 1, dur = 18, dx = 24) =>
      `<g transform="translate(${x} ${y}) scale(${s})"><g fill="#fff"><ellipse cx="0" cy="0" rx="34" ry="12"/><circle cx="-12" cy="-8" r="13"/><circle cx="8" cy="-12" r="17"/><circle cx="24" cy="-3" r="10"/>${reduce ? '' : `<animateTransform attributeName="transform" type="translate" values="0 0;${dx} 0;0 0" dur="${dur}s" repeatCount="indefinite"/>`}</g></g>`,
    mount: (cx, base, h, w, cl, cr) =>
      `<path d="M${cx - w / 2} ${base}L${cx} ${base - h}L${cx + w / 2} ${base}Z" fill="${cl}"/><path d="M${cx} ${base - h}L${cx + w / 2} ${base}L${cx + w * 0.1} ${base}Z" fill="${cr}"/>`,
    hill: (W, H, y, a, c) =>
      `<path d="M0 ${y}C${W * 0.2} ${y - a} ${W * 0.4} ${y - a} ${W * 0.55} ${y - a * 0.3}S${W * 0.85} ${y + a * 0.4} ${W} ${y - a * 0.5}V${H}H0Z" fill="${c}"/>`,
    field(W, H, y, c, cr, n = 16) {
      let rows = '';
      for (let i = 0; i <= n; i++) {
        const k = i - n / 2;
        rows += `<path d="M${W / 2 + k * (W / n) * 0.3} ${y + 2}L${W / 2 + k * (W / n) * 1.5} ${H}" stroke="${cr}" stroke-width="3"/>`;
      }
      return `<path d="M0 ${y + 6}Q${W / 2} ${y - 10} ${W} ${y + 6}V${H}H0Z" fill="${c}"/><g>${rows}</g>`;
    },
    windmill(x, y, s = 1, dur = 6) {
      const blades = [0, 120, 240].map(a => `<g transform="rotate(${a})"><path d="M-2.2 0L-3.4 -30Q0 -37 3.4 -30L2.2 0Z" fill="#fff"/><circle cy="-31" r="2.3" fill="#F46907"/></g>`).join('');
      return `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-2.6 0L-1.3 -54H1.3L2.6 0Z" fill="#fff"/><g transform="translate(0 -54)"><g>${blades}${reduce ? '' : `<animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="${dur}s" repeatCount="indefinite"/>`}</g><circle r="3.6" fill="#F46907"/></g></g>`;
    },
    bush: (x, y, s = 1, c = '#2A5945', c2 = '#3E7A5B') =>
      `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-10" cy="0" r="10" fill="${c}"/><circle cx="4" cy="-6" r="13" fill="${c2}"/><circle cx="17" cy="1" r="9" fill="${c}"/></g>`,
    tree: (x, y, s = 1) =>
      `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-1.6" y="-10" width="3.2" height="12" fill="#6B4A2E"/><ellipse cx="0" cy="-23" rx="9" ry="17" fill="#2E6B4A"/><ellipse cx="-2.5" cy="-26" rx="4" ry="11" fill="#3E8A5E"/></g>`,
    barn: (x, y, s = 1) =>
      `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-32" y="-44" width="64" height="44" fill="#E0493B"/><rect x="-32" y="-44" width="10" height="44" fill="#C63D30"/><path d="M-38 -44L0 -74L38 -44Z" fill="#B8352B"/><rect x="-12" y="-28" width="24" height="28" fill="#fff"/><path d="M-12 -28L12 0M12 -28L-12 0" stroke="#E0493B" stroke-width="3"/><rect x="-7" y="-62" width="14" height="10" fill="#fff"/></g>`,
    greenhouse: (x, y, s = 1) =>
      `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-50 0V-40L-25 -62H25L50 -40V0Z" fill="#BDEBD5"/><path d="M-50 -40L-25 -62H25L50 -40Z" fill="#E1F8EC"/><circle cx="-30" cy="-8" r="8" fill="#5FAF5B"/><circle cx="-8" cy="-10" r="9" fill="#4E9A4E"/><circle cx="16" cy="-8" r="8" fill="#5FAF5B"/><circle cx="36" cy="-9" r="7" fill="#4E9A4E"/><path d="M-50 -40H50M-25 -62V0M0 -62V0M25 -62V0M-50 -20H50" stroke="#fff" stroke-width="2" fill="none" opacity=".9"/><path d="M-50 0V-40L-25 -62H25L50 -40V0" fill="none" stroke="#fff" stroke-width="3"/></g>`,
    lake: (W, y, c = '#7CC2F7') =>
      `<path d="M0 ${y}Q${W * 0.5} ${y - 10} ${W} ${y}V${y + 16}Q${W * 0.5} ${y + 8} 0 ${y + 16}Z" fill="${c}"/><path d="M${W * 0.2} ${y + 4}H${W * 0.32}M${W * 0.6} ${y + 6}H${W * 0.7}" stroke="#fff" stroke-width="2" opacity=".7" stroke-linecap="round"/>`,
    train(y, dur = 16) {
      const body = `<rect x="-14" y="-34" width="18" height="30" rx="4" fill="#D95A05"/><rect x="-10" y="-30" width="10" height="9" rx="2" fill="#FFF1DA"/><rect x="0" y="-25" width="46" height="21" rx="5" fill="#F46907"/><rect x="32" y="-35" width="6" height="11" fill="#333"/><rect x="52" y="-27" width="56" height="23" rx="5" fill="#4677FF"/><rect x="58" y="-22" width="14" height="9" rx="2" fill="#E7EFFF"/><rect x="78" y="-22" width="14" height="9" rx="2" fill="#E7EFFF"/><rect x="114" y="-27" width="56" height="23" rx="5" fill="#FBF1CC"/><rect x="120" y="-22" width="14" height="9" rx="2" fill="#fff"/><rect x="140" y="-22" width="14" height="9" rx="2" fill="#fff"/>${[-4, 20, 40, 64, 96, 126, 158].map(cx => `<circle cx="${cx}" cy="-3" r="4" fill="#1F2A24"/>`).join('')}`;
      return `<rect x="0" y="${y}" width="2000" height="3" fill="#7A6450"/><g transform="translate(-200 ${y})">${body}${reduce ? '' : `<animateTransform attributeName="transform" type="translate" values="-200 ${y};1000 ${y}" dur="${dur}s" repeatCount="indefinite"/>`}</g>`;
    },
    bars: (W, y, H) =>
      `<rect x="0" y="${y}" width="${W / 3 + 1}" height="${H - y}" fill="#2A5945"/><rect x="${W / 3}" y="${y}" width="${W / 3 + 1}" height="${H - y}" fill="#F46907"/><rect x="${(2 * W) / 3}" y="${y}" width="${W / 3}" height="${H - y}" fill="#4677FF"/>`
  };

  const svg = (W, H, inner, par = 'xMidYMax slice') =>
    `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="${par}" aria-hidden="true" focusable="false">${inner}</svg>`;

  const LANDS = {
    hero: () => svg(800, 340,
      K.cloud(110, 70, 1.2, 22, 30) + K.cloud(650, 52, 1.4, 26, -26) + K.cloud(430, 118, 0.8, 18, 20) +
      `<path d="M0 205L60 168L120 190L200 140L270 182L340 150L420 190L500 138L580 178L650 132L720 170L800 150V340H0Z" fill="#A9D6B6"/>` +
      K.mount(150, 252, 125, 230, '#4F9B6C', '#2E6A4E') + K.mount(275, 256, 85, 170, '#62AE7B', '#3B7F59') +
      K.mount(545, 252, 135, 250, '#4F9B6C', '#2E6A4E') + K.mount(682, 258, 92, 190, '#62AE7B', '#3B7F59') +
      K.windmill(88, 246, 1.15, 7) + K.windmill(128, 252, 0.85, 5.5) + K.windmill(650, 248, 1.1, 6.5) + K.windmill(714, 254, 0.8, 5) +
      `<path d="M0 262C120 236 230 250 330 262S560 240 800 256V340H0Z" fill="#7DB46C"/>` +
      K.train(283, 17) +
      K.field(800, 340, 290, '#F2C94C', '#E3B23C', 22) +
      `<path d="M0 300Q90 282 190 312T300 340H0Z" fill="#5E9E58"/><path d="M800 300Q705 284 612 314T520 340H800Z" fill="#5E9E58"/>` +
      K.tree(30, 300, 1.3) + K.tree(54, 305, 1.05) + K.tree(772, 298, 1.3) + K.tree(748, 305, 1) +
      K.bush(232, 322, 1.4) + K.bush(588, 326, 1.5)),

    banner: () => svg(400, 240,
      K.sky('#4A82FF', '#BFE0FF', 400, 240) + K.sun(312, 72, 38, '#FFF1C9') + K.cloud(90, 60, 0.9, 14, 16) +
      K.mount(120, 172, 92, 210, '#4F9B6C', '#2E6A4E') + K.mount(292, 178, 112, 240, '#62AE7B', '#3B7F59') +
      K.windmill(58, 176, 0.9, 5) + K.hill(400, 240, 182, 18, '#7DB46C') +
      K.field(400, 240, 208, '#F2C94C', '#E3B23C', 12) + K.barn(334, 212, 0.62) + K.bush(36, 226, 1), 'xMidYMid slice'),

    train: () => svg(400, 250,
      K.sky('#BADCFF', '#EEF7FF', 400, 250) + K.sun(330, 60, 30) + K.cloud(80, 50, 0.9, 16, 18) + K.cloud(250, 36, 0.7, 20, -14) +
      `<path d="M0 170L50 140L100 158L160 118L220 160L280 128L340 156L400 136V250H0Z" fill="#BFE3C8"/>` +
      K.mount(90, 215, 95, 200, '#4F9B6C', '#2E6A4E') + K.mount(330, 218, 110, 220, '#62AE7B', '#3B7F59') +
      K.windmill(212, 214, 0.8, 6) +
      `<path d="M0 214C100 198 200 206 300 214S380 208 400 210V250H0Z" fill="#8CC47A"/><rect y="231" width="400" height="19" fill="#6FAE5E"/>` +
      K.tree(18, 226, 0.9) + K.tree(386, 226, 0.9), 'xMidYMax slice'),

    f1: () => svg(400, 240,
      K.sky('#6FA2FF', '#D6ECFF', 400, 240) + K.sun(78, 62, 26, '#FFF6DA') + K.cloud(300, 52, 0.9, 16, -18) +
      K.mount(270, 192, 122, 260, '#4F9B6C', '#2E6A4E') + K.mount(108, 196, 82, 200, '#62AE7B', '#3B7F59') +
      K.windmill(362, 194, 0.9, 6) + K.hill(400, 240, 198, 16, '#7DB46C') +
      K.field(400, 240, 214, '#9BD16E', '#84BD58', 14) + K.tree(20, 222, 1) + K.tree(40, 226, 0.8), 'xMidYMid slice'),

    f2: () => svg(400, 240,
      K.sky('#FF9448', '#FFE0B0', 400, 240) + K.sun(200, 128, 54, '#FFF0C8') + K.cloud(70, 50, 0.8, 18, 14) +
      K.mount(92, 198, 112, 232, '#3E7A5B', '#2A5945') + K.mount(312, 200, 132, 262, '#4E8C66', '#2A5945') +
      K.hill(400, 240, 200, 14, '#6FA75E') + K.field(400, 240, 214, '#F2C94C', '#E3B23C', 14) +
      K.bush(360, 232, 1), 'xMidYMid slice'),

    f3: () => svg(400, 240,
      K.sky('#4F86FF', '#C7E4FF', 400, 240) + K.cloud(310, 48, 1, 18, -16) + K.cloud(70, 70, 0.7, 14, 12) +
      K.mount(200, 182, 104, 300, '#4F9B6C', '#2E6A4E') + K.lake(400, 184) +
      K.hill(400, 240, 204, 12, '#7DB46C') + K.field(400, 240, 216, '#F2C94C', '#E3B23C', 14) +
      K.tree(22, 222, 1.1) + K.tree(380, 222, 1.1), 'xMidYMid slice'),

    post: () => svg(400, 260,
      K.sky('#5D93FF', '#CDE8FF', 400, 260) + K.sun(90, 70, 30, '#FFF3D3') + K.cloud(300, 58, 1, 20, -18) +
      K.mount(150, 196, 110, 250, '#4F9B6C', '#2E6A4E') + K.mount(310, 200, 90, 200, '#62AE7B', '#3B7F59') +
      K.windmill(36, 202, 0.8, 6) + K.lake(400, 198) + K.hill(400, 260, 220, 14, '#7DB46C') +
      K.field(400, 260, 232, '#F2C94C', '#E3B23C', 14) + K.barn(330, 236, 0.6) + K.tree(20, 244, 1), 'xMidYMid slice'),

    hub: () => svg(800, 220,
      `<path d="M0 110L70 80L140 100L230 64L320 102L410 70L500 104L580 66L670 100L740 78L800 92V220H0Z" fill="#9ECF9A"/>` +
      K.windmill(70, 132, 1, 6) + K.windmill(110, 138, 0.75, 5) +
      `<path d="M0 140C160 112 320 126 460 138S680 120 800 132V220H0Z" fill="#7DB46C"/>` +
      K.greenhouse(200, 178, 1) + K.barn(640, 180, 1) +
      K.field(800, 220, 184, '#F2C94C', '#E3B23C', 22) +
      K.tree(30, 200, 1.3) + K.tree(770, 200, 1.3) + K.bush(440, 210, 1.5) + K.bush(330, 214, 1.1), 'xMidYMax slice'),

    cheat: () => svg(800, 200,
      K.cloud(160, 60, 1.1, 22, 20) + K.cloud(640, 40, 0.9, 20, -18) +
      K.mount(230, 172, 70, 220, '#6FAE63', '#4A8A48') + K.mount(400, 172, 150, 460, '#5E9E58', '#3E7A45') +
      K.mount(600, 172, 90, 280, '#4E8C4A', '#2F6B3A') + K.bars(800, 170, 200), 'xMidYMax slice'),

    dl: () => svg(800, 300,
      `<path d="M0 150L80 110L160 140L240 96L330 138L420 104L520 146L600 100L700 136L800 112V300H0Z" fill="#B7DEC0"/>` +
      K.mount(640, 206, 124, 280, '#4F9B6C', '#2E6A4E') + K.mount(120, 210, 80, 220, '#62AE7B', '#3B7F59') +
      `<path d="M0 214C140 190 300 204 420 214S660 196 800 206V300H0Z" fill="#7DB46C"/>` +
      K.greenhouse(160, 252, 1.3) + K.field(800, 300, 256, '#F2C94C', '#E3B23C', 22) +
      K.bush(300, 278, 1.3) + K.bush(720, 282, 1.4) + K.tree(40, 262, 1.2) + K.tree(64, 268, 1), 'xMidYMax slice'),

    final: () => svg(800, 330,
      K.cloud(120, 60, 1.1, 22, 24) + K.cloud(560, 40, 1.2, 24, -20) +
      `<path d="M0 170L90 130L180 160L270 118L360 154L460 120L560 158L650 124L740 150L800 136V330H0Z" fill="#A9D6B6"/>` +
      K.windmill(80, 206, 1.1, 6.5) + K.windmill(124, 212, 0.8, 5) +
      `<path d="M0 214C150 190 300 200 440 212S660 196 800 206V330H0Z" fill="#8CC47A"/>` +
      `<path d="M250 330Q330 270 400 246T520 218" stroke="#F6D38C" stroke-width="30" fill="none" stroke-linecap="round"/>` +
      K.barn(470, 232, 1.5) + K.field(800, 330, 280, '#F2C94C', '#E3B23C', 22) +
      K.tree(28, 250, 1.3) + K.tree(52, 256, 1) + K.bush(640, 300, 1.4) + K.bush(170, 300, 1.2), 'xMidYMax slice'),

    pf: () => svg(300, 250,
      K.cloud(70, 40, 0.8, 14, 14) + K.cloud(240, 26, 0.6, 16, -10) +
      K.mount(80, 150, 72, 170, '#62AE7B', '#3B7F59') + K.mount(220, 156, 92, 210, '#4F9B6C', '#2E6A4E') +
      K.windmill(34, 152, 0.7, 5) + K.hill(300, 250, 156, 12, '#7DB46C') +
      K.greenhouse(170, 196, 0.8) + K.field(300, 250, 200, '#F2C94C', '#E3B23C', 10) + K.tree(270, 206, 0.9), 'xMidYMax slice')
  };

  $$('[data-land]').forEach(el => {
    const f = LANDS[el.dataset.land];
    if (f) el.insertAdjacentHTML('afterbegin', f());
  });

  /* ============================================================
     Reveal on scroll
     ============================================================ */
  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  $$('.rv').forEach(el => revealIO.observe(el));

  /* ============================================================
     Speech (German TTS)
     ============================================================ */
  let voices = [];
  const loadVoices = () => { voices = window.speechSynthesis ? speechSynthesis.getVoices() : []; };
  if (window.speechSynthesis) { loadVoices(); speechSynthesis.addEventListener?.('voiceschanged', loadVoices); }
  const strip = h => h.replace(/<[^>]+>/g, '');
  function say(text, btn) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(strip(text));
    u.lang = 'de-DE';
    u.rate = 0.9;
    const v = voices.find(v => /^de(-|_|$)/i.test(v.lang));
    if (v) u.voice = v;
    if (btn) {
      btn.classList.add('speaking');
      u.onend = u.onerror = () => btn.classList.remove('speaking');
    }
    speechSynthesis.speak(u);
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-say]');
    if (b) say(b.dataset.say, b);
  });

  /* ============================================================
     Sequencer — shared controls, captions, autoplay on view
     ============================================================ */
  const ICON = {
    prev: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>',
    pause: '<svg viewBox="0 0 24 24"><path d="M8 5v14M16 5v14" stroke-width="3"/></svg>',
    replay: '<svg viewBox="0 0 24 24" style="fill:none"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>'
  };

  class Seq {
    constructor(root, { n, caps, render, interval = 2800, startDelay = 500 }) {
      Object.assign(this, { root, n, caps, render, interval });
      this.i = 0;
      this.timer = null;
      this.cap = $('.seq-cap', root);
      const ctrl = $('.seq-ctrl', root);
      ctrl.innerHTML = `
        <button class="seq-btn" data-a="prev" aria-label="Назад">${ICON.prev}</button>
        <button class="seq-btn play" data-a="play" aria-label="Проиграть">${ICON.play}</button>
        <button class="seq-btn" data-a="next" aria-label="Дальше">${ICON.next}</button>
        <span class="seq-dots">${Array.from({ length: n }, () => '<i></i>').join('')}</span>
        <span class="seq-count"></span>`;
      this.playBtn = $('[data-a="play"]', ctrl);
      this.dots = $$('.seq-dots i', ctrl);
      this.count = $('.seq-count', ctrl);
      ctrl.addEventListener('click', e => {
        const a = e.target.closest('[data-a]')?.dataset.a;
        if (!a) return;
        if (a === 'prev') { this.stop(); this.go(Math.max(0, this.i - 1)); }
        if (a === 'next') { this.stop(); this.go(Math.min(n - 1, this.i + 1)); }
        if (a === 'play') this.timer ? this.stop() : this.play();
      });
      this.go(0, false);
      const io = new IntersectionObserver(es => {
        if (es[0].isIntersecting) {
          io.disconnect();
          if (reduce) return;
          setTimeout(() => this.play(true), startDelay);
        }
      }, { threshold: 0.45 });
      io.observe(root);
    }
    go(i, anim = true) {
      this.i = i;
      this.render(i, anim && !reduce);
      this.cap.innerHTML = this.caps[i];
      if (anim && !reduce) this.cap.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 450, easing: EASE });
      this.dots.forEach((d, k) => d.classList.toggle('on', k === i));
      this.count.textContent = `${i + 1}/${this.n}`;
      this.syncBtn();
    }
    syncBtn() {
      const atEnd = this.i === this.n - 1 && !this.timer;
      this.playBtn.innerHTML = this.timer ? ICON.pause : atEnd ? ICON.replay : ICON.play;
      this.playBtn.setAttribute('aria-label', this.timer ? 'Пауза' : atEnd ? 'Сначала' : 'Проиграть');
    }
    play(fromView = false) {
      if (this.i === this.n - 1) this.go(0);
      this.timer = setInterval(() => {
        if (this.i >= this.n - 1) return this.stop();
        this.go(this.i + 1);
        if (this.i >= this.n - 1) this.stop();
      }, this.interval);
      this.syncBtn();
    }
    stop() { clearInterval(this.timer); this.timer = null; this.syncBtn(); }
  }

  /* ---------- word-token stepper with FLIP ---------- */
  const tokHTML = s => {
    const [t, k, c = ''] = s.split('|');
    return `<span class="tok ${c}" data-k="${k}"><span class="tx">${t}</span></span>`;
  };

  function flipRender(stage, ruEl, steps) {
    return (i, anim) => {
      const st = steps[i];
      const sr = stage.getBoundingClientRect();
      const old = new Map();
      if (anim) $$('.tok', stage).forEach(t => old.set(t.dataset.k, { r: t.getBoundingClientRect(), txt: t.textContent, el: t }));
      stage.innerHTML = st.l.map(line => `<div class="st-line">${line.map(tokHTML).join('')}</div>`).join('');
      if (ruEl.textContent !== st.ru) {
        ruEl.textContent = st.ru;
        if (anim) ruEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 600, easing: EASE });
      }
      if (!anim) return;
      const seen = new Set();
      $$('.tok', stage).forEach(t => {
        const k = t.dataset.k;
        seen.add(k);
        const o = old.get(k);
        const r = t.getBoundingClientRect();
        if (o) {
          const dx = o.r.left - r.left, dy = o.r.top - r.top;
          if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
            t.animate([{ transform: `translate(${dx}px,${dy}px)` }, { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 16}px)`, offset: 0.5 }, { transform: 'none' }], { duration: 900, easing: EASE });
          }
          if (o.txt !== t.textContent) {
            $('.tx', t).animate([{ transform: 'rotateX(90deg)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 500, delay: 150, easing: EASE, fill: 'backwards' });
            t.animate([{ transform: 'scale(1.18)' }, { transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.34,1.56,.64,1)', composite: 'add' });
          }
        } else {
          t.animate([{ opacity: 0, transform: 'translateY(-16px) scale(.5)' }, { opacity: 1, transform: 'none' }], { duration: 550, delay: 380, easing: 'cubic-bezier(.34,1.56,.64,1)', fill: 'backwards' });
        }
      });
      old.forEach((o, k) => {
        if (seen.has(k)) return;
        const g = o.el;
        g.classList.add('ghost');
        g.style.left = `${o.r.left - sr.left}px`;
        g.style.top = `${o.r.top - sr.top}px`;
        stage.appendChild(g);
        g.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(10px) scale(.4)' }], { duration: 420, easing: EASE, fill: 'forwards' }).onfinish = () => g.remove();
      });
    };
  }

  const OLGA_RU1 = 'Моей коллеге тридцать лет. Её зовут Ольга.';
  const OLGA = [
    { l: [['Meine|m1', 'Kollegin|kol|n', 'ist|ist', 'dreißig|d30', 'Jahre|j', 'alt.|alt'], ['Sie|sie', 'heißt|hei', 'Olga|olga', '.|dot|c']], ru: OLGA_RU1 },
    { l: [['Meine|m1', 'Kollegin|kol|n hl', 'ist|ist', 'dreißig|d30', 'Jahre|j', 'alt.|alt'], ['Sie|sie|hl', 'heißt|hei', 'Olga|olga', '.|dot|c']], ru: OLGA_RU1 },
    { l: [['Meine|m1', 'Kollegin|kol|n', 'ist|ist', 'dreißig|d30', 'Jahre|j', 'alt.|alt'], ['die|sie|p', 'heißt|hei', 'Olga|olga', '.|dot|c']], ru: OLGA_RU1 },
    { l: [['Meine|m1', 'Kollegin|kol|n', 'ist|ist', 'dreißig|d30', 'Jahre|j', 'alt.|alt'], ['die|sie|p', 'Olga|olga', 'heißt|hei|v', '.|dot|c']], ru: OLGA_RU1 },
    { l: [['Meine|m1', 'Kollegin|kol|n', ',|c1|c', 'die|sie|p', 'Olga|olga', 'heißt|hei|v', ',|c2|c', 'ist|ist', 'dreißig|d30', 'Jahre|j', 'alt.|alt']], ru: 'Моей коллеге, которую зовут Ольга, тридцать лет.' }
  ];
  const OLGA_CAPS = [
    '<b>Шаг 1.</b> Два предложения про одного человека. Звучит как телеграмма.',
    '<b>Шаг 2.</b> Kollegin и Sie это один и тот же человек. Повтор. Его и уберём.',
    '<b>Шаг 3.</b> Sie меняем на <b>die</b>. Почему die? Kollegin женского рода. Род берём у папы.',
    '<b>Шаг 4.</b> Глагол уезжает в самый конец. В придаточном он всегда в хвосте.',
    '<b>Шаг 5.</b> Вставляем вагон сразу после Kollegin. Запятые с двух сторон. Готово.'
  ];

  const G_RU1 = 'Скоро приедут гости. Мы ждём их на вокзале.';
  const GAESTE = [
    { l: [['Bald|bald', 'kommen|kom', 'die|dg', 'Gäste|g|n', '.|d1|c'], ['Wir|wir', 'warten|wa', 'auf|auf', 'sie|sie', 'am|am', 'Bahnhof|bhf', '.|d2|c']], ru: G_RU1 },
    { l: [['Bald|bald', 'kommen|kom', 'die|dg', 'Gäste|g|n', '.|d1|c'], ['Wir|wir', 'warten|wa|v', 'auf|auf|pr hl', 'sie|sie', 'am|am', 'Bahnhof|bhf', '.|d2|c']], ru: G_RU1 },
    { l: [['Bald|bald', 'kommen|kom', 'die|dg', 'Gäste|g|n', '.|d1|c'], ['Wir|wir', 'warten|wa|v', 'auf|auf|pr', 'die|sie|p', 'am|am', 'Bahnhof|bhf', '.|d2|c']], ru: G_RU1 },
    { l: [['Bald|bald', 'kommen|kom', 'die|dg', 'Gäste|g|n', '.|d1|c'], ['auf|auf|pr', 'die|sie|p', 'wir|wir', 'am|am', 'Bahnhof|bhf', 'warten|wa|v', '.|d2|c']], ru: G_RU1 },
    { l: [['Bald|bald', 'kommen|kom', 'die|dg', 'Gäste|g|n', ',|c1|c', 'auf|auf|pr', 'die|sie|p', 'wir|wir', 'am|am', 'Bahnhof|bhf', 'warten|wa|v', '.|d2|c']], ru: 'Скоро приедут гости, которых мы ждём на вокзале.' }
  ];
  const GAESTE_CAPS = [
    '<b>Шаг 1.</b> Два предложения. Gäste и sie это одни и те же люди.',
    '<b>Шаг 2.</b> У глагола есть хвостик: <b>warten auf</b>. Запомни этот auf. Сейчас он поедет.',
    '<b>Шаг 3.</b> sie → <b>die</b>. Gäste это множественное число. Падеж Akkusativ, потому что warten auf + Akk.',
    '<b>Шаг 4.</b> auf прыгает вперёд вместе с die. Они неразлучны. А warten уходит в хвост.',
    '<b>Шаг 5.</b> Склеили. Предлог стоит перед местоимением. Никогда после.'
  ];

  [['olga', OLGA, OLGA_CAPS], ['gaeste', GAESTE, GAESTE_CAPS]].forEach(([name, steps, caps]) => {
    const root = $(`[data-seq="${name}"]`);
    if (!root) return;
    new Seq(root, { n: steps.length, caps, render: flipRender($('.st-stage', root), $('.st-ru', root), steps), interval: 2900 });
  });

  /* ---------- train ---------- */
  const trainRoot = $('[data-seq="train"]');
  if (trainRoot) {
    const scene = $('.train-scene', trainRoot);
    new Seq(trainRoot, {
      n: 4,
      interval: 2600,
      startDelay: 1500,
      caps: [
        '<b>Главное предложение</b> это локомотив. Он тянет смысл: <i lang="de">Meine Kollegin ist dreißig.</i>',
        '<b>Придаточное</b> это вагон. Сам по себе он никуда не поедет.',
        '<b>Relativpronomen</b> это сцепка. Здесь <b>die</b>, потому что Kollegin женского рода.',
        'А <b>глагол</b> всегда едет в последнем купе. <i lang="de">…, die Olga heißt.</i> Всегда.'
      ],
      render(i) {
        for (let k = 1; k <= 3; k++) scene.classList.toggle('s' + k, i >= k);
        if (i === 3) {
          // restart the hop animation when re-entering the last step
          const v = $('.t-verb', scene);
          v.style.animation = 'none'; void v.getBoundingClientRect(); v.style.animation = '';
        }
      }
    });
  }

  /* ============================================================
     Declension table + morph + 3-step finder
     ============================================================ */
  const COLS = [['m', 'hm'], ['f', 'hf'], ['n', 'hn'], ['Pl', 'hp']];
  const ROWS = [
    ['Nom', ['der', 'die', 'das', 'die'], ['der', 'die', 'das', 'die']],
    ['Akk', ['den', 'die', 'das', 'die'], ['den', 'die', 'das', 'die']],
    ['Dat', ['dem', 'der', 'dem', 'den'], ['dem', 'der', 'dem', 'denen']],
    ['Gen', ['des', 'der', 'des', 'der'], ['dessen', 'deren', 'dessen', 'deren']]
  ];
  const rtable = $('#rtable');
  if (rtable) {
    let html = '<span class="h"></span>' + COLS.map(([c, cls], ci) => `<span class="h ${cls}" data-col="${ci}">${c}</span>`).join('');
    let m = 0;
    ROWS.forEach(([name, a, r], ri) => {
      html += `<span class="h rh" data-row="${ri}">${name}</span>`;
      a.forEach((art, ci) => {
        const mut = art !== r[ci];
        html += `<span class="cell${mut ? ' mut' : ''}" data-row="${ri}" data-col="${ci}" style="--i:${mut ? (m++) * 0.12 : 0}s" aria-label="${name} ${COLS[ci][0]}"><span class="a">${art}</span><span class="r">${r[ci]}</span></span>`;
      });
    });
    rtable.innerHTML = html;
  }
  const morphTabs = $('[data-morph]');
  let userTouchedMorph = false;
  function setMode(mode) {
    rtable.classList.toggle('rel', mode === 'rel');
    $$('button', morphTabs).forEach(b => {
      const on = b.dataset.mode === mode;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', on);
    });
  }
  morphTabs?.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    userTouchedMorph = true;
    setMode(b.dataset.mode);
  });
  if (rtable) {
    const io = new IntersectionObserver(es => {
      if (!es[0].isIntersecting) return;
      io.disconnect();
      setTimeout(() => { if (!userTouchedMorph) setMode('rel'); }, reduce ? 0 : 1300);
    }, { threshold: 0.6 });
    io.observe(rtable);
  }

  const finder = $('[data-seq="finder"]');
  if (finder && rtable) {
    const blank = $('#finder-blank');
    new Seq(finder, {
      n: 3,
      interval: 2800,
      startDelay: 900,
      caps: [
        '<b>Шаг 1.</b> К кому цепляемся? К <b>die Frau</b>. Женский род. Смотрим столбец <b>f</b>.',
        '<b>Шаг 2.</b> Какая работа? <i lang="de">ich habe ihr geholfen</i>. helfen требует Dativ. Строка <b>Dat</b>.',
        '<b>Шаг 3.</b> На пересечении <b>der</b>. Да, der для женщины. Немецкий любит троллить.'
      ],
      render(i, anim) {
        if (!anim && i === 0 && !finder.dataset.started) return; // don't spoil the morph before the finder is on screen
        finder.dataset.started = '1';
        setMode('rel');
        $$('.hl-col,.hl-row,.hit', rtable).forEach(el => el.classList.remove('hl-col', 'hl-row', 'hit'));
        $$('[data-col="1"]', rtable).forEach(el => el.classList.add('hl-col'));
        if (i >= 1) $$('[data-row="2"]', rtable).forEach(el => el.classList.add('hl-row'));
        if (i === 2) {
          $('.cell[data-row="2"][data-col="1"]', rtable).classList.add('hit');
          blank.textContent = 'der';
          blank.classList.add('filled');
        } else {
          blank.textContent = '___';
          blank.classList.remove('filled');
        }
      }
    });
  }

  /* ============================================================
     Constructor
     ============================================================ */
  const NOUN = {
    m: { de: 'Der Mann', main: 'ist mein Nachbar', g: 'maskulin', ru: 'Мужчина', ruMain: '— мой сосед', i: 0 },
    f: { de: 'Die Frau', main: 'ist meine Nachbarin', g: 'feminin', ru: 'Женщина', ruMain: '— моя соседка', i: 1 },
    n: { de: 'Das Kind', main: 'wohnt nebenan', g: 'neutral', ru: 'Ребёнок', ruMain: 'живёт по соседству', i: 2 },
    pl: { de: 'Die Leute', main: 'sind meine Nachbarn', g: 'Plural', ru: 'Люди', ruMain: '— мои соседи', i: 3 }
  };
  const CASE = {
    nom: { k: 'Nominativ', p: ['der', 'die', 'das', 'die'], de: (p, pl) => `<b>${p}</b> so laut ${pl ? 'singen' : 'singt'}`, ru: ['который', 'которая', 'который', 'которые'], tail: pl => pl ? 'так громко поют' : 'так громко поёт', why: 'Кто поёт? Он сам. Значит Nominativ.' },
    akk: { k: 'Akkusativ', p: ['den', 'die', 'das', 'die'], de: p => `<b>${p}</b> ich gestern getroffen habe`, ru: ['которого', 'которую', 'которого', 'которых'], tail: () => 'я вчера встретил', why: 'Кого я встретил? treffen + Akkusativ.' },
    dat: { k: 'Dativ', p: ['dem', 'der', 'dem', 'denen'], de: p => `<b>${p}</b> ich geholfen habe`, ru: ['которому', 'которой', 'которому', 'которым'], tail: () => 'я помог', why: 'Кому я помог? helfen всегда с Dativ.' },
    gen: { k: 'Genitiv', p: ['dessen', 'deren', 'dessen', 'deren'], de: p => `<b>${p}</b> Hund immer bellt`, ru: ['чья', 'чья', 'чья', 'чья'], tail: () => 'собака вечно лает', why: 'Чья собака? Genitiv. После dessen/deren существительное без артикля.' }
  };
  const cb = { n: 'm', c: 'nom' };
  const cbPron = $('#cb-pron');
  function renderCB(bump = true) {
    const N = NOUN[cb.n], C = CASE[cb.c], pl = cb.n === 'pl';
    const p = C.p[N.i];
    cbPron.textContent = p;
    if (bump && !reduce) { cbPron.classList.remove('bump'); void cbPron.offsetWidth; cbPron.classList.add('bump'); }
    $('#cb-g').textContent = N.g;
    $('#cb-k').textContent = C.k;
    $('#cb-why').textContent = C.why;
    const de = `${N.de}, ${C.de(p, pl)}, ${N.main}.`;
    $('#cb-de').innerHTML = de;
    $('#cb-ru').textContent = `${N.ru}, ${C.ru[N.i]} ${C.tail(pl)}, ${N.ruMain}.`;
    $('#cb-say').dataset.say = strip(de);
    $$('#cb-noun button').forEach(b => b.classList.toggle('on', b.dataset.n === cb.n));
    $$('#cb-case button').forEach(b => b.classList.toggle('on', b.dataset.c === cb.c));
    $$('.case-card').forEach(b => b.classList.toggle('on', b.dataset.case === cb.c));
  }
  if (cbPron) {
    $('#cb-noun').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { cb.n = b.dataset.n; renderCB(); } });
    $('#cb-case').addEventListener('click', e => { const b = e.target.closest('button'); if (b) { cb.c = b.dataset.c; renderCB(); } });
    $$('.case-card').forEach(b => b.addEventListener('click', () => { cb.c = b.dataset.case; renderCB(); }));
    renderCB(false);
  }

  /* ============================================================
     Blog-style tabs: wer / was / dessen / welcher
     ============================================================ */
  const POSTS = {
    wer: {
      title: 'wer это «тот, кто»', lvl: 'B1',
      text: 'Нет конкретного существительного? Говоришь про любого человека вообще? Бери wer. Никакого рода, никакого числа. Почти всегда живёт в пословицах.',
      ex: [['Wer A sagt, muss auch B sagen.', 'Сказал А, говори и Б.'], ['Wer zuletzt lacht, lacht am besten.', 'Хорошо смеётся тот, кто смеётся последним.'], ['Wer anderen eine Grube gräbt, fällt selbst hinein.', 'Не рой другому яму, сам в неё попадёшь.']]
    },
    was: {
      title: 'was это «то, что»', lvl: 'B1',
      text: 'Для вещей, идей и всего абстрактного. Особенно после alles, nichts, etwas, das и превосходной степени. Тут der, die, das не работают.',
      ex: [['Erzähl mal, was du gemacht hast.', 'Расскажи-ка, что ты сделал.'], ['Alles, was du sagst, stimmt.', 'Всё, что ты говоришь, правда.'], ['Das ist das Beste, was mir passiert ist.', 'Это лучшее, что со мной случалось.']]
    },
    dessen: {
      title: 'dessen и deren это «чей»', lvl: 'B1–B2',
      text: 'Genitiv. Показываешь, кому что принадлежит. Мужской и средний род → dessen. Женский и множественное → deren. После них существительное идёт без артикля.',
      ex: [['Der Mann, dessen Auto vor der Tür steht, ist mein Chef.', 'Мужчина, чья машина стоит у двери, мой начальник.'], ['Die Frau, deren Sohn hier studiert, kommt aus Graz.', 'Женщина, чей сын здесь учится, из Граца.']]
    },
    welcher: {
      title: 'welcher это der в пиджаке', lvl: 'B2',
      text: 'Грамматически der можно заменить на welcher. Но звучит как канцелярия XIX века. В жизни почти не услышишь, в официальных текстах иногда. Genitiv у него нет, там всё равно dessen и deren.',
      ex: [['Sie geht in die Schule, die (welche) neben der Bibliothek liegt.', 'Она ходит в школу, которая возле библиотеки.'], ['Das ist die Zeitung, die (welche) wir schon gelesen haben.', 'Это газета, которую мы уже прочитали.']]
    }
  };
  const postBody = $('.post-body');
  function renderPost(key, anim) {
    const P = POSTS[key];
    const apply = () => {
      $('#post-title').textContent = P.title;
      $('#post-text').textContent = P.text;
      $('#post-lvl').textContent = P.lvl;
      $('#post-ex').innerHTML = P.ex.map(([de, ru]) => `<li><b lang="de">${de}</b><small>${ru}</small><button class="say" type="button" data-say="${de.replace(/\s*\(welche\)/, '')}" aria-label="Послушать"></button></li>`).join('');
      $('#post-say').dataset.say = P.ex[0][0].replace(/\s*\(welche\)/, '');
      const w = $('#post-word');
      w.textContent = key === 'dessen' ? 'dessen' : key;
      if (anim) { w.classList.remove('swap'); void w.offsetWidth; w.classList.add('swap'); }
      postBody.classList.remove('fade');
    };
    if (anim && !reduce) { postBody.classList.add('fade'); setTimeout(apply, 250); } else apply();
  }
  const blogTabs = $('#blog-tabs');
  if (blogTabs) {
    blogTabs.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || b.classList.contains('on')) return;
      $$('button', blogTabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      renderPost(b.dataset.t, true);
    });
    $('#post-say').addEventListener('click', e => say(e.currentTarget.dataset.say, e.currentTarget));
    renderPost('wer', false);
  }

  /* ============================================================
     FAQ: keep one open per list
     ============================================================ */
  $$('.faq').forEach(list => {
    list.addEventListener('toggle', e => {
      if (e.target.open) $$('details', list).forEach(d => { if (d !== e.target) d.open = false; });
    }, true);
  });

  /* ============================================================
     Quiz
     ============================================================ */
  const QUIZ = [
    { s: 'Das ist der Mann, ___ ich gestern gesehen habe.', o: ['der', 'den', 'dem', 'dessen'], a: 1, e: 'Mann мужского рода. sehen кого? Akkusativ. Мужской + Akk = den.' },
    { s: 'Die Frau, ___ ich geholfen habe, ist Ärztin.', o: ['die', 'der', 'deren', 'den'], a: 1, e: 'helfen всегда с Dativ. Женский + Dativ = der. Да, опять этот тролль.' },
    { s: 'Das Buch, ___ auf dem Tisch liegt, ist neu.', o: ['das', 'dem', 'was', 'dessen'], a: 0, e: 'Buch среднего рода. Кто лежит? Само Buch. Nominativ = das.' },
    { s: 'Die Leute, mit ___ ich arbeite, sind nett.', o: ['die', 'den', 'denen', 'deren'], a: 2, e: 'mit требует Dativ. Множественное + Dativ = мутант denen.' },
    { s: 'Das Kind, ___ Ball rot ist, weint.', o: ['das', 'dem', 'dessen', 'deren'], a: 2, e: 'Чей мяч? Genitiv. Средний род → dessen.' },
    { s: 'Alles, ___ du sagst, stimmt.', o: ['das', 'was', 'der', 'welches'], a: 1, e: 'После alles всегда was. Без вариантов.' },
    { s: '___ zuletzt lacht, lacht am besten.', o: ['Der', 'Wer', 'Was', 'Den'], a: 1, e: 'Нет конкретного человека. «Тот, кто» → wer.' },
    { s: 'Die Stadt, in ___ ich wohne, ist klein.', o: ['die', 'der', 'dem', 'denen'], a: 1, e: 'wohnen in + Dativ (где?). Stadt женского рода. Женский + Dativ = der.' }
  ];
  const quizEl = $('#quiz');
  const qs = { i: 0, score: 0 };
  function renderQuiz() {
    const n = QUIZ.length;
    if (qs.i >= n) {
      const s = qs.score;
      const msg = s === n ? 'Идеально. Можешь склеивать предложения с закрытыми глазами.' : s >= 5 ? 'Хорошо. Пара мутантов ещё кусается. Загляни в таблицу.' : 'Ничего страшного. Пролистай наверх ещё раз, потом вернись.';
      if (s >= 6) setTimeout(() => document.dispatchEvent(new CustomEvent('wow:confetti', { detail: { el: $('.q-score', quizEl), n: 160 } })), 250);
      quizEl.innerHTML = `<div class="q-end"><span class="badge">Результат</span><div class="q-score">${s}/${n}</div><p>${msg}</p><button class="btn" type="button" id="q-again">Пройти ещё раз</button><a class="link-more" href="#platform" style="font-size:14px;color:var(--blue-deep);font-weight:600;text-decoration:none">Больше таких тренажёров на платформе →</a></div>`;
      $('#q-again').onclick = () => { qs.i = 0; qs.score = 0; renderQuiz(); };
      return;
    }
    const q = QUIZ[qs.i];
    quizEl.innerHTML = `
      <div class="q-top"><span>Вопрос ${qs.i + 1} из ${n}</span><span>✓ ${qs.score}</span></div>
      <div class="q-prog"><i style="width:${(qs.i / n) * 100}%"></i></div>
      <p class="q-sent" lang="de">${q.s.replace('___', '<span class="blank">___</span>')}</p>
      <div class="q-opts" lang="de">${q.o.map((o, k) => `<button class="q-opt" type="button" data-k="${k}">${o}</button>`).join('')}</div>
      <div class="q-fb" aria-live="polite"></div>`;
    $('.q-opts', quizEl).addEventListener('click', e => {
      const b = e.target.closest('.q-opt');
      if (!b || b.disabled) return;
      const k = +b.dataset.k, ok = k === q.a;
      if (ok) qs.score++;
      $$('.q-opt', quizEl).forEach((x, j) => { x.disabled = true; if (j === q.a) x.classList.add('ok'); });
      if (!ok) b.classList.add('bad');
      const blank = $('.blank', quizEl);
      blank.textContent = q.o[q.a];
      blank.classList.add('filled');
      $('.q-prog i', quizEl).style.width = `${((qs.i + 1) / n) * 100}%`;
      $('.q-top span:last-child', quizEl).textContent = `✓ ${qs.score}`;
      const full = q.s.replace('___', q.o[q.a]);
      $('.q-fb', quizEl).innerHTML = `<div class="q-exp"><b>${ok ? '✓ В точку.' : '✗ Мимо. Правильно: ' + q.o[q.a]}</b>${q.e}</div><button class="btn q-next" type="button">${qs.i === n - 1 ? 'Результат' : 'Дальше'}</button>`;
      if (ok) { say(full); document.dispatchEvent(new CustomEvent('wow:confetti', { detail: { el: b, n: 40 } })); }
      $('.q-next', quizEl).onclick = () => { qs.i++; renderQuiz(); quizEl.scrollIntoView({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' }); };
    });
  }
  if (quizEl) renderQuiz();

  /* ============================================================
     Sentence builder
     ============================================================ */
  const TASKS = [
    { ru: 'Город, в котором я живу, маленький.', w: ['Die', 'Stadt,', 'in', 'der', 'ich', 'wohne,', 'ist', 'klein.'] },
    { ru: 'Мужчина, которому я помог, мой сосед.', w: ['Der', 'Mann,', 'dem', 'ich', 'geholfen', 'habe,', 'ist', 'mein', 'Nachbar.'] },
    { ru: 'Это газета, которую мы уже прочитали.', w: ['Das', 'ist', 'die', 'Zeitung,', 'die', 'wir', 'schon', 'gelesen', 'haben.'] }
  ];
  const sbZone = $('#sb-zone'), sbBank = $('#sb-bank'), sbMsg = $('#sb-msg');
  const sb = { t: 0, zone: [], bank: [] };
  function shuffle(a) {
    const r = a.slice();
    do {
      for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    } while (r.every((v, i) => v === i));
    return r;
  }
  function loadTask(t) {
    sb.t = t;
    sb.zone = [];
    sb.bank = shuffle(TASKS[t].w.map((_, i) => i));
    $('#sb-ru').textContent = `«${TASKS[t].ru}»`;
    sbMsg.textContent = '';
    sbZone.classList.remove('ok', 'bad');
    drawSB();
  }
  function drawSB() {
    const W = TASKS[sb.t].w;
    sbZone.innerHTML = sb.zone.map(i => `<button class="sb-tok" type="button" data-i="${i}">${W[i]}</button>`).join('');
    sbBank.innerHTML = sb.bank.map(i => `<button class="sb-tok" type="button" data-i="${i}">${W[i]}</button>`).join('');
  }
  if (sbZone) {
    sbBank.addEventListener('click', e => {
      const b = e.target.closest('.sb-tok'); if (!b) return;
      const i = +b.dataset.i;
      sb.bank = sb.bank.filter(x => x !== i); sb.zone.push(i);
      sbZone.classList.remove('ok', 'bad'); sbMsg.textContent = '';
      drawSB();
    });
    sbZone.addEventListener('click', e => {
      const b = e.target.closest('.sb-tok'); if (!b) return;
      const i = +b.dataset.i;
      sb.zone = sb.zone.filter(x => x !== i); sb.bank.push(i);
      sbZone.classList.remove('ok', 'bad'); sbMsg.textContent = '';
      drawSB();
    });
    $('#sb-reset').addEventListener('click', () => loadTask(sb.t));
    $('#sb-next').addEventListener('click', () => loadTask((sb.t + 1) % TASKS.length));
    $('#sb-check').addEventListener('click', () => {
      const W = TASKS[sb.t].w;
      if (sb.zone.length < W.length) { sbMsg.textContent = 'Ещё не все слова на месте.'; return; }
      const built = sb.zone.map(i => W[i]).join(' ');
      const ok = built === W.join(' ');
      sbZone.classList.toggle('ok', ok);
      sbZone.classList.toggle('bad', !ok);
      sbMsg.innerHTML = ok ? '<b style="color:#2A5945">Wunderbar!</b> Всё на своих местах.' : 'Почти. Проверь, где стоит глагол и куда уехал предлог.';
      if (ok) { say(built); document.dispatchEvent(new CustomEvent('wow:confetti', { detail: { el: sbZone, n: 90 } })); }
    });
    loadTask(0);
  }

  /* ============================================================
     Videos: lazy load + play only while visible; tabbed showcase
     ============================================================ */
  const vidIO = new IntersectionObserver(entries => {
    entries.forEach(({ target: v, isIntersecting }) => {
      if (isIntersecting) {
        const s = v.querySelector('source[data-src]');
        if (s) { s.src = s.dataset.src; s.removeAttribute('data-src'); v.load(); }
        if (!reduce) v.play().catch(() => {});
      } else v.pause();
    });
  }, { threshold: 0.25 });
  $$('video').forEach(v => vidIO.observe(v));

  const VIDS = [
    { f: 'gemini-guide', t: 'Интерактивный гайд', d: 'История на русском, в которую вшиты немецкие фразы. Нажал на фразу, услышал произношение. Слова запоминаются в контексте, а не столбиком.' },
    { f: 'sollen-wollen', t: 'Тесты с разбором', d: 'Выбираешь ответ. Ошибся? Сразу видишь объяснение, почему именно так. Никаких «ответы в конце учебника».' },
    { f: 'article-family', t: 'Семья артиклей', d: 'Herr Der, Frau Die и Baby Das. У каждого артикля свой характер и своя компания слов. Запоминаются как лица, а не как таблица.' },
    { f: 'situations', t: 'Лексика для жизни', d: 'Магазин, касса, возврат товара, барбершоп, спортзал. Ситуации, в которые попадаешь в первую же неделю в Германии или Австрии.' },
    { f: 'grammar', t: 'Грамматика по порядку', d: 'От алфавита до модальных глаголов и приставок. Каждый гайд опирается на предыдущий. Не надо гадать, что учить дальше.' }
  ];
  const vMain = $('#vid-main');
  const vTabs = $('#vid-tabs');
  function setVid(k, anim) {
    const V = VIDS[k];
    $('#vid-title').textContent = V.t;
    $('#vid-text').textContent = V.d;
    if (!anim) return;
    vMain.poster = `assets/video/${V.f}.jpg`;
    vMain.innerHTML = `<source src="assets/video/${V.f}.mp4" type="video/mp4">`;
    vMain.load();
    vMain.classList.remove('fade'); void vMain.offsetWidth; vMain.classList.add('fade');
    if (!reduce) vMain.play().catch(() => {});
  }
  if (vTabs) {
    vTabs.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || b.classList.contains('on')) return;
      $$('button', vTabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: reduce ? 'auto' : 'smooth' });
      setVid(+b.dataset.v, true);
    });
    setVid(0, false);
  }
})();

/* ============================================================
   WOW layer — split headings, rotator, parallax, ribbons,
   counters, confetti, tilt
   ============================================================ */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- split headings into masked words ---------- */
  $$('h1.split, h2').forEach(h => {
    if (h.classList.contains('big-split') || h.children.length) return;
    const words = h.textContent.trim().split(/ +/);
    h.innerHTML = words.map((w, k) => `<span class="sw"><i style="--k:${k}">${w}</i></span>`).join(' ');
    h.classList.add('split');
  });

  /* ---------- hero rotator ---------- */
  const rot = $('#rot-w');
  if (rot && !reduce) {
    const W = ['der', 'die', 'das', 'den', 'dem', 'dessen', 'deren', 'denen', 'wer', 'was'];
    let k = 0;
    setInterval(() => {
      rot.classList.remove('inn');
      rot.classList.add('out');
      setTimeout(() => {
        k = (k + 1) % W.length;
        rot.textContent = W[k];
        rot.classList.remove('out');
        void rot.offsetWidth;
        rot.classList.add('inn');
      }, 340);
    }, 1700);
  }

  /* ---------- ribbons ---------- */
  const RIB = {
    de: [
      ['r-o', ['Der Mann, <b>der</b> singt', 'Die Frau, <b>der</b> ich helfe', 'Das Kind, <b>dessen</b> Ball rot ist', 'Die Leute, mit <b>denen</b> ich arbeite', 'Alles, <b>was</b> du sagst', '<b>Wer</b> A sagt, muss auch B sagen']],
      ['r-b', ['der · die · das', 'den · dem · <b>dessen</b>', '<b>deren</b> · <b>denen</b>', 'Глагол в хвост', 'Предлог вперёд', 'Запятые с двух сторон']]
    ],
    ad: [
      ['r-g', ['Stellas A0–C1', 'Один раз. <b>Навсегда</b>', 'Грамматика по порядку', 'Проверка с разбором', 'Лексика для жизни', '<b>30 €</b> за всё']],
      ['r-o', ['Herr Der', 'Frau Die', 'Baby Das', 'Sentence Builder', 'Hören', 'Трекер прогресса']]
    ]
  };
  $$('[data-ribbon]').forEach(box => {
    box.innerHTML = RIB[box.dataset.ribbon].map(([cls, items]) => {
      const half = items.concat(items).map(t => `<span>${t}</span>`).join('');
      return `<div class="ribbon ${cls}"><div class="track">${half}${half}</div></div>`;
    }).join('');
  });
  const ribbons = $$('.ribbon');

  /* ---------- scroll: progress, parallax, ribbon skew ---------- */
  const progress = $('#progress');
  const para = $$('[data-speed]').map(el => ({ el, s: +el.dataset.speed, ref: el.parentElement }));
  let lastY = scrollY, skew = 0, ticking = false;
  function frame() {
    ticking = false;
    const y = scrollY, vh = innerHeight;
    const max = document.documentElement.scrollHeight - vh;
    progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    if (!reduce) {
      para.forEach(({ el, s, ref }) => {
        const r = ref.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        const c = r.top + r.height / 2 - vh / 2;
        el.style.translate = `0 ${(c * s).toFixed(1)}px`;
      });
      const v = y - lastY;
      skew += (Math.max(-10, Math.min(10, v * 0.35)) - skew) * 0.18;
      if (Math.abs(skew) < 0.05) skew = 0;
      ribbons.forEach(r => r.style.setProperty('--skew', skew.toFixed(2) + 'deg'));
      if (skew !== 0) request();
    }
    lastY = y;
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', request);
  frame();

  /* ---------- counters ---------- */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target, n = +el.dataset.count;
    if (reduce) { el.textContent = n; return; }
    const t0 = performance.now(), dur = 1300;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
      else el.animate([{ transform: 'scale(1.3)' }, { transform: 'none' }], { duration: 500, easing: 'cubic-bezier(.34,1.56,.64,1)' });
    };
    requestAnimationFrame(step);
  }), { threshold: 0.6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* ---------- confetti ---------- */
  const cv = $('#confetti');
  const ctx = cv.getContext('2d');
  const COLORS = ['#4677FF', '#F46907', '#2A5945', '#7DB46C', '#F2C94C', '#FFFFFF'];
  let parts = [], running = false;
  function size() {
    const d = Math.min(2, devicePixelRatio || 1);
    cv.width = innerWidth * d; cv.height = innerHeight * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  size();
  addEventListener('resize', size);
  function burst(x, y, n) {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.1;
      const sp = 6 + Math.random() * 9;
      parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, w: 6 + Math.random() * 6, h: 4 + Math.random() * 6, c: COLORS[i % COLORS.length], life: 1 });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  function tick() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    parts = parts.filter(p => p.life > 0 && p.y < innerHeight + 40);
    parts.forEach(p => {
      p.vy += 0.32; p.vx *= 0.985; p.vy *= 0.985;
      p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life -= 0.009;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, p.life * 1.6));
      ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r * 2)));
      ctx.restore();
    });
    if (parts.length) requestAnimationFrame(tick);
    else { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }
  }
  document.addEventListener('wow:confetti', e => {
    if (reduce) return;
    const r = e.detail.el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, e.detail.n || 60);
  });

  /* ---------- tilt on pointer devices ---------- */
  if (!reduce && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    $$('.feat, .pain, .pcard, .vid-cap, .post, .stats div, .testi-feature').forEach(el => {
      el.setAttribute('data-tilt', '');
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.classList.remove('tilt-reset');
        el.classList.add('tilting');
        el.style.setProperty('--mx', px * 100 + '%');
        el.style.setProperty('--my', py * 100 + '%');
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 9}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => {
        el.classList.remove('tilting');
        el.classList.add('tilt-reset');
        el.style.transform = '';
        setTimeout(() => el.classList.remove('tilt-reset'), 650);
      });
    });
  }
})();

/* ============================================================
   Real platform gallery + lightbox, review rows
   ============================================================ */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const GAL = {
    a: [
      ['a-home', 'Главная A0–A2: навигация, таймер, ресурсы по уровню'],
      ['a-grammar', 'Грамматика с самых основ'],
      ['a-articles', 'Существительные и артикли'],
      ['a-verbs', 'Глаголы: модальные, приставки, наклонения'],
      ['a-progress', 'Прогресс по темам с отметками'],
      ['a-tracker', 'Трекер привычек: чтение, слушание, письмо'],
      ['a-srs', 'Интервальные повторения слов'],
      ['a-hospital', 'Лексика: больница, покупки и сервис'],
      ['a-work', 'Лексика: работа и коллеги'],
      ['a-city', 'Город, транспорт, еда и заведения'],
      ['a-audio', 'Аудио-таблицы с транскрипцией'],
      ['a-exams', 'Экзамены: Goethe-Zertifikat по уровням']
    ],
    b: [
      ['b-home', 'Главная B1–C1'],
      ['b-grammar-b1', 'Грамматика B1: времена, пассив, модальные'],
      ['b-progress', 'Прогресс по грамматике B1–C1'],
      ['b-themes', 'Темы лексики B1–C1'],
      ['b-srs', 'Система интервальных повторений'],
      ['b-calendar', 'Календарь для планирования учёбы'],
      ['b-more', 'Больше материалов: тексты, диалоги, экзамены']
    ]
  };
  const bento = $('#bento');
  const gTabs = $('#gal-tabs');
  let cur = 'a';
  function drawGal(key, anim) {
    cur = key;
    bento.innerHTML = GAL[key].map(([f, cap], i) =>
      `<button class="g-item${i === 0 ? ' big' : ''}" type="button" data-i="${i}"><img src="assets/real/${i === 0 ? '' : 't/'}${f}.jpg" alt="${cap}" loading="lazy"><span>${cap}</span></button>`).join('');
    if (anim && !reduce) $$('.g-item', bento).forEach((el, i) => el.animate([{ opacity: 0, transform: 'translateY(18px) scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 550, delay: i * 45, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'backwards' }));
  }
  if (bento) {
    drawGal('a', false);
    gTabs.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b || b.classList.contains('on')) return;
      $$('button', gTabs).forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-selected', x === b); });
      drawGal(b.dataset.g, true);
    });
  }

  /* lightbox */
  const lb = $('#lb'), lbImg = $('#lb-img'), lbCap = $('#lb-cap');
  let li = 0, lastFocus = null;
  function show(i) {
    const list = GAL[cur];
    li = (i + list.length) % list.length;
    const [f, cap] = list[li];
    lbImg.src = `assets/real/${f}.jpg`;
    lbImg.alt = cap;
    lbCap.textContent = `${cap} · ${li + 1}/${list.length}`;
    if (!reduce) lbImg.animate([{ opacity: 0, transform: 'scale(.97)' }, { opacity: 1, transform: 'none' }], { duration: 350, easing: 'ease-out' });
  }
  function open(i) { lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = 'hidden'; show(i); $('.lb-x', lb).focus(); }
  function close() { lb.hidden = true; document.body.style.overflow = ''; lastFocus?.focus(); }
  bento?.addEventListener('click', e => { const b = e.target.closest('.g-item'); if (b) open(+b.dataset.i); });
  $('.lb-x', lb).onclick = close;
  $('.lb-prev', lb).onclick = () => show(li - 1);
  $('.lb-next', lb).onclick = () => show(li + 1);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(li - 1);
    if (e.key === 'ArrowRight') show(li + 1);
  });
  let sx = null;
  lb.addEventListener('pointerdown', e => { sx = e.clientX; });
  lb.addEventListener('pointerup', e => {
    if (sx === null) return;
    const dx = e.clientX - sx; sx = null;
    if (Math.abs(dx) > 50) show(li + (dx < 0 ? 1 : -1));
  });

  /* review rows */
  const REV = {
    1: ['r1', 'n-b1exam', 'r3', 'n-club', 'n-a2b2', 'r5', 'n-notion', 'n-big'],
    2: ['r2', 'n-beginner', 'n-checklists', 'r4', 'n-faster', 'n-system', 'n-audio', 'r6', 'n-books']
  };
  $$('[data-rev]').forEach(row => {
    const cards = REV[row.dataset.rev].map(f => `<figure class="rcard"><img src="assets/reviews/${f}.jpg" alt="Отзыв ученика Stellas" loading="lazy"></figure>`).join('');
    row.innerHTML = `<div class="rev-track">${cards}${cards}</div>`;
  });
})();
