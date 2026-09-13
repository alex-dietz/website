import { reviewNotes } from '../data/site';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════════════════════════════════════════════
   Tier 1 — free
   ══════════════════════════════════════════════════════════════════════════ */

function consoleNote() {
  const head = 'color:#9c2c14;font:600 13px ui-monospace,monospace';
  const body = 'color:#6f675a;font:13px ui-monospace,monospace';
  console.log('%cAlexander Dietz — alexanderdietz.eu', head);
  console.log(
    '%cA few things on this page are hidden.\n' +
      'Drag the rule under the name.',
    body
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Tier 2 — footnotes
   ══════════════════════════════════════════════════════════════════════════ */

function footnotes() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.fn'));
  let open: HTMLButtonElement | null = null;

  // Notes are position:fixed, but any ancestor with a transform — including the
  // identity matrix an animation-fill-mode:forwards leaves behind — becomes their
  // containing block. Hoist them to <body> so they always resolve to the viewport.
  const layer = document.createElement('div');
  layer.className = 'fn-layer';
  document.body.appendChild(layer);
  document.querySelectorAll<HTMLElement>('.fn__note').forEach((n) => layer.appendChild(n));

  const noteFor = (btn: HTMLButtonElement) =>
    layer.querySelector<HTMLElement>(`[data-fn-note="${btn.dataset.fn}"]`);

  function place(btn: HTMLButtonElement, note: HTMLElement) {
    // Measure at the origin so shrink-to-fit sees the full viewport, not the
    // space left of wherever this note happened to sit last time.
    note.style.left = '0px';
    note.style.top = '0px';
    note.style.visibility = 'hidden';
    note.dataset.open = 'true';
    const nw = note.offsetWidth;
    const nh = note.offsetHeight;
    const r = btn.getBoundingClientRect();
    const gap = 14;

    let left: number;
    if (r.right + gap + nw < window.innerWidth - 8) {
      left = r.right + gap;
    } else if (r.left - gap - nw > 8) {
      left = r.left - gap - nw;
    } else {
      left = Math.max(8, Math.min(r.left, window.innerWidth - nw - 8));
    }

    let top = r.top + r.height / 2 - nh / 2;
    top = Math.max(8, Math.min(top, window.innerHeight - nh - 8));

    note.style.left = `${Math.round(left)}px`;
    note.style.top = `${Math.round(top)}px`;
    note.style.visibility = '';
  }

  function show(btn: HTMLButtonElement) {
    const note = noteFor(btn);
    if (!note) return;
    if (open && open !== btn) hide(open);
    open = btn;
    btn.setAttribute('aria-expanded', 'true');
    place(btn, note);
  }

  function hide(btn: HTMLButtonElement) {
    const note = noteFor(btn);
    if (note) note.dataset.open = 'false';
    btn.setAttribute('aria-expanded', 'false');
    if (open === btn) open = null;
  }

  buttons.forEach((btn) => {
    btn.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'mouse') show(btn);
    });
    btn.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'mouse') hide(btn);
    });
    btn.addEventListener('focus', () => show(btn));
    btn.addEventListener('blur', () => hide(btn));
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.getAttribute('aria-expanded') === 'true' ? hide(btn) : show(btn);
    });
  });

  window.addEventListener('scroll', () => open && hide(open), { passive: true });
  window.addEventListener('resize', () => open && hide(open));
}

/* ══════════════════════════════════════════════════════════════════════════
   Tier 2 — the draggable rule
   ══════════════════════════════════════════════════════════════════════════ */

const MAX_SHIFT = 130;

