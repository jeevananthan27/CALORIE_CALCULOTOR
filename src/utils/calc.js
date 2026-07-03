import { COLOR_HEX } from "../data/healthFacts";

export const Calc = {
  bmi(weightKg, heightCm) {
    const h = heightCm / 100;
    return weightKg / (h * h);
  },
  bmiCategory(bmi) {
    if (bmi < 18.5) return { label: "Underweight", color: COLOR_HEX.sky };
    if (bmi < 25) return { label: "Healthy range", color: COLOR_HEX.leaf };
    if (bmi < 30) return { label: "Overweight", color: COLOR_HEX.citrus };
    return { label: "Obesity range", color: COLOR_HEX.berry };
  },
  bmr({ sex, weightKg, heightCm, age }) {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    return sex === "male" ? base + 5 : base - 161;
  },
  activityFactor(level) {
    return { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, athlete: 1.9 }[level] || 1.2;
  },
  idealWeightRangeKg(heightCm) {
    const h = heightCm / 100;
    return { low: 18.5 * h * h, high: 24.9 * h * h };
  },
  lbToKg: (lb) => lb * 0.453592,
  kgToLb: (kg) => kg / 0.453592,
  cmFromFtIn: (ft, inch) => (ft * 12 + inch) * 2.54,
};

export const fmt = (n, d = 0) =>
  (isFinite(n) ? n : 0).toLocaleString(undefined, {
    maximumFractionDigits: d,
    minimumFractionDigits: d,
  });
