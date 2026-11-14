/**
 * Lightweight site-wide reveal system.
 * - One IntersectionObserver per page scope, CSS transitions only (transform/opacity/clip-path).
 * - Hidden states only apply while <html> has `motion-ready`, so content stays visible if JS fails.
 * - Each element reveals once, then is unobserved.
 *
 * Markup:
 *   data-m="up" | "fade" | "img" | "scale"   reveal type
 *   data-m-group                             children with data-m are staggered (90ms)
 *   data-m-delay="120"                       extra delay in ms
 *   data-count                               count up the first number in the text (keeps prefix/suffix/decimals)
 */

const STAGGER = 90;

const reducedMotion = () => typeof window !== 'undefined'
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function enableMotion() {
  if (typeof document === 'undefined' || reducedMotion()) return;
  document.documentElement.classList.add('motion-ready');
}

function countUp(el: HTMLElement) {
  const original = el.textContent ?? '';
  const match = original.match(/^(\D*?)(\d[\d,]*(?:\.\d+)?)(.*)$/s);
  if (!match) return;
  const [, prefix, numStr, suffix] = match;
  const target = parseFloat(numStr.replace(/,/g, ''));
  if (!Number.isFinite(target) || target === 0) return;
  const decimals = (numStr.split('.')[1] ?? '').length;
  const useSep = numStr.includes(',');
  const format = (v: number) => {
    const fixed = v.toFixed(decimals);
    if (!useSep) return fixed;
    const [int, dec] = fixed.split('.');
    return `${Number(int).toLocaleString('en-US')}${dec ? `.${dec}` : ''}`;
  };
  const duration = 1100;
  let start = 0;
  el.textContent = `${prefix}${format(0)}${suffix}`;
  const frame = (ts: number) => {
    if (!start) start = ts;
    const t = Math.min(1, (ts - start) / duration);
    const eased = 1 - (1 - t) ** 3;
    el.textContent = t < 1 ? `${prefix}${format(target * eased)}${suffix}` : original;
    if (t < 1 && el.isConnected) requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

function assignStagger(scope: HTMLElement) {
  scope.querySelectorAll<HTMLElement>('[data-m-group]').forEach((group) => {
    const items = Array.from(group.querySelectorAll<HTMLElement>('[data-m]'))
      .filter((el) => el.closest('[data-m-group]') === group);
    items.forEach((el, i) => {
      const extra = Number(el.dataset.mDelay || 0);
      el.style.transitionDelay = `${extra + i * STAGGER}ms`;
      el.style.setProperty('--m-d', `${extra + i * STAGGER}ms`);
    });
  });
  scope.querySelectorAll<HTMLElement>('[data-m][data-m-delay]').forEach((el) => {
    if (!el.closest('[data-m-group]')) {
      el.style.transitionDelay = `${el.dataset.mDelay}ms`;
      el.style.setProperty('--m-d', `${el.dataset.mDelay}ms`);
    }
  });
}

/** Watches a page scope; returns a cleanup function. */
export function observeMotion(scope: HTMLElement) {
  enableMotion();
  const seen = new WeakSet<Element>();

  const reveal = (el: HTMLElement) => {
    el.classList.add('m-in');
    if (el.hasAttribute('data-count')) countUp(el);
    el.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
  };

  if (reducedMotion() || typeof IntersectionObserver === 'undefined') {
    return () => {};
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const el = entry.target as HTMLElement;
      // Reveal when entering, or if it is already above the viewport (e.g. after a hash jump)
      if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
        reveal(el);
        io.unobserve(el);
      }
    });
  }, { rootMargin: '0px 0px -16% 0px', threshold: 0 });

  const scan = () => {
    assignStagger(scope);
    scope.querySelectorAll<HTMLElement>('[data-m], [data-count]').forEach((el) => {
      if (seen.has(el)) return;
      // data-count inside a data-m element is triggered by its parent
      if (!el.hasAttribute('data-m') && el.closest('[data-m]')) return;
      seen.add(el);
      io.observe(el);
    });
  };

  scan();
  let pending = 0;
  const mo = new MutationObserver(() => {
    if (pending) return;
    pending = window.requestAnimationFrame(() => { pending = 0; scan(); });
  });
  mo.observe(scope, { childList: true, subtree: true });

  return () => {
    io.disconnect();
    mo.disconnect();
    if (pending) cancelAnimationFrame(pending);
  };
}