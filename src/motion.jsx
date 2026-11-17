import { useEffect, useLayoutEffect, useRef, useState } from 'react';

export const prefersReduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

// Passe à true la première fois que l'élément apparaît à l'écran.
export function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(() => prefersReduced() || typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    if (inView || !ref.current) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [inView, threshold]);

  return [ref, inView];
}

// Chiffre qui monte jusqu'à sa valeur, et qui repart de l'ancienne valeur quand elle change.
export function Count({ value, format = String, duration = 1100 }) {
  const [ref, inView] = useInView(0);
  const [shown, setShown] = useState(() => (prefersReduced() ? value : 0));
  const current = useRef(shown);

  useEffect(() => {
    if (!inView) return undefined;
    if (prefersReduced()) {
      current.current = value;
      setShown(value);
      return undefined;
    }
    const origin = current.current;
    const start = performance.now();
    let frame;
    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const next = origin + (value - origin) * (1 - (1 - progress) ** 4);
      current.current = next;
      setShown(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, inView, duration]);

  return (
    <span ref={ref} className="count">
      <span aria-hidden="true">{format(Math.round(shown))}</span>
      <span className="sr-only">{format(value)}</span>
    </span>
  );
}

// Inclinaison légère qui suit la souris.
export function useTilt(max = 4) {
  const ref = useRef(null);

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse' || prefersReduced() || !ref.current) return;
    const box = ref.current.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    ref.current.style.setProperty('--ry', `${(x * max * 2).toFixed(2)}deg`);
    ref.current.style.setProperty('--rx', `${(-y * max * 2).toFixed(2)}deg`);
  };

  const onPointerLeave = () => {
    ref.current?.style.setProperty('--ry', '0deg');
    ref.current?.style.setProperty('--rx', '0deg');
  };

  return { ref, onPointerMove, onPointerLeave };
}

// Position d'un indicateur qui glisse vers l'élément actif d'un conteneur.
export function useThumb(selector) {
  const containerRef = useRef(null);
  const [thumb, setThumb] = useState(null);

  const measure = () => {
    const active = containerRef.current?.querySelector(selector);
    const next = active
      ? { top: active.offsetTop, left: active.offsetLeft, width: active.offsetWidth, height: active.offsetHeight }
      : null;
    setThumb((prev) => {
      if (prev === next) return prev;
      if (prev && next && Object.keys(next).every((k) => prev[k] === next[k])) return prev;
      return next;
    });
  };

  // Mesuré après chaque rendu : la page, la langue et la taille du menu changent la position.
  useLayoutEffect(measure);

  useEffect(() => {
    if (!containerRef.current) return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(containerRef.current);
    document.fonts?.ready.then(measure);
    return () => observer.disconnect();
  }, []);

  return [containerRef, thumb];
}
