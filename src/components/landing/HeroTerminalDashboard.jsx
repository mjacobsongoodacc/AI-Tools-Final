import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useReducedMotion, animate } from 'framer-motion';

const SCRIPT = [
  '$ diligence run --company acme-corp',
  '→ Classifying documents...',
  '✓ 4 documents identified',
  '→ Extracting KPIs...',
  '✓ ARR: $12.4M',
  '✓ Burn: $450K/mo',
  '→ Running market map agent...',
  '⚠ Red flag: customer concentration',
  '→ Audit synthesis...',
  '✓ Diligence score: 7.8 / 10',
  '→ Recommendation: INVEST',
];

const CHAR_MS = 25;
const BETWEEN_LINES_MS = 400;
const LOOP_GAP_MS = 3000;

function lineColorClass(line) {
  if (line.startsWith('→ Recommendation:')) return 'text-white font-bold';
  if (line.startsWith('$')) return 'text-slate-500';
  if (line.startsWith('→')) return 'text-blue-400';
  if (line.startsWith('✓')) return 'text-green-400';
  if (line.startsWith('⚠')) return 'text-amber-400';
  return 'text-slate-300';
}

function strokeForScore(score) {
  const t = Math.min(1, Math.max(0, score / 10));
  const r1 = 239 + (16 - 239) * t;
  const g1 = 68 + (185 - 68) * t;
  const b1 = 68 + (129 - 68) * t;
  const r2 = 16 + (52 - 16) * t * t;
  const g2 = 185 + (211 - 185) * t * t;
  const b2 = 129 + (153 - 129) * t * t;
  return `rgb(${Math.round(r1 + (r2 - r1) * t)}, ${Math.round(g1 + (g2 - g1) * t)}, ${Math.round(b1 + (b2 - b1) * t)})`;
}

function MiniKpi({ label, formatValue, show, target }) {
  const [val, setVal] = useState(0);
  const rafRef = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!show) {
      setVal(0);
      return undefined;
    }
    if (reduce) {
      setVal(target);
      return undefined;
    }
    const start = performance.now();
    const dur = 600;
    const tick = (now) => {
      const u = Math.min(1, (now - start) / dur);
      const eased = 1 - (1 - u) ** 2;
      setVal(target * eased);
      if (u < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [show, target, reduce]);

  if (!show) return null;

  return (
    <motion.div
      key={`${label}-on`}
      className="flex items-center justify-between text-xs border border-slate-700/50 rounded-lg px-2.5 py-2 bg-slate-950/40"
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <span className="text-slate-500 font-mono">{label}</span>
      <span className="text-slate-100 font-mono-data font-mono tabular-nums">{formatValue(val)}</span>
    </motion.div>
  );
}

function ScoreGauge({ animated, filled, reduce }) {
  const r = 34;
  const c = 2 * Math.PI * r;
  const [score, setScore] = useState(0);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (reduce) {
      setScore(7.8);
      controlsRef.current?.stop();
      controlsRef.current = null;
      return undefined;
    }
    if (animated) {
      controlsRef.current?.stop();
      setScore(0);
      controlsRef.current = animate(0, 7.8, {
        duration: 0.8,
        ease: 'easeOut',
        onUpdate: (v) => setScore(v),
      });
      return () => {
        controlsRef.current?.stop();
        controlsRef.current = null;
      };
    }
    if (filled) {
      controlsRef.current?.stop();
      controlsRef.current = null;
      setScore(7.8);
      return undefined;
    }
    controlsRef.current?.stop();
    controlsRef.current = null;
    setScore(0);
    return undefined;
  }, [animated, filled, reduce]);

  const pct = Math.min(1, Math.max(0, score / 10));
  const offset = c * (1 - pct);
  const stroke = strokeForScore(score);

  return (
    <div className="flex items-center gap-3">
      <svg width={80} height={80} viewBox="0 0 80 80" className="shrink-0 -rotate-90" aria-hidden>
        <circle cx={40} cy={40} r={r} fill="none" stroke="rgba(51,65,85,0.6)" strokeWidth={6} />
        <circle
          cx={40}
          cy={40}
          r={r}
          fill="none"
          stroke={stroke}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-wider text-slate-500">Diligence score</span>
        <span className="text-xl font-semibold text-slate-100 font-mono-data font-mono tabular-nums leading-none">
          {score.toFixed(1)}
          <span className="text-slate-500 text-sm font-normal"> / 10</span>
        </span>
      </div>
    </div>
  );
}

