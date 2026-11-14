import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { observeMotion } from '@/hooks/motion';
import type { ReactNode } from 'react';
import {
  UNSAFE_LocationContext as LocationContext, useLocation, useNavigationType,
} from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  jumpToTop, pauseSmoothScroll, resumeSmoothScroll, smoothScrollToElement,
  startSmoothScroll, stopSmoothScroll,
} from '@/hooks/smoothScroll';

interface RouteTransitionProps {
  children: ReactNode;
}

interface Layer {
  loc: Location;
  entering: boolean;
}

const DURATION = 750;

function MotionScope({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? observeMotion(ref.current) : undefined), []);
  return <div ref={ref}>{children}</div>;
}

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default function RouteTransition({ children }: RouteTransitionProps) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const [layers, setLayers] = useState<Layer[]>([{ loc: location, entering: false }]);
  const [settleId, setSettleId] = useState(0);

  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    startSmoothScroll();
    return () => stopSmoothScroll();
  }, []);

  // New location: keep the old page in place and fade the new page in on top of it
  useLayoutEffect(() => {
    setLayers((prev) => {
      const top = prev[prev.length - 1];
      if (top.loc.pathname === location.pathname) {
        return prev.map((l) => (l === top ? { ...l, loc: location } : l));
      }
      if (reduced()) return [{ loc: location, entering: false }];
      return [{ loc: top.loc, entering: false }, { loc: location, entering: true }];
    });
    if (reduced()) setSettleId((n) => n + 1);
  }, [location]);

  const transitioning = layers.length > 1;

  useEffect(() => {
    if (!transitioning) return undefined;
    pauseSmoothScroll();
    const t = window.setTimeout(() => {
      setLayers((prev) => [{ loc: prev[prev.length - 1].loc, entering: false }]);
      setSettleId((n) => n + 1);
    }, DURATION);
    return () => window.clearTimeout(t);
  }, [transitioning, layers]);

  // After the old page is removed: be at the top, then resume smooth scroll
  useLayoutEffect(() => {
    if (transitioning) return undefined;
    jumpToTop();
    resumeSmoothScroll();
    const raf = window.requestAnimationFrame(() => {
      jumpToTop();
      ScrollTrigger.refresh();
    });
    let t = 0;
    if (location.hash) {
      t = window.setTimeout(() => {
        const el = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (el) smoothScrollToElement(el);
      }, 120);
    }
    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settleId, location.hash]);

  return (
    <>
      {layers.map((layer, i) => {
        const isOld = transitioning && i === 0;
        return (
          <div
            key={layer.loc.pathname}
            className={layer.entering ? 'route-layer-enter' : undefined}
            style={isOld ? { pointerEvents: 'none' } : undefined}
            aria-hidden={isOld || undefined}
          >
            <LocationContext.Provider value={{ location: layer.loc, navigationType }}>
              <MotionScope>{children}</MotionScope>
            </LocationContext.Provider>
          </div>
        );
      })}
    </>
  );
}