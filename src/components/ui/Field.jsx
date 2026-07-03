import React from "react";

export const inputCls = "w-full px-3.5 py-3 rounded-lg text-[15px] outline-none transition-colors";

export const inputStyle = {
  background: "var(--paper)",
  border: "1.5px solid var(--line)",
  color: "var(--ink)"
};

export default function Field({ label, children }) {
  return (
    <div className="mb-4">
      <label className="block f-mono text-[12px] uppercase tracking-[0.08em] mb-1.5" style={{ color: "var(--ink-soft)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
