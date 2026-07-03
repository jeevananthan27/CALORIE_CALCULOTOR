import React from "react";

export default function Seg({ options, value, onChange }) {
  return (
    <div className="inline-flex rounded-full overflow-hidden" style={{ border: "1.5px solid var(--ink)" }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className="px-4 py-2 text-[13px] font-semibold"
          style={
            value === o.value
              ? { background: "var(--ink)", color: "var(--paper)" }
              : { background: "transparent", color: "var(--ink)" }
          }
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
