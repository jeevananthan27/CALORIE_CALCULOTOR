import React from "react";

export default function Eyebrow({ children }) {
  return (
    <span className="f-mono text-[12px] tracking-[0.14em] uppercase inline-flex items-center gap-2" style={{ color: "var(--ink-soft)" }}>
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "var(--citrus)" }} />
      {children}
    </span>
  );
}
