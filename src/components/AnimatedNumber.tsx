import React, { useEffect, useRef, useState } from "react";

interface Props {
  value: number;
  duration?: number;
}

export default function AnimatedNumber({ value, duration = 800 }: Props) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef<number | null>(null);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = performance.now();
    startRef.current = start;
    const from = prevValue.current;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setDisplay(from + (value - from) * progress);
      if (progress < 1) requestAnimationFrame(animate);
      else prevValue.current = value;
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{Math.round(display).toLocaleString()}</span>;
}
