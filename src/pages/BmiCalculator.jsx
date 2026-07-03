import React, { useState } from "react";
import { Calc } from "../utils/calc";
import { COLOR_HEX } from "../data/healthFacts";
import Field, { inputCls, inputStyle } from "../components/ui/Field";
import Seg from "../components/ui/Seg";

export default function BmiCalculator() {
  const [unit, setUnit] = useState("metric");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(7);
  const [lb, setLb] = useState(154);

  const hCm = unit === "metric" ? heightCm : Calc.cmFromFtIn(ft, inch);
  const wKg = unit === "metric" ? weightKg : Calc.lbToKg(lb);
  const bmi = hCm > 0 && wKg > 0 ? Calc.bmi(wKg, hCm) : 0;
  const cat = Calc.bmiCategory(bmi);
  const clamped = Math.min(40, Math.max(15, bmi || 15));
  const pointerX = ((clamped - 15) / (40 - 15)) * 300;

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
          <div className="grid grid-cols-2 gap-3.5">
            <Field label="Height (cm)">
              <input
                type="number"
                className={inputCls}
                style={inputStyle}
                value={heightCm}
                onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
              />
            </Field>
            <Field label="Weight (kg)">
              <input
                type="number"
                className={inputCls}
                style={inputStyle}
                value={weightKg}
                onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
              />
            </Field>
          </div>
        ) : (
          <>
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
            <Field label="Weight (lb)">
              <input
                type="number"
                className={inputCls}
                style={inputStyle}
                value={lb}
                onChange={(e) => setLb(parseFloat(e.target.value) || 0)}
              />
            </Field>
          </>
        )}
        <p className="text-[12px] mt-2" style={{ color: "var(--ink-soft)" }}>
          Screening estimate only. BMI does not distinguish between muscle and fat mass.
        </p>
      </div>
      <div className="p-7 sm:p-9" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <span className="f-mono text-[12px] uppercase tracking-[0.1em] opacity-70">Your BMI</span>
        <div className="f-display font-bold leading-none mt-1 mb-2" style={{ fontSize: 52 }}>
          {bmi ? bmi.toFixed(1) : "—"}
        </div>
        <span
          className="inline-block px-4 py-1.5 rounded-full f-mono text-[12.5px] font-semibold"
          style={{ background: cat.color, color: "#fff" }}
        >
          {bmi ? cat.label : "Enter your details"}
        </span>

        <svg viewBox="0 0 300 46" width="100%" height="46" className="mt-7">
          <rect x="0" y="16" width="90" height="14" rx="7" fill={COLOR_HEX.sky} />
          <rect x="90" y="16" width="80" height="14" fill={COLOR_HEX.leaf} />
          <rect x="170" y="16" width="60" height="14" fill={COLOR_HEX.citrus} />
          <rect x="230" y="16" width="70" height="14" rx="7" fill={COLOR_HEX.berry} />
          <circle cx={pointerX} cy="23" r="9" fill="#fff" stroke="var(--ink)" strokeWidth="3" />
        </svg>
        <div className="flex justify-between f-mono text-[10.5px] opacity-70 mt-1.5">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
        <p className="text-[12.5px] opacity-80 mt-5 leading-relaxed">
          Underweight &lt;18.5 · Healthy 18.5–24.9 · Overweight 25–29.9 · Obesity 30+
        </p>
      </div>
    </div>
  );
}
