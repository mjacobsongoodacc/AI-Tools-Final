import { useEffect, useRef, useCallback } from 'react';

const BASE = '#000000';
const NODE_COLOR = 'rgba(250, 250, 250, 0.8)';
const TARGET_FPS_MS = 16;
const INITIAL_NODE_COUNT = 40;
const REDUCED_NODE_COUNT = 30;

function randomBetween(rng, min, max) {
  return min + rng() * (max - min);
}

function createNodes(width, height, count, rng = Math.random) {
  const cx = width / 2;
  const cy = height / 2;
  const nodes = [];
  for (let i = 0; i < count; i += 1) {
    const A = width * 0.35 * randomBetween(rng, 0.4, 1.0);
    const B = height * 0.35 * randomBetween(rng, 0.4, 1.0);
    const a = Math.floor(randomBetween(rng, 1, 6));
    const b = Math.floor(randomBetween(rng, 1, 6));
    const phi = randomBetween(rng, 0, Math.PI * 2);
    const speed = randomBetween(rng, 0.0003, 0.0008);
    nodes.push({ A, B, a, b, phi, speed, cx, cy, x: cx, y: cy });
  }
  return nodes;
}

export default function LissajousWeb({ className }) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const nodesRef = useRef([]);
  const runningRef = useRef(false);
  const rafIdRef = useRef(0);
  const startTimeRef = useRef(0);
  const dprRef = useRef(1);
  const parallaxRafRef = useRef(0);
  const mxRef = useRef(0);
  const myRef = useRef(0);
  const reducedMotionRef = useRef(false);
  const nodeCountRef = useRef(INITIAL_NODE_COUNT);
  const downgradedRef = useRef(false);
  const lastFrameRef = useRef(0);
  const frameDtsRef = useRef([]);

  // `t` in the Lissajous formula is elapsed time in milliseconds so that
  // speed values in the 0.0003–0.0008 range produce visible motion (the
  // original spec’s constants assume ms-scale `t`, not seconds).
  const drawFrame = useCallback((elapsedMs) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = dprRef.current;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    const maxDist = w * 0.18;
    const nodes = nodesRef.current;
    const cx = w / 2;
    const cy = h / 2;
    // Slow motion ~50% vs raw elapsed time (half angular rate).
    const t = elapsedMs * 0.5;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = BASE;
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i];
      n.cx = cx;
      n.cy = cy;
      n.x = cx + n.A * Math.sin(n.a * t * n.speed + n.phi);
      n.y = cy + n.B * Math.sin(n.b * t * n.speed);
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const na = nodes[i];
        const nb = nodes[j];
        const d = Math.hypot(na.x - nb.x, na.y - nb.y);
        if (d < maxDist && d > 0) {
          let opacity = 1 - d / maxDist;
          if (opacity < 0) opacity = 0;
          if (opacity > 0.5) opacity = 0.5;
          ctx.strokeStyle = `rgba(239, 68, 68, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(na.x, na.y);
          ctx.lineTo(nb.x, nb.y);
          ctx.stroke();
        }
      }
    }

    ctx.fillStyle = NODE_COLOR;
    for (let i = 0; i < nodes.length; i += 1) {
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, 1, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapperRef.current;
    if (!canvas || !wrap) return;
    const rect = wrap.getBoundingClientRect();
    const w = Math.max(1, Math.floor(rect.width));
    const h = Math.max(1, Math.floor(rect.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    nodesRef.current = createNodes(w, h, nodeCountRef.current, Math.random);
    if (reducedMotionRef.current) {
      drawFrame(0);
    }
  }, [drawFrame]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapperRef.current;
    if (!canvas || !wrap) return undefined;

    reducedMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    resizeCanvas();

    const resizeObs = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObs.observe(wrap);

    const loop = (now) => {
      if (!runningRef.current) return;
      if (import.meta.env.DEV && !downgradedRef.current && lastFrameRef.current > 0) {
        const dt = now - lastFrameRef.current;
        frameDtsRef.current.push(dt);
        if (frameDtsRef.current.length > 45) frameDtsRef.current.shift();
        if (frameDtsRef.current.length >= 30) {
          const avg = frameDtsRef.current.reduce((a, b) => a + b, 0) / frameDtsRef.current.length;
          if (avg > TARGET_FPS_MS && nodeCountRef.current === INITIAL_NODE_COUNT) {
            nodeCountRef.current = REDUCED_NODE_COUNT;
            downgradedRef.current = true;
            resizeCanvas();
            // eslint-disable-next-line no-console
            console.debug('[LissajousWeb] avg frame ms', avg.toFixed(2), '→ nodes', REDUCED_NODE_COUNT);
          }
        }
      }
      lastFrameRef.current = now;

      const elapsedMs = now - startTimeRef.current;
      drawFrame(elapsedMs);
      rafIdRef.current = requestAnimationFrame(loop);
    };

    const onIntersect = (entries) => {
      const e = entries[0];
      const visible = e?.isIntersecting ?? false;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = 0;
      }
      if (reducedMotionRef.current) {
        if (visible) drawFrame(0);
        return;
      }
      runningRef.current = visible;
      if (visible) {
        startTimeRef.current = performance.now();
        lastFrameRef.current = 0;
        frameDtsRef.current = [];
        rafIdRef.current = requestAnimationFrame(loop);
      }
    };

    const io = new IntersectionObserver(onIntersect, { root: null, threshold: 0.01 });
    io.observe(canvas);

    const scheduleParallax = () => {
      if (parallaxRafRef.current) return;
      parallaxRafRef.current = requestAnimationFrame(() => {
        parallaxRafRef.current = 0;
        if (reducedMotionRef.current || !canvas) return;
        const tx = mxRef.current * -12;
        const ty = myRef.current * -12;
        canvas.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };

    const onMouseMove = (e) => {
      if (reducedMotionRef.current) return;
      mxRef.current = (e.clientX - window.innerWidth / 2) / window.innerWidth;
      myRef.current = (e.clientY - window.innerHeight / 2) / window.innerHeight;
      scheduleParallax();
    };

    if (!reducedMotionRef.current) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    canvas.style.transition = 'transform 0.4s ease-out';

    if (reducedMotionRef.current) {
      drawFrame(0);
    }

    return () => {
      runningRef.current = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (parallaxRafRef.current) cancelAnimationFrame(parallaxRafRef.current);
      window.removeEventListener('mousemove', onMouseMove);
      io.disconnect();
      resizeObs.disconnect();
      canvas.style.transform = '';
    };
  }, [resizeCanvas, drawFrame]);

  return (
    <div ref={wrapperRef} className={`absolute inset-0 overflow-hidden ${className ?? ''}`}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
