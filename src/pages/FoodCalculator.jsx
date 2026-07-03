import React, { useState, useMemo } from "react";
import { Plus, Trash2 } from "lucide-react";
import { FOOD_DB } from "../data/foodDb";
import Field, { inputCls, inputStyle } from "../components/ui/Field";
import Donut from "../components/Donut";
import { fmt } from "../utils/calc";

export default function FoodCalculator() {
  const sortedFoods = useMemo(() => [...FOOD_DB].sort((a, b) => a.n.localeCompare(b.n)), []);
  const [selected, setSelected] = useState(sortedFoods[0]?.n || "");
  const [grams, setGrams] = useState(100);
  const [servings, setServings] = useState(1);
  const [log, setLog] = useState([]);

  const addFood = () => {
    const food = FOOD_DB.find((f) => f.n === selected);
    if (!food) return;
    const totalGrams = Math.max(1, grams) * Math.max(1, servings);
    const factor = totalGrams / 100;
    setLog((l) => [
      ...l,
      {
        id: Date.now() + Math.random(),
        name: food.n,
        grams: totalGrams,
        cal: food.cal * factor,
        p: food.p * factor,
        f: food.f * factor,
        c: food.c * factor,
        fib: food.fib * factor,
      },
    ]);
  };

  const removeFood = (id) => setLog((l) => l.filter((i) => i.id !== id));

  const totals = log.reduce(
    (a, i) => ({
      cal: a.cal + i.cal,
      p: a.p + i.p,
      f: a.f + i.f,
      c: a.c + i.c,
      fib: a.fib + i.fib,
    }),
    { cal: 0, p: 0, f: 0, c: 0, fib: 0 }
  );

  const ref = { p: 90, f: 70, c: 250, fib: 30 };
  const proCal = totals.p * 4;
  const fatCal = totals.f * 9;
  const carbCal = totals.c * 4;
  const calSum = proCal + fatCal + carbCal;
  const segs = calSum
    ? [
        { pct: (proCal / calSum) * 100, color: "#E7A9B8" },
        { pct: (fatCal / calSum) * 100, color: "#8FC0DA" },
        { pct: (carbCal / calSum) * 100, color: "#E4C98B" },
      ]
    : [];

  return (
    <div
      className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr]"
      style={{ border: "1px solid var(--line)", boxShadow: "0 20px 60px -20px rgba(28,43,30,0.45)" }}
    >
      <div className="bg-white p-7 sm:p-9">
        <Field label="Food">
          <select className={inputCls} style={inputStyle} value={selected} onChange={(e) => setSelected(e.target.value)}>
            {sortedFoods.map((f) => (
              <option key={f.n} value={f.n}>
                {f.n}
              </option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-[1fr_100px_46px] gap-2.5 items-end mb-2">
          <Field label="Amount (grams)">
            <input
              type="number"
              min="1"
              className={inputCls}
              style={inputStyle}
              value={grams}
              onChange={(e) => setGrams(parseFloat(e.target.value) || 0)}
            />
          </Field>
          <Field label="Servings">
            <input
              type="number"
              min="1"
              className={inputCls}
              style={inputStyle}
              value={servings}
              onChange={(e) => setServings(parseFloat(e.target.value) || 0)}
            />
          </Field>
          <button
            onClick={addFood}
            className="h-[46px] w-[46px] rounded-lg flex items-center justify-center font-bold"
            style={{ background: "var(--citrus)", border: "1.5px solid var(--ink)", color: "#2a1804" }}
            aria-label="Add food"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        {log.length === 0 ? (
          <div
            className="mt-4 p-5 text-center text-[13.5px] rounded-lg"
            style={{ border: "1.5px dashed var(--line)", color: "var(--ink-soft)" }}
          >
            No food logged yet — add your first item above.
          </div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-[13.5px] border-collapse">
              <thead>
                <tr className="f-mono text-[11px] uppercase tracking-wide" style={{ color: "var(--ink-soft)" }}>
                  <th className="text-left py-2 border-b" style={{ borderColor: "var(--line)" }}>
                    Food
                  </th>
                  <th className="text-left py-2 border-b" style={{ borderColor: "var(--line)" }}>
                    Amt
                  </th>
                  <th className="text-left py-2 border-b" style={{ borderColor: "var(--line)" }}>
                    Kcal
                  </th>
                  <th className="text-left py-2 border-b" style={{ borderColor: "var(--line)" }}>
                    P
                  </th>
                  <th className="text-left py-2 border-b" style={{ borderColor: "var(--line)" }}>
                    F
                  </th>
                  <th className="text-left py-2 border-b" style={{ borderColor: "var(--line)" }}>
                    C
                  </th>
                  <th className="text-left py-2 border-b" style={{ borderColor: "var(--line)" }}>
                    Fib
                  </th>
                  <th className="border-b" style={{ borderColor: "var(--line)" }}></th>
                </tr>
              </thead>
              <tbody>
                {log.map((item) => (
                  <tr key={item.id}>
                    <td className="py-2 border-b" style={{ borderColor: "var(--paper-dim)" }}>
                      {item.name}
                    </td>
                    <td className="py-2 border-b" style={{ borderColor: "var(--paper-dim)" }}>
                      {fmt(item.grams)}g
                    </td>
                    <td className="py-2 border-b" style={{ borderColor: "var(--paper-dim)" }}>
                      {fmt(item.cal)}
                    </td>
                    <td className="py-2 border-b" style={{ borderColor: "var(--paper-dim)" }}>
                      {fmt(item.p, 1)}g
                    </td>
                    <td className="py-2 border-b" style={{ borderColor: "var(--paper-dim)" }}>
                      {fmt(item.f, 1)}g
                    </td>
                    <td className="py-2 border-b" style={{ borderColor: "var(--paper-dim)" }}>
                      {fmt(item.c, 1)}g
                    </td>
                    <td className="py-2 border-b" style={{ borderColor: "var(--paper-dim)" }}>
                      {fmt(item.fib, 1)}g
                    </td>
                    <td className="py-2 border-b text-right" style={{ borderColor: "var(--paper-dim)" }}>
                      <button onClick={() => removeFood(item.id)} aria-label={`Remove ${item.name}`} style={{ color: "var(--berry)" }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-[12px] mt-4 leading-relaxed" style={{ color: "var(--ink-soft)" }}>
          Values are typical per-100g averages for everyday estimation, not clinical or medical use.
        </p>
      </div>

      <div className="p-7 sm:p-9" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <span className="f-mono text-[12px] uppercase tracking-[0.1em] opacity-70">Total for this log</span>
        <div className="f-display font-bold leading-none mt-1 mb-1" style={{ fontSize: 52 }}>
          {fmt(totals.cal)}
          <span className="f-mono font-normal text-[16px] opacity-70 ml-1.5">kcal</span>
        </div>

        <div className="flex flex-col gap-3.5 mt-6">
          {[
            { label: "Protein", val: totals.p, refv: ref.p, color: "#E7A9B8" },
            { label: "Fat", val: totals.f, refv: ref.f, color: "#8FC0DA" },
            { label: "Carbs", val: totals.c, refv: ref.c, color: "#E4C98B" },
            { label: "Fiber", val: totals.fib, refv: ref.fib, color: "#9BCB93" },
          ].map((row) => (
            <div key={row.label}>
              <div className="flex justify-between f-mono text-[12.5px] mb-1.5">
                <span>{row.label}</span>
                <span>{fmt(row.val, 1)}g</span>
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(243,241,228,0.14)" }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (row.val / row.refv) * 100)}%`, background: row.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-5 mt-7">
          <Donut segments={segs} />
          <ul className="f-mono text-[12px] flex flex-col gap-2">
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#E7A9B8" }} /> Protein{" "}
              {fmt(segs[0]?.pct || 0)}%
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#8FC0DA" }} /> Fat{" "}
              {fmt(segs[1]?.pct || 0)}%
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#E4C98B" }} /> Carbs{" "}
              {fmt(segs[2]?.pct || 0)}%
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
