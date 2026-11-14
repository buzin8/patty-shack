import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const links = [
  { label: 'Menu', to: '/menu' },
  { label: 'Our Story', to: '/about' },
  { label: 'Locations', to: '/locations' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[76px] bg-primary-500 nav-white">
      <nav className="wrap flex h-full items-center justify-between gap-2">
        <Link to="/" className="flex min-w-0 items-center gap-1 cursor-pointer wiggle">
          <span className="display text-[24px] leading-none text-background-50">
            <span className="text-accent-500">Patty</span> <span className="text-foreground-950">Shack</span>
          </span>
          <span className="sticker shrink-0 !text-[12px] !px-2 !py-1 bg-foreground-950 text-background-50 tilt-r">sector v</span>
        </Link>
        <ul className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) => `display text-[16px] px-4 py-2 rounded-full border-[2px] whitespace-nowrap transition-colors cursor-pointer ${isActive ? 'border-background-50 bg-background-50 text-primary-600' : 'border-transparent text-background-50 hover:border-background-50 hover:bg-background-50 hover:text-primary-600'}`}
              >
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <Link to="/contact#customer-account" className="hidden lg:inline-block text-xs font-bold text-foreground-950 underline underline-offset-4">
            My bookings
          </Link>
          <div className="hidden lg:flex">
            <Link to="/contact#book" className="btn-poster btn-paper btn-sm">
              Book a Table
            </Link>
          </div>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden w-11 h-11 shrink-0 flex items-center justify-center rounded-full border-[2.5px] border-background-50 text-background-50 cursor-pointer whitespace-nowrap"
          >
            <i className={`${open ? 'ri-close-line' : 'ri-menu-line'} text-xl`} />
          </button>
        </div>
      </nav>
      {open && (
        <div className="lg:hidden border-b-[2.5px] border-background-50 bg-primary-500 text-background-50 wrap pb-6">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="h-section block dash-line py-4 !text-4xl cursor-pointer">
              {l.label}
            </Link>
          ))}
          <Link to="/contact#customer-account" onClick={() => setOpen(false)} className="h-section block dash-line py-4 !text-4xl cursor-pointer">
            My bookings
          </Link>
          <Link to="/contact#book" onClick={() => setOpen(false)} className="mt-6 btn-poster btn-paper btn-sm">
            Book a Table
          </Link>
        </div>
      )}
    </header>
  );
}
