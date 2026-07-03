import React, { useState, useEffect } from "react";
import { HEALTH_FACTS, COLOR_HEX } from "../data/healthFacts";

export default function RotatingBanner() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % HEALTH_FACTS.length), 4200);
    return () => clearInterval(t);
  }, [paused]);

  const fact = HEALTH_FACTS[idx];
  const hex = COLOR_HEX[fact.color];

  return (
    <div
      className="w-full text-[color:var(--paper)] overflow-hidden"
      style={{ background: "var(--ink)", perspective: "800px" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-6xl mx-auto px-5 h-11 flex items-center justify-between gap-4">
        <div
          key={idx}
          className="banner-flip f-mono text-[12.5px] sm:text-[13px] flex items-baseline gap-2 truncate"
          style={{ transformOrigin: "center top" }}
        >
          <span className="f-display italic font-semibold" style={{ color: hex }}>
            {fact.k}
          </span>
          <span className="opacity-80 truncate">— {fact.v}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 shrink-0">
          {HEALTH_FACTS.map((f, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Show ${f.k} tip`}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background: i === idx ? "var(--citrus)" : "rgba(243,241,228,0.3)",
                width: i === idx ? "16px" : "6px",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
