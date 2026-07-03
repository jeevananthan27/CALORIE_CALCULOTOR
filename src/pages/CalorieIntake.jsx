import React, { useState } from "react";
import { Calc, fmt } from "../utils/calc";
import Field, { inputCls, inputStyle } from "../components/ui/Field";
import Seg from "../components/ui/Seg";

export default function CalorieIntake() {
  const [sex, setSex] = useState("male");
  const [age, setAge] = useState(28);
  const [unit, setUnit] = useState("metric");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [ft, setFt] = useState(5);
  const [inch, setInch] = useState(7);
  const [lb, setLb] = useState(154);
  const [activity, setActivity] = useState("moderate");

  const hCm = unit === "metric" ? heightCm : Calc.cmFromFtIn(ft, inch);
  const wKg = unit === "metric" ? weightKg : Calc.lbToKg(lb);
  const bmr = age > 0 && hCm > 0 && wKg > 0 ? Calc.bmr({ sex, weightKg: wKg, heightCm: hCm, age }) : 0;
  const tdee = bmr * Calc.activityFactor(activity);

  return (
    <div
      className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]"
      style={{ border: "1px solid var(--line)", boxShadow: "0 20px 60px -20px rgba(28,43,30,0.45)" }}
    >
      <div className="bg-white p-7 sm:p-9">
        <Field label="Sex">
          <Seg
            options={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            value={sex}
            onChange={setSex}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3.5">
          <Field label="Age (years)">
            <input
              type="number"
              className={inputCls}
              style={inputStyle}
              value={age}
              onChange={(e) => setAge(parseFloat(e.target.value) || 0)}
            />
          </Field>
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
        </div>
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
        <Field label="Activity level">
          <select className={inputCls} style={inputStyle} value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="sedentary">Sedentary — little or no exercise</option>
            <option value="light">Light — exercise 1–3 days/week</option>
            <option value="moderate">Moderate — exercise 3–5 days/week</option>
            <option value="active">Active — exercise 6–7 days/week</option>
            <option value="athlete">Athlete — hard daily training</option>
          </select>
        </Field>
        <p className="text-[12px]" style={{ color: "var(--ink-soft)" }}>
          Estimate only — real metabolism varies with genetics, muscle mass and health conditions.
        </p>
      </div>
      <div className="p-7 sm:p-9" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <span className="f-mono text-[12px] uppercase tracking-[0.1em] opacity-70">Maintenance calories</span>
        <div className="f-display font-bold leading-none mt-1 mb-6" style={{ fontSize: 52 }}>
          {fmt(tdee)}
          <span className="f-mono font-normal text-[16px] opacity-70 ml-1.5">kcal/day</span>
        </div>
        <div className="flex flex-col gap-3 f-mono text-[12.5px]">
          <div className="flex justify-between">
            <span>Mild weight loss (−0.25 kg/wk)</span>
            <span>{fmt(tdee - 250)} kcal</span>
          </div>
          <div className="flex justify-between">
            <span>Weight loss (−0.5 kg/wk)</span>
            <span>{fmt(tdee - 500)} kcal</span>
          </div>
          <div className="flex justify-between">
            <span>Mild weight gain (+0.25 kg/wk)</span>
            <span>{fmt(tdee + 250)} kcal</span>
          </div>
          <div className="flex justify-between">
            <span>Weight gain (+0.5 kg/wk)</span>
            <span>{fmt(tdee + 500)} kcal</span>
          </div>
        </div>
        <p className="text-[12.5px] opacity-80 mt-6 leading-relaxed">
          Based on BMR (Mifflin-St Jeor) × activity factor. A 500 kcal/day change roughly corresponds to 0.5 kg per week.
        </p>
      </div>
    </div>
  );
}
