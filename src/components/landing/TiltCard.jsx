import { useLayoutEffect, useRef, useState } from 'react';

export default function TiltCard({ children }) {
  const wrapRef = useRef(null);
  const highlightRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useLayoutEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  const onMouseMove = (e) => {
    if (reduced) return;
    const el = wrapRef.current;
    const hi = highlightRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    el.style.transition = 'transform 80ms ease-out';
    el.style.transform = `perspective(1000px) rotateY(${nx * 8}deg) rotateX(${-ny * 8}deg) translateZ(0)`;
    if (hi) {
      const hx = e.clientX - r.left;
      const hy = e.clientY - r.top;
      hi.style.background = `radial-gradient(circle at ${hx}px ${hy}px, rgba(59, 130, 246, 0.1), transparent 40%)`;
    }
  };

  const onMouseLeave = () => {
    if (reduced) return;
    const el = wrapRef.current;
    if (!el) return;
    el.style.transition = 'transform 400ms ease-out';
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
  };

  if (reduced) {
    return <div className="h-full">{children}</div>;
  }

  return (
    <div
      ref={wrapRef}
      className="relative h-full rounded-2xl [transform-style:preserve-3d]"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        ref={highlightRef}
        className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
        aria-hidden
      />
      <div className="relative z-10 h-full [transform:translateZ(20px)] [transform-style:preserve-3d]">
        {children}
      </div>
    </div>
  );
}
