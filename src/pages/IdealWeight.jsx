import React, { useState } from "react";
import { Calc, fmt } from "../utils/calc";
import Field, { inputCls, inputStyle } from "../components/ui/Field";
import Seg from "../components/ui/Seg";

export default function IdealWeight() {
  const [unit, setUnit] = useState("metric");
  const [heightCm, setHeightCm] = useState(170);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(7);
  const [frame, setFrame] = useState(1);

  const hCm = unit === "metric" ? heightCm : Calc.cmFromFtIn(ft, inch);
  const range = hCm > 0 ? Calc.idealWeightRangeKg(hCm) : { low: 0, high: 0 };
  let low = range.low * frame,
    high = range.high * frame;
  if (unit === "imperial") {
    low = Calc.kgToLb(low);
    high = Calc.kgToLb(high);
  }
  const unitLabel = unit === "metric" ? "kg" : "lb";

  return (
    <div
      className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]"
      style={{ border: "1px solid var(--line)", boxShadow: "0 20px 60px -20px rgba(28,43,30,0.45)" }}
    >
      <div className="bg-white p-7 sm:p-9">
        <Field label="Units">
          <Seg
            options={[
              { value: "metric", label: "Metric" },
              { value: "imperial", label: "Imperial" },
            ]}
            value={unit}
            onChange={setUnit}
          />
        </Field>
        {unit === "metric" ? (
          <Field label="Height (cm)">
            <input
              type="number"
              className={inputCls}
              style={inputStyle}
              value={heightCm}
              onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
            />
          </Field>
        ) : (
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Height (ft)">
              <input
                type="number"
                className={inputCls}
                style={inputStyle}
                value={ft}
                onChange={(e) => setFt(parseFloat(e.target.value) || 0)}
              />
            </Field>
            <Field label="Height (in)">
              <input
                type="number"
                className={inputCls}
                style={inputStyle}
                value={inch}
                onChange={(e) => setInch(parseFloat(e.target.value) || 0)}
              />
            </Field>
          </div>
        )}
        <Field label="Body frame">
          <select className={inputCls} style={inputStyle} value={frame} onChange={(e) => setFrame(parseFloat(e.target.value))}>
            <option value={1}>Standard</option>
            <option value={0.94}>Small frame (−6%)</option>
            <option value={1.06}>Large frame (+6%)</option>
          </select>
        </Field>
        <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>
          Frame size is a rough nudge only — wrist/elbow measurements give a more precise estimate.
        </p>
      </div>
      <div className="p-7 sm:p-9" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <span className="f-mono text-[12px] uppercase tracking-[0.1em] opacity-70">Healthy weight range</span>
        <div className="f-display font-bold leading-none mt-1 mb-6" style={{ fontSize: 38 }}>
          {hCm > 0 ? `${fmt(low, unit === "metric" ? 1 : 0)}–${fmt(high, unit === "metric" ? 1 : 0)} ${unitLabel}` : "—"}
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <div className="flex justify-between f-mono text-[12.5px] mb-1.5">
              <span>Lower bound (BMI 18.5)</span>
              <span>
                {fmt(low, unit === "metric" ? 1 : 0)} {unitLabel}
              </span>
            </div>
            <div className="h-2.5 rounded-full" style={{ background: "#9BCB93" }} />
          </div>
          <div>
            <div className="flex justify-between f-mono text-[12.5px] mb-1.5">
              <span>Upper bound (BMI 24.9)</span>
              <span>
                {fmt(high, unit === "metric" ? 1 : 0)} {unitLabel}
              </span>
            </div>
            <div className="h-2.5 rounded-full" style={{ background: "#E4C98B" }} />
          </div>
        </div>
        <p className="text-[12.5px] opacity-80 mt-6 leading-relaxed">
          Based on the healthy BMI band (18.5–24.9), scaled to your height and frame adjustment.
        </p>
      </div>
    </div>
  );
}