export default function HeroTerminalDashboard() {
  const reduce = useReducedMotion();
  const [completed, setCompleted] = useState([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [partial, setPartial] = useState('');
  const timersRef = useRef([]);

  const terminalLines = useMemo(() => {
    const cap = partial ? 9 : 10;
    const base = completed.slice(-cap);
    if (partial) return [...base, partial];
    return base;
  }, [completed, partial]);

  const hasArr = completed.some((l) => l.startsWith('✓ ARR:'));
  const hasBurn = completed.some((l) => l.startsWith('✓ Burn:'));
  const hasRed = completed.some((l) => l.startsWith('⚠ Red flag'));
  const gaugeAnimated = activeIdx === 9 && partial.length >= 1;
  const hasScoreLine = completed.some((l) => l.includes('Diligence score:'));
  const hasReco = completed.some((l) => l.startsWith('→ Recommendation:'));

  useEffect(() => {
    if (reduce) {
      setCompleted([...SCRIPT]);
      setActiveIdx(SCRIPT.length);
      setPartial('');
      return undefined;
    }

    timersRef.current = [];
    const timers = timersRef.current;
    let cancelled = false;

    const clearTimers = () => {
      while (timers.length) clearTimeout(timers.pop());
    };

    const after = (fn, ms) => {
      const id = setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.push(id);
    };

    function finishLine(lineIdx, fullText) {
      if (cancelled) return;
      setCompleted((prev) => [...prev, fullText].slice(-10));
      setPartial('');
      after(() => startLine(lineIdx + 1), BETWEEN_LINES_MS);
    }

    function typeLine(lineIdx, charIdx) {
      if (cancelled) return;
      const full = SCRIPT[lineIdx];
      setActiveIdx(lineIdx);
      if (charIdx < full.length) {
        setPartial(full.slice(0, charIdx + 1));
        after(() => typeLine(lineIdx, charIdx + 1), CHAR_MS);
      } else {
        finishLine(lineIdx, full);
      }
    }

    function startLine(lineIdx) {
      if (cancelled) return;
      if (lineIdx >= SCRIPT.length) {
        after(() => {
          if (cancelled) return;
          setCompleted([]);
          setActiveIdx(0);
          setPartial('');
          startLine(0);
        }, LOOP_GAP_MS);
        return;
      }
      typeLine(lineIdx, 0);
    }

    clearTimers();
    setCompleted([]);
    setActiveIdx(0);
    setPartial('');
    startLine(0);

    return () => {
      cancelled = true;
      clearTimers();
    };
  }, [reduce]);

  return (
    <div className="w-full max-w-[480px] mx-auto lg:mx-0 pointer-events-none scale-[0.95] lg:scale-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Terminal */}
        <div className="rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 overflow-hidden flex flex-col min-h-[220px] md:min-h-[260px]">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-slate-700/40 pointer-events-auto">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-600" />
          </div>
          <div className="flex-1 p-3 font-mono text-[11px] sm:text-xs leading-relaxed overflow-hidden flex flex-col justify-end text-left">
            {terminalLines.map((line, i) => {
              const isTypingRow = partial && i === terminalLines.length - 1 && line === partial;
              return (
                <div key={`${i}-${line.slice(0, 24)}`} className={`${lineColorClass(line)} break-words`}>
                  {line}
                  {isTypingRow && !reduce ? (
                    <span className="inline-block w-2 h-3 ml-0.5 align-[-2px] bg-slate-300 animate-pulse" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dashboard */}
        <div className="rounded-xl bg-slate-900/80 backdrop-blur-sm border border-slate-700/50 p-3 flex flex-col gap-3 min-h-[220px] md:min-h-[260px]">
          <div className="flex items-center gap-2">
            <span className="text-slate-100 font-medium text-sm">Acme Corp</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden />
          </div>
          <div className="h-px bg-slate-700/50" />

          <ScoreGauge
            animated={gaugeAnimated && !reduce}
            filled={hasScoreLine || !!reduce}
            reduce={!!reduce}
          />

          <div className="grid grid-cols-1 gap-2">
            <MiniKpi
              label="ARR"
              target={12.4}
              show={hasArr || !!reduce}
              formatValue={(v) => `$${v.toFixed(1)}M`}
            />
            <MiniKpi
              label="Burn"
              target={450}
              show={hasBurn || !!reduce}
              formatValue={(v) => `$${Math.round(v)}K/mo`}
            />
          </div>

          {(hasRed || reduce) && (
            <motion.div
              className="text-xs font-medium text-red-400 border border-red-500/50 rounded-lg px-2.5 py-1.5 text-center"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              ⚠ Customer concentration
            </motion.div>
          )}

          <div className="flex-1 min-h-[4px]" />

          <motion.div
            className="rounded-xl bg-emerald-600 text-white font-bold text-center py-2.5 text-sm shadow-lg shadow-emerald-900/20"
            initial={reduce ? false : { scale: 0.8, opacity: 0 }}
            animate={hasReco || reduce ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
          >
            INVEST
          </motion.div>
        </div>
      </div>
    </div>
  );
}
