import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';

const nav = [
  { label: 'Menu', href: '/menu' },
  { label: 'Story', href: '/about' },
  { label: 'Locations', href: '/locations' },
  { label: 'Contact', href: '/contact' },
];

export default function Footer() {
  return (
    <footer className="relative bg-primary-500 text-background-50 overflow-hidden border-t-[2.5px] border-foreground-950">
      <div className="absolute inset-0 halftone-light pointer-events-none" aria-hidden="true" />
      <div className="wrap relative pt-16 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 items-start" data-m-group>
          <div className="md:col-span-6" data-m="up">
            <p className="h-section">Get messy.<br />Stay loud.</p>
            <span className="hand mt-4 inline-block text-xl tilt-xs">— see you at the counter</span>
          </div>
          <ul data-m="fade" className="md:col-span-6 flex flex-wrap md:justify-end items-start gap-3">
            {nav.map((n) => (
              <li key={n.label}>
                <Link to={n.href} className="btn-poster btn-paper btn-sm">{n.label}</Link>
              </li>
            ))}
            <li>
              <span className="sticker bg-foreground-950 text-background-50 tilt-r" title="Instagram link coming soon">IG — soon!</span>
            </li>
          </ul>
        </div>
        <div className="w-full flex justify-center items-center overflow-hidden pt-4 pb-2 select-none text-center">
          <p
            data-m="letters"
            className="footer-wordmark display text-foreground-950 text-center select-none"
            style={{
              fontSize: 'clamp(28px, 9.4vw, 130px)',
              lineHeight: 0.85,
              letterSpacing: '-0.025em',
              whiteSpace: 'nowrap',
              margin: '0 auto',
            }}
            aria-hidden="true"
          >
            {'PATTY SHACK'.split('').map((ch, i) => (
              <span key={`${ch}-${i}`} className="m-letter-mask">
                <span className="m-letter" style={{ '--i': i } as CSSProperties}>{ch === ' ' ? '\u00a0' : ch}</span>
              </span>
            ))}
          </p>
        </div>
      </div>
      <div className="wrap relative flex flex-col sm:flex-row justify-between gap-2 py-6 mt-6 dash-line !border-background-50/50 text-xs text-background-50/85">
        <span>© 2026 Patty Shack Burger &amp; Grill. All rights reserved.</span>
        <span className="hand text-sm">smash burgers · open flame · made fresh</span>
      </div>
    </footer>
  );
}