function draggableRule() {
  const found = document.getElementById('rule');
  if (!found) return;
  const rule: HTMLElement = found;

  let shift = 0;
  let dragging = false;
  let startX = 0;
  let startShift = 0;

  const eras: [number, string, string][] = [
    [-45, 'letterpress', 'letterpress, circa 1890'],
    [45, '1996', 'the web, circa 1996'],
  ];

  function apply() {
    rule.style.setProperty('--shift', `${shift}px`);
    let era = '';
    let label = 'present day';
    if (shift <= eras[0][0]) {
      era = eras[0][1];
      label = eras[0][2];
    } else if (shift >= eras[1][0]) {
      era = eras[1][1];
      label = eras[1][2];
    }
    if (era) document.documentElement.dataset.era = era;
    else delete document.documentElement.dataset.era;

    rule.setAttribute('aria-valuenow', (shift / MAX_SHIFT).toFixed(2));
    rule.setAttribute('aria-valuetext', label);
  }

  function settle() {
    dragging = false;
    rule.classList.remove('rule--dragging');
    shift = 0;
    apply();
  }

  rule.addEventListener('pointerdown', (e) => {
    dragging = true;
    startX = e.clientX;
    startShift = shift;
    rule.classList.add('rule--dragging');
    try {
      rule.setPointerCapture(e.pointerId);
    } catch {
      /* no active pointer to capture — dragging still works via the listeners */
    }
  });

  rule.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const next = startShift + (e.clientX - startX);
    shift = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, next));
    apply();
  });

  const release = () => dragging && settle();
  rule.addEventListener('pointerup', release);
  rule.addEventListener('pointercancel', release);

  rule.addEventListener('keydown', (e) => {
    const step = 30;
    if (e.key === 'ArrowLeft') shift = Math.max(-MAX_SHIFT, shift - step);
    else if (e.key === 'ArrowRight') shift = Math.min(MAX_SHIFT, shift + step);
    else if (e.key === 'Home' || e.key === 'Escape') shift = 0;
    else return;
    e.preventDefault();
    apply();
  });

  rule.addEventListener('blur', () => {
    if (shift !== 0) settle();
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   Tier 3 — peer review mode
   ══════════════════════════════════════════════════════════════════════════ */

let reviewOn = false;

function toggleReview() {
  reviewOn ? endReview() : startReview();
}

function endReview() {
  reviewOn = false;
  document.querySelectorAll('.review-layer, .review-stamp').forEach((n) => n.remove());
}

function startReview() {
  reviewOn = true;
  const layer = document.createElement('div');
  layer.className = 'review-layer';
  layer.style.position = 'fixed';
  layer.style.inset = '0';
  document.body.appendChild(layer);

  const sheet = document.querySelector('.sheet');
  const sr = sheet?.getBoundingClientRect();
  const rightRoom = sr ? window.innerWidth - sr.right : 0;
  const leftRoom = sr ? sr.left : 0;
  const side: 'right' | 'left' | 'none' =
    rightRoom > 175 ? 'right' : leftRoom > 175 ? 'left' : 'none';

  let i = 0;
  for (const { sel, note, mark } of reviewNotes) {
    const target = document.querySelector(sel);
    if (!target) continue;
    const r = target.getBoundingClientRect();
    if (r.width === 0) continue;

    // The pen mark over the text itself.
    const m = document.createElement('div');
    m.className = `review-mark review-mark--${mark}`;
    const pad = mark === 'circle' ? 6 : 0;
    m.style.left = `${r.left - pad}px`;
    m.style.width = `${r.width + pad * 2}px`;
    m.style.top = mark === 'strike' ? `${r.top + r.height / 2}px` : `${r.top - pad}px`;
    if (mark === 'circle') m.style.height = `${r.height + pad * 2}px`;
    else if (mark === 'squiggle') m.style.height = `${r.height}px`;
    m.style.animation = reduceMotion ? 'none' : `penIn .4s ease ${i * 90}ms both`;
    layer.appendChild(m);

    // The marginal comment.
    if (side !== 'none') {
      const n = document.createElement('div');
      n.className = side === 'left' ? 'review-note review-note--left' : 'review-note';
      n.style.setProperty('--i', String(i));
      n.textContent = note;
      n.style.top = `${r.top - 2}px`;
      if (side === 'right') n.style.left = `${(sr?.right ?? 0) + 26}px`;
      else n.style.right = `${window.innerWidth - (sr?.left ?? 0) + 26}px`;
      layer.appendChild(n);
    }
    i++;
  }

  // Narrow screens get the comments as a list instead of margin notes.
  if (side === 'none') {
    const list = document.createElement('div');
    list.className = 'review-note';
    list.style.position = 'fixed';
    list.style.left = '1rem';
    list.style.right = '1rem';
    list.style.bottom = '5.5rem';
    list.style.maxWidth = 'none';
    list.textContent = reviewNotes.map((r) => `— ${r.note}`).join('  ');
    layer.appendChild(list);
  }

  const stamp = document.createElement('div');
  stamp.className = 'review-stamp';
  stamp.textContent = 'Major revisions';
  document.body.appendChild(stamp);

  toast('Submitted for peer review. Press again to withdraw.');
}

/* ══════════════════════════════════════════════════════════════════════════
   Tier 3 — typed words
   ══════════════════════════════════════════════════════════════════════════ */

function toast(text: string) {
  document.querySelectorAll('.toast').forEach((t) => t.remove());
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = text;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2800);
}

let audioCtx: AudioContext | null = null;

/** A gavel, synthesised — a wooden knock, no asset to download. */
function gavel() {
  if (reduceMotion) return;
  try {
    audioCtx ??= new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtx;
    if (ctx.state === 'suspended') void ctx.resume();

    const now = ctx.currentTime;
    const knock = (t: number, freq: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 2.5;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, t + 0.06);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.32, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
      osc.connect(filter).connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);
    };
    knock(now, 320);
    knock(now + 0.13, 300);
  } catch {
    /* audio is a bonus, never a requirement */
  }
}

function delftWash() {
  const el = document.createElement('div');
  el.className = 'delft-wash';
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ══════════════════════════════════════════════════════════════════════════
   Input plumbing
   ══════════════════════════════════════════════════════════════════════════ */

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

const WORDS: Record<string, () => void> = {
  mun: () => {
    gavel();
    toast('Motion carried.');
  },
  sudo: () => toast('Nice try.'),
  delft: () => {
    delftWash();
    toast('Engineering & Policy Analysis. Good years.');
  },
};

function keyboard() {
  let buffer = '';
  let konamiAt = 0;

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement | null;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;

    // Konami — tracked by position, tolerant of restarts.
    const expected = KONAMI[konamiAt];
    if (e.key === expected || e.key.toLowerCase() === expected) {
      konamiAt++;
      if (konamiAt === KONAMI.length) {
        konamiAt = 0;
        toggleReview();
      }
    } else {
      konamiAt = e.key === KONAMI[0] ? 1 : 0;
    }

    // Typed words.
    if (e.key.length === 1 && /[a-z]/i.test(e.key)) {
      buffer = (buffer + e.key.toLowerCase()).slice(-12);
      for (const word of Object.keys(WORDS)) {
        if (buffer.endsWith(word)) {
          WORDS[word]();
          buffer = '';
          break;
        }
      }
    }
  });
}

/* ══════════════════════════════════════════════════════════════════════════ */

consoleNote();
footnotes();
draggableRule();
keyboard();
