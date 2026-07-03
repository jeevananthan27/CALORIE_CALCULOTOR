import React, { useState } from "react";
import { Menu, X, ArrowRight } from "lucide-react";

import HeroOrb from "./components/HeroOrb";
import RotatingBanner from "./components/RotatingBanner";
import WaveDivider from "./components/WaveDivider";
import NutrientGrid from "./components/NutrientGrid";
import Eyebrow from "./components/ui/Eyebrow";

import FoodCalculator from "./pages/FoodCalculator";
import AiNutritionLog from "./pages/AiNutritionLog";
import CalorieIntake from "./pages/CalorieIntake";
import BmiCalculator from "./pages/BmiCalculator";
import IdealWeight from "./pages/IdealWeight";

const PAGES = [
  { id: "food", label: "Food Calculator" },
  { id: "ai", label: "AI Nutrition Log" },
  { id: "intake", label: "Daily Calorie Intake" },
  { id: "bmi", label: "BMI Calculator" },
  { id: "ideal", label: "Ideal Weight" },
];

export default function App() {
  const [page, setPage] = useState("food");
  const [menuOpen, setMenuOpen] = useState(false);

  const heroCopy = {
    food: {
      eyebrow: "Food · Calorie · Macro Calculator",
      title: (
        <>
          Know exactly what
          <br />
          you just <em>ate</em>.
        </>
      ),
      lede: "Pick a food, set the portion, and watch calories, protein, fat, carbs and fiber total up in real time.",
    },
    ai: {
      eyebrow: "AI Assistant · Natural Language Diary",
      title: (
        <>
          Tell the AI what
          <br />
          you had to <em>eat</em>.
        </>
      ),
      lede: "Type a descriptive paragraph of your breakfast, lunch or dinner. The AI will estimate your calorie, macro, and micro-nutrient intake instantly.",
    },
    intake: {
      eyebrow: "Daily Calorie Intake · TDEE",
      title: (
        <>
          How many calories
          <br />
          should <em>you</em> eat?
        </>
      ),
      lede: "Mifflin-St Jeor BMR × activity level, with maintain / lose / gain targets.",
    },
    bmi: {
      eyebrow: "Body Mass Index",
      title: (
        <>
          Where does your
          <br />
          <em>BMI</em> sit?
        </>
      ),
      lede: "A fast screening ratio of weight to height, with a visual gauge across the standard bands.",
    },
    ideal: {
      eyebrow: "Healthy Weight Range",
      title: (
        <>
          What's a healthy
          <br />
          weight for <em>you</em>?
        </>
      ),
      lede: "The weight range that keeps you inside the 18.5–24.9 healthy BMI band for your height.",
    },
  }[page];

  return (
    <div className="nl-root min-h-screen">
      <RotatingBanner />

      {/* NAV */}
      <nav
        className="sticky top-0 z-40"
        style={{
          background: "rgba(243, 241, 228, 0.88)",
          backdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
          <button onClick={() => setPage("food")} className="f-display italic font-semibold text-[22px] flex items-center gap-3">
            <img src="/gym_logo.jpg" alt="Nutrient Lab Logo" className="w-9 h-9 rounded-lg object-contain" />
            Nutrient Lab
          </button>
          <ul className="hidden md:flex gap-1">
            {PAGES.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => setPage(p.id)}
                  className="text-[14px] font-medium px-3.5 py-2 rounded-full transition-colors"
                  style={
                    page === p.id
                      ? { background: "var(--ink)", color: "var(--paper)" }
                      : { color: "var(--ink-soft)" }
                  }
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
          <button
            className="md:hidden w-10 h-9 rounded-lg flex items-center justify-center"
            style={{ border: "1.5px solid var(--ink)" }}
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {menuOpen && (
          <ul className="md:hidden flex flex-col gap-1 px-5 pb-4" style={{ borderBottom: "1px solid var(--line)" }}>
            {PAGES.map((p) => (
              <li key={p.id}>
                <button
                  onClick={() => {
                    setPage(p.id);
                    setMenuOpen(false);
                  }}
                  className="w-full text-left text-[14.5px] font-medium px-3.5 py-2.5 rounded-lg"
                  style={page === p.id ? { background: "var(--ink)", color: "var(--paper)" } : {}}
                >
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-5 pt-14 pb-6 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <Eyebrow>{heroCopy.eyebrow}</Eyebrow>
          <h1
            className="f-display font-semibold mt-3.5 mb-4"
            style={{ fontSize: "clamp(32px, 5.2vw, 58px)", lineHeight: 1.04, letterSpacing: "-0.01em" }}
          >
            {heroCopy.title}
          </h1>
          <p className="text-[16.5px] max-w-[46ch] mb-6" style={{ color: "var(--ink-soft)" }}>
            {heroCopy.lede}
          </p>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => document.getElementById("calc-anchor")?.scrollIntoView({ behavior: "smooth" })}
              className="px-5 py-3 rounded-full text-[14.5px] font-semibold inline-flex items-center gap-2"
              style={{ background: "var(--citrus)", border: "1.5px solid var(--citrus)", color: "#2a1804" }}
            >
              Try it now <ArrowRight size={16} />
            </button>
            {page !== "intake" && (
              <button
                onClick={() => setPage("intake")}
                className="px-5 py-3 rounded-full text-[14.5px] font-semibold"
                style={{ border: "1.5px solid var(--ink)" }}
              >
                Find my daily calorie need
              </button>
            )}
          </div>
        </div>
        <div className="floaty">
          <HeroOrb />
        </div>
      </section>

      <WaveDivider />

      {/* NUTRIENT EXPLAINERS */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="mb-7 max-w-[60ch]">
          <Eyebrow>Why these four numbers</Eyebrow>
          <h2 className="f-display font-semibold mt-2.5 mb-2" style={{ fontSize: "clamp(24px, 3.2vw, 34px)" }}>
            What your body does with each nutrient
          </h2>
        </div>
        <NutrientGrid />
      </section>

      {/* CALCULATOR */}
      <section id="calc-anchor" className="max-w-6xl mx-auto px-5 py-12">
        <div className="mb-7 max-w-[60ch]">
          <Eyebrow>Live calculator</Eyebrow>
          <h2 className="f-display font-semibold mt-2.5 mb-2" style={{ fontSize: "clamp(24px, 3.2vw, 34px)" }}>
            {
              {
                food: "Build today's food log",
                ai: "Log your meals with Gemini AI",
                intake: "Calculate your daily calories",
                bmi: "Check your BMI",
                ideal: "Find your ideal weight range",
              }[page]
            }
          </h2>
        </div>
        {page === "food" && <FoodCalculator />}
        {page === "ai" && <AiNutritionLog />}
        {page === "intake" && <CalorieIntake />}
        {page === "bmi" && <BmiCalculator />}
        {page === "ideal" && <IdealWeight />}
      </section>

      {/* CROSS LINKS */}
      <section className="max-w-6xl mx-auto px-5 py-12">
        <div className="mb-6">
          <Eyebrow>More tools</Eyebrow>
          <h2 className="f-display font-semibold mt-2.5" style={{ fontSize: "clamp(22px, 3vw, 30px)" }}>
            Keep going
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PAGES.filter((p) => p.id !== page)
            .slice(0, 3)
            .map((p) => (
              <button
                key={p.id}
                onClick={() => setPage(p.id)}
                className="text-left bg-white rounded-2xl p-5 transition-transform hover:-translate-y-1"
                style={{ border: "1px solid var(--line)" }}
              >
                <span className="f-mono text-[11px] uppercase tracking-wide" style={{ color: "var(--ink-soft)" }}>
                  {p.id}
                </span>
                <h3 className="f-display text-[20px] font-semibold mt-1.5 mb-1">{p.label}</h3>
                <p className="text-[13px]" style={{ color: "var(--ink-soft)" }}>
                  Open the {p.label.toLowerCase()} tool →
                </p>
              </button>
            ))}
        </div>
      </section>

      <footer className="mt-8 py-11" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div className="max-w-6xl mx-auto px-5 flex flex-wrap justify-between gap-6">
          <div>
            <div className="f-display italic font-semibold text-[20px] flex items-center gap-3 mb-2">
              <img src="/gym_logo.jpg" alt="Nutrient Lab Logo" className="w-8 h-8 rounded-lg object-contain" />
              Nutrient Lab
            </div>
            <p className="text-[13px] opacity-70 max-w-[52ch]">
              A free set of everyday nutrition calculators — food macros, BMI, ideal weight and daily calorie needs.
            </p>
            <p
              className="text-[11.5px] opacity-55 mt-4 pt-4 max-w-[52ch]"
              style={{ borderTop: "1px solid rgba(243, 241, 228, 0.15)" }}
            >
              For general wellness estimation only. Not medical advice.
            </p>
          </div>
          <ul className="flex gap-5 text-[13.5px]">
            {PAGES.map((p) => (
              <li key={p.id}>
                <button onClick={() => setPage(p.id)} className="opacity-85 hover:opacity-100 hover:underline">
                  {p.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </footer>
    </div>
  );
}
