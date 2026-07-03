import React from "react";
import { Flame, Beef, Wheat, Droplet } from "lucide-react";
import { COLOR_HEX } from "../data/healthFacts";

export default function NutrientGrid() {
  const items = [
    {
      icon: Flame,
      key: "cal",
      title: "Calories",
      body: "The energy unit for everything your body does. A sustained surplus or deficit is what shifts the scale.",
      accent: COLOR_HEX.citrus,
      bg: "var(--citrus-bg)",
    },
    {
      icon: Beef,
      key: "pro",
      title: "Protein",
      body: "Repairs and builds muscle, skin, hormones and enzymes — roughly 0.8–1.6g per kg bodyweight daily.",
      accent: COLOR_HEX.berry,
      bg: "var(--berry-bg)",
    },
    {
      icon: Wheat,
      key: "fib",
      title: "Fiber",
      body: "Slows digestion, steadies blood sugar and feeds gut bacteria. Target 25–38g a day.",
      accent: COLOR_HEX.leaf,
      bg: "var(--leaf-bg)",
    },
    {
      icon: Droplet,
      key: "fat",
      title: "Fat",
      body: "The most calorie-dense nutrient at 9 kcal/g, and essential for absorbing vitamins A, D, E and K.",
      accent: COLOR_HEX.sky,
      bg: "var(--sky-bg)",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map(({ icon: Icon, key, title, body, accent, bg }) => (
        <div
          key={key}
          className="relative overflow-hidden rounded-2xl p-5 bg-white"
          style={{ border: "1px solid var(--line)" }}
        >
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-3.5"
            style={{ background: bg, color: accent }}
          >
            <Icon size={20} strokeWidth={2.2} />
          </div>
          <h3 className="f-display text-[20px] font-semibold mb-1.5">{title}</h3>
          <p className="text-[13.5px]" style={{ color: "var(--ink-soft)" }}>
            {body}
          </p>
          <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-50" style={{ background: bg }} />
        </div>
      ))}
    </div>
  );
}
