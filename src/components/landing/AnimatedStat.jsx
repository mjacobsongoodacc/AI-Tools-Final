import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion, animate } from 'framer-motion';

function isCountableNumeric(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return true;
  if (typeof value === 'string') return /^\d+(\.\d+)?$/.test(value.trim());
  return false;
}

export default function AnimatedStat({ value, label, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(0);
  const numeric = isCountableNumeric(value);
  const targetNum = numeric ? Number(value) : 0;

  useEffect(() => {
    if (!numeric) return undefined;
    if (reduceMotion) {
      setDisplay(targetNum);
      return undefined;
    }
    if (!isInView) return undefined;
    const controls = animate(0, targetNum, {
      duration: 1.4,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [isInView, numeric, targetNum, reduceMotion]);

  const numberText = numeric
    ? Number.isInteger(targetNum)
      ? Math.round(display).toString()
      : display.toFixed(1)
    : String(value);

  if (!numeric) {
    return (
      <motion.div
        ref={ref}
        className="text-center"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={
          reduceMotion ? { opacity: 1, y: 0 } : isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
        }
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
          {value}
          {suffix}
        </p>
        <p className="text-bone-40 text-sm">{label}</p>
      </motion.div>
    );
  }

  return (
    <div ref={ref} className="text-center">
      <p className="text-2xl sm:text-3xl font-bold text-white mb-1">
        {numberText}
        {suffix}
      </p>
      <p className="text-bone-40 text-sm">{label}</p>
    </div>
  );
}
