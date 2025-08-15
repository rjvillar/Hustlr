import React, { useEffect, useRef, useState } from "react";
import { useMotionValue, animate, useReducedMotion } from "framer-motion";

export default function AnimatedNumber({
  value,
  duration = 1.2,
  delay = 0,
  decimals = 0,
  spring = true,
}) {
  const prefersReducedMotion = useReducedMotion();
  const count = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  const mounted = useRef(false);

  const format = (n) =>
    Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    });

  useEffect(() => {
    if (prefersReducedMotion) {
      count.set(value);
      setDisplay(format(value));
      return;
    }

    if (!mounted.current) {
      count.set(0);
      mounted.current = true;
    }

    const config = spring
      ? {
          type: "spring",
          stiffness: 130,
          damping: 22,
          mass: 0.8,
          velocity: 2,
          restDelta: 0.01,
          restSpeed: 0.01,
          delay,
          onUpdate: (latest) => setDisplay(format(Math.round(latest))),
        }
      : {
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
          onUpdate: (latest) => setDisplay(format(Math.round(latest))),
        };

    const controls = animate(count, value, config);
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, prefersReducedMotion, delay, duration, spring, decimals]);

  return <span>{display}</span>;
}
