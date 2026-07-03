import React, { useState, useEffect } from "react";
import { Sparkles, Trash2, Settings, HelpCircle, Save, Plus, X, Award, ChevronDown, BookOpen } from "lucide-react";
import Eyebrow from "../components/ui/Eyebrow";
import Field, { inputCls, inputStyle } from "../components/ui/Field";
import Seg from "../components/ui/Seg";
import { FOOD_DB } from "../data/foodDb";

// --- Offline Local NLP Parser ---
const parseMealLocally = (description) => {
  const text = description.toLowerCase();
  
  const foodKeywords = [
    { keys: ["peanut butter"], dbName: "Peanut butter", defaultQty: "1 tbsp" },
    { keys: ["white rice", "rice"], dbName: "White rice, cooked", defaultQty: "1 cup" },
    { keys: ["brown rice"], dbName: "Brown rice, cooked", defaultQty: "1 cup" },
    { keys: ["chapati", "roti"], dbName: "Roti / chapati", defaultQty: "1 piece" },
    { keys: ["whole wheat bread", "wheat bread", "wheat toast"], dbName: "Whole wheat bread", defaultQty: "1 slice" },
    { keys: ["white bread", "bread", "toast"], dbName: "White bread", defaultQty: "1 slice" },
    { keys: ["oats", "oatmeal"], dbName: "Oats, dry", defaultQty: "1 cup" },
    { keys: ["idli"], dbName: "Idli", defaultQty: "2 pieces" },
    { keys: ["dosa"], dbName: "Dosa (plain)", defaultQty: "1 piece" },
    { keys: ["chicken breast"], dbName: "Chicken breast, cooked", defaultQty: "100g" },
    { keys: ["chicken curry", "chicken"], dbName: "Chicken curry", defaultQty: "1 cup" },
    { keys: ["boiled egg", "scrambled egg", "egg"], dbName: "Egg, whole, boiled", defaultQty: "1 piece" },
    { keys: ["paneer"], dbName: "Paneer", defaultQty: "100g" },
    { keys: ["tofu"], dbName: "Tofu", defaultQty: "100g" },
    { keys: ["salmon"], dbName: "Salmon, cooked", defaultQty: "150g" },
    { keys: ["beef", "steak"], dbName: "Beef, lean, cooked", defaultQty: "100g" },
    { keys: ["lentils", "dal", "dhal"], dbName: "Lentils (dal), cooked", defaultQty: "1 cup" },
    { keys: ["chickpeas", "chana"], dbName: "Chickpeas, cooked", defaultQty: "1 cup" },
    { keys: ["kidney beans", "rajma"], dbName: "Kidney beans, cooked", defaultQty: "1 cup" },
    { keys: ["greek yogurt", "yogurt", "curd"], dbName: "Greek yogurt, plain", defaultQty: "1 cup" },
    { keys: ["milk"], dbName: "Milk, whole", defaultQty: "1 cup" },
    { keys: ["almond"], dbName: "Almonds", defaultQty: "10 pieces" },
    { keys: ["peanut"], dbName: "Peanuts", defaultQty: "1 handful" },
    { keys: ["banana"], dbName: "Banana", defaultQty: "1 medium" },
    { keys: ["apple"], dbName: "Apple", defaultQty: "1 medium" },
    { keys: ["orange"], dbName: "Orange", defaultQty: "1 medium" },
    { keys: ["mango"], dbName: "Mango", defaultQty: "1 medium" },
    { keys: ["avocado"], dbName: "Avocado", defaultQty: "1/2 medium" },
    { keys: ["broccoli"], dbName: "Broccoli, cooked", defaultQty: "1 cup" },
    { keys: ["spinach"], dbName: "Spinach, cooked", defaultQty: "1 cup" },
    { keys: ["sweet potato"], dbName: "Sweet potato, boiled", defaultQty: "1 medium" },
    { keys: ["potato"], dbName: "Potato, boiled", defaultQty: "1 medium" },
    { keys: ["carrot"], dbName: "Carrot, raw", defaultQty: "1 medium" },
    { keys: ["tomato"], dbName: "Tomato", defaultQty: "1 medium" },
    { keys: ["cheese", "cheddar"], dbName: "Cheese, cheddar", defaultQty: "1 slice" },
    { keys: ["butter"], dbName: "Butter", defaultQty: "1 tsp" },
    { keys: ["olive oil"], dbName: "Olive oil", defaultQty: "1 tbsp" },
    { keys: ["pizza"], dbName: "Pizza, cheese", defaultQty: "1 slice" },
    { keys: ["french fries", "fries"], dbName: "French fries", defaultQty: "1 medium portion" },
    { keys: ["pasta"], dbName: "Pasta, cooked", defaultQty: "1 cup" },
    { keys: ["dark chocolate", "chocolate"], dbName: "Dark chocolate", defaultQty: "1 square" },
    { keys: ["quinoa"], dbName: "Quinoa, cooked", defaultQty: "1 cup" },
    { keys: ["walnuts", "walnut"], dbName: "Walnuts", defaultQty: "5 pieces" }
  ];

  const getMultiplier = (sentence, matchedKeyword) => {
    const words = sentence.split(/\s+/);
    const kwIdx = words.findIndex(w => w.toLowerCase().includes(matchedKeyword));
    if (kwIdx === -1) return 1;

    const lookbackWords = words.slice(Math.max(0, kwIdx - 3), kwIdx);
    
    const numMap = {
      one: 1, "1": 1, a: 1, an: 1, single: 1,
      two: 2, "2": 2, pair: 2, double: 2,
      three: 3, "3": 3, triple: 3,
      four: 4, "4": 4,
      five: 5, "5": 5,
      six: 6, "6": 6,
      seven: 7, "7": 7,
      eight: 8, "8": 8,
      nine: 9, "9": 9,
      ten: 10, "10": 10,
      half: 0.5, "0.5": 0.5, "1/2": 0.5, quarter: 0.25, "1/4": 0.25
    };

    for (let i = lookbackWords.length - 1; i >= 0; i--) {
      const cleanWord = lookbackWords[i].toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
      if (numMap[cleanWord] !== undefined) {
        return numMap[cleanWord];
      }
      const numVal = parseFloat(cleanWord);
      if (!isNaN(numVal) && numVal > 0) {
        return numVal;
      }
    }
    return 1;
  };

  const matchedItems = [];
  const sortedKeywords = [];
  foodKeywords.forEach(fk => {
    fk.keys.forEach(k => {
      sortedKeywords.push({ key: k, dbName: fk.dbName, defaultQty: fk.defaultQty });
    });
  });
  sortedKeywords.sort((a, b) => b.key.length - a.key.length);

  let tempText = text;
  sortedKeywords.forEach(item => {
    const rx = new RegExp(`\\b${item.key}\\b|${item.key}`, 'gi');
    if (rx.test(tempText)) {
      const multiplier = getMultiplier(text, item.key);
      const dbFood = FOOD_DB.find(f => f.n === item.dbName);
      if (dbFood) {
        matchedItems.push({
          foodName: dbFood.n,
          quantity: multiplier === 1 ? item.defaultQty : `${multiplier}x ${item.defaultQty}`,
          calories: Math.round(dbFood.cal * multiplier),
          protein: Math.round(dbFood.p * multiplier * 10) / 10,
          fat: Math.round(dbFood.f * multiplier * 10) / 10,
          carbs: Math.round(dbFood.c * multiplier * 10) / 10,
          fiber: Math.round((dbFood.fib || 0) * multiplier * 10) / 10,
          sugar: Math.round((dbFood.fib || 0) * 0.5 * multiplier * 10) / 10,
          sodium: Math.round((dbFood.cal * 0.8) * multiplier)
        });
      }
      tempText = tempText.replace(rx, "");
    }
  });

  return matchedItems;
};


const QUICK_TEMPLATES = [
  {
    title: "Healthy Breakfast",
    type: "Breakfast",
    text: "I had two scrambled eggs cooked in a teaspoon of butter, one slice of whole wheat toast, and a medium banana."
  },
  {
    title: "Chicken Salad Lunch",
    type: "Lunch",
    text: "For lunch I enjoyed a grilled chicken breast salad with mixed greens, half an avocado, 10 cherry tomatoes, and 2 tablespoons of olive oil vinaigrette."
  },
  {
    title: "Salmon & Veggies Dinner",
    type: "Dinner",
    text: "I ate a medium fillet of baked salmon with a cup of steamed broccoli, a teaspoon of olive oil, and 1 cup of cooked brown rice."
  },
  {
    title: "Protein Power Snack",
    type: "Snack",
    text: "A quick protein shake with 1 scoop of whey protein powder, 1 cup of almond milk, and a tablespoon of creamy peanut butter."
  }
];

export default function AiNutritionLog() {
  // --- States ---
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [aiEngine, setAiEngine] = useState(() => localStorage.getItem("ai_engine") || "local");
  const [ollamaModel, setOllamaModel] = useState(() => localStorage.getItem("ollama_model") || "llama3");
  const [ollamaUrl, setOllamaUrl] = useState(() => localStorage.getItem("ollama_url") || "http://localhost:11434");
  const [localModels, setLocalModels] = useState([]);
  const [isConnectingOllama, setIsConnectingOllama] = useState(false);
  const [showKeySetup, setShowKeySetup] = useState(false);
  const [meals, setMeals] = useState(() => {
    const saved = localStorage.getItem("ai_meals_log");
    return saved ? JSON.parse(saved) : [];
  });
  const [dailyGoals, setDailyGoals] = useState(() => {
    const saved = localStorage.getItem("ai_daily_goals");
    return saved ? JSON.parse(saved) : { calories: 2000, protein: 80, carbs: 250, fat: 70, fiber: 30 };
  });

  const [inputText, setInputText] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("Breakfast");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [goalsForm, setGoalsForm] = useState({ ...dailyGoals });
  
  // Temporary state for the active analysis result
  const [lastAnalysis, setLastAnalysis] = useState(null);

  const fetchOllamaModels = async () => {
    setIsConnectingOllama(true);
    try {
      const response = await fetch(`${ollamaUrl}/v1/models`);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      const data = await response.json();
      if (data.data && Array.isArray(data.data)) {
        const modelNames = data.data.map(m => m.id);
        setLocalModels(modelNames);
        if (modelNames.length > 0 && !modelNames.includes(ollamaModel)) {
          setOllamaModel(modelNames[0]);
          localStorage.setItem("ollama_model", modelNames[0]);
        }
        setSuccessMessage("Successfully connected to local Ollama and fetched model list!");
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        throw new Error("Invalid response format from Ollama.");
      }
    } catch (err) {
      setErrorMessage(`Could not connect to Ollama at ${ollamaUrl}: ${err.message}. Ensure Ollama is running and CORS is enabled.`);
    } finally {
      setIsConnectingOllama(false);
    }
  };

  useEffect(() => {
    if (aiEngine === "ollama") {
      fetchOllamaModels();
    }
  }, [aiEngine, ollamaUrl]);

  // --- Effects ---
  useEffect(() => {
    localStorage.setItem("ai_meals_log", JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem("ai_daily_goals", JSON.stringify(dailyGoals));
  }, [dailyGoals]);

  // --- Helpers ---
  const saveApiKey = (key) => {
    const trimmed = key.trim();
    setApiKey(trimmed);
    localStorage.setItem("gemini_api_key", trimmed);
    setShowKeySetup(false);
    setSuccessMessage("API Key saved successfully!");
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const clearApiKey = () => {
    setApiKey("");
    localStorage.removeItem("gemini_api_key");
    setShowKeySetup(true);
  };

  const getPercent = (value, goal) => {
    if (!goal || goal <= 0) return 0;
    return Math.min(Math.round((value / goal) * 100), 100);
  };

  const getActiveEngineLabel = () => {
    if (aiEngine === "gemini") {
      return apiKey ? "Gemini Pro (Active Key)" : "Gemini Pro (Missing Key)";
    }
    if (aiEngine === "ollama") {
      return `Ollama: ${ollamaModel}`;
    }
    return "Offline Matcher";
  };

  // --- Cumulative Calculations ---
  const totals = meals.reduce(
    (acc, meal) => {
      meal.items.forEach((item) => {
        acc.calories += item.calories || 0;
        acc.protein += item.protein || 0;
        acc.fat += item.fat || 0;
        acc.carbs += item.carbs || 0;
        acc.fiber += item.fiber || 0;
      });
      return acc;
    },
    { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
  );

  // Round values nicely
  totals.calories = Math.round(totals.calories);
  totals.protein = Math.round(totals.protein * 10) / 10;
  totals.fat = Math.round(totals.fat * 10) / 10;
  totals.carbs = Math.round(totals.carbs * 10) / 10;
  totals.fiber = Math.round(totals.fiber * 10) / 10;

  // --- AI API Query ---
  const handleAISubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    setLastAnalysis(null);

    const systemPrompt = `You are a professional nutritional scientist and AI dietitian. Your core task is to extract exact food items, portion sizes, calories (in kcal), protein (in grams), fat (in grams), total carbohydrates (in grams), dietary fiber (in grams), sugar (in grams), and sodium (in milligrams) from a free-form text input of a meal.
    
    You must estimate values realistically and conservatively using recognized standard nutritional facts.
    Provide the output in JSON format matching this schema:
    {
      "items": [
        {
          "foodName": "Recognizable name of food item (e.g., 'Boiled Egg')",
          "quantity": "Estimated quantity or portion size (e.g., '2', '1 medium')",
          "calories": number,
          "protein": number,
          "fat": number,
          "carbs": number,
          "fiber": number,
          "sugar": number,
          "sodium": number
        }
      ],
      "feedback": "Warm, professional 1-2 sentence dietitian advice.",
      "overallNutritionScore": number (1 to 10)
    }`;

    const userQuery = `Analyze this meal:
    Meal Type: ${selectedMealType}
    Meal Description: "${inputText}"`;

    let parsedData = null;

    try {
      if (aiEngine === "gemini") {
        if (!apiKey) {
          throw new Error("Please set your Gemini API Key in the settings at the bottom of this card first.");
        }
        // Use Gemini API
        const apiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
        const payload = {
          contents: [{
            parts: [{ text: userQuery }]
          }],
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
              type: "OBJECT",
              properties: {
                items: {
                  type: "ARRAY",
                  description: "A list of every distinct food item identified in the description.",
                  items: {
                    type: "OBJECT",
                    properties: {
                      foodName: { type: "STRING" },
                      quantity: { type: "STRING" },
                      calories: { type: "INTEGER" },
                      protein: { type: "NUMBER" },
                      fat: { type: "NUMBER" },
                      carbs: { type: "NUMBER" },
                      fiber: { type: "NUMBER" },
                      sugar: { type: "NUMBER" },
                      sodium: { type: "NUMBER" }
                    },
                    required: ["foodName", "quantity", "calories", "protein", "fat", "carbs", "fiber", "sugar", "sodium"]
                  }
                },
                feedback: { type: "STRING" },
                overallNutritionScore: { type: "INTEGER" }
              },
              required: ["items", "feedback", "overallNutritionScore"]
            }
          }
        };

        const response = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.error?.message || `HTTP Error ${response.status}`);
        }

        const data = await response.json();
        const parsedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!parsedText) {
          throw new Error("No response content from Gemini API. Try rephrasing your description.");
        }
        parsedData = JSON.parse(parsedText.trim());

      } else if (aiEngine === "ollama") {
        // Use local Ollama instance (OpenAI-compatible Chat Completion API)
        const endpoint = `${ollamaUrl}/v1/chat/completions`;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: ollamaModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userQuery }
            ],
            response_format: { type: "json_object" }
          })
        });

        if (!response.ok) {
          throw new Error(`Failed to connect to local Ollama at ${ollamaUrl}. Make sure Ollama is running and CORS is enabled. Start it with OLLAMA_ORIGINS="*" env variable.`);
        }

        const data = await response.json();
        const responseText = data.choices?.[0]?.message?.content;
        if (!responseText) {
          throw new Error("Local Ollama model returned an empty response.");
        }
        parsedData = JSON.parse(responseText.trim());

      } else {
        // Use intelligent Offline Local Matcher
        const matchedItems = parseMealLocally(inputText);
        
        if (matchedItems.length === 0) {
          throw new Error("No recognized foods matched from the Nutrient Lab database. Try simpler terms like 'eggs', 'banana', 'rice', 'bread', or switch to Gemini/Ollama in settings for comprehensive AI estimation.");
        }

        // Calculate healthiness score
        let scoreSum = 8;
        const textLower = inputText.toLowerCase();
        if (textLower.includes("pizza") || textLower.includes("fries") || textLower.includes("butter")) {
          scoreSum = 5;
        } else if (textLower.includes("broccoli") || textLower.includes("spinach") || textLower.includes("banana") || textLower.includes("oats")) {
          scoreSum = 9;
        }

        // Formulate feedback advice
        let feedback = "Estimated locally using the Nutrient Lab database. Balanced selection of foods!";
        if (textLower.includes("fries") || textLower.includes("pizza")) {
          feedback = "Estimated locally. This meal contains processed options; consider balancing it out with fresh green vegetables.";
        } else if (matchedItems.length > 2) {
          feedback = "Estimated locally. Balanced combination of macro nutrients. Great choice!";
        }

        parsedData = {
          items: matchedItems,
          feedback: feedback,
          overallNutritionScore: scoreSum
        };
      }

      if (!parsedData || !parsedData.items || parsedData.items.length === 0) {
        throw new Error("No foods could be clearly identified. Try adding quantities or descriptors.");
      }

      // Store in analysis result preview
      setLastAnalysis({
        type: selectedMealType,
        rawText: inputText,
        items: parsedData.items,
        feedback: parsedData.feedback,
        score: parsedData.overallNutritionScore,
        totals: parsedData.items.reduce(
          (acc, item) => {
            acc.calories += item.calories || 0;
            acc.protein += item.protein || 0;
            acc.fat += item.fat || 0;
            acc.carbs += item.carbs || 0;
            acc.fiber += item.fiber || 0;
            acc.sugar += item.sugar || 0;
            acc.sodium += item.sodium || 0;
            return acc;
          },
          { calories: 0, protein: 0, fat: 0, carbs: 0, fiber: 0, sugar: 0, sodium: 0 }
        )
      });

      setSuccessMessage("Meal parsed successfully! Check the Nutrition Facts label.");
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (err) {
      setErrorMessage(err.message || "Failed to communicate with AI.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- Add to log ---
  const saveAnalysisToLog = () => {
    if (!lastAnalysis) return;
    
    const newMealLog = {
      id: crypto.randomUUID(),
      type: lastAnalysis.type,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      rawText: lastAnalysis.rawText,
      items: lastAnalysis.items,
      feedback: lastAnalysis.feedback,
      score: lastAnalysis.score
    };

    setMeals((prev) => [newMealLog, ...prev]);
    setLastAnalysis(null);
    setInputText("");
    setSuccessMessage(`Added to daily log!`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  // --- Deletions ---
  const handleDeleteMeal = (id) => {
    setMeals((prev) => prev.filter((meal) => meal.id !== id));
  };

  const handleClearAll = () => {
    if (window.confirm("Clear all logs for today?")) {
      setMeals([]);
    }
  };

  // --- Goals editing ---
  const saveGoals = (e) => {
    e.preventDefault();
    setDailyGoals({
      calories: Number(goalsForm.calories) || 2000,
      protein: Number(goalsForm.protein) || 80,
      carbs: Number(goalsForm.carbs) || 250,
      fat: Number(goalsForm.fat) || 70,
      fiber: Number(goalsForm.fiber) || 30
    });
    setIsEditingGoals(false);
  };

  return (
    <div className="space-y-8">
      {/* Messages */}
      {successMessage && (
        <div className="p-4 rounded-2xl border bg-emerald-50 text-emerald-800 border-emerald-200 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
          <span className="text-[14.5px] font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl border bg-rose-50 text-rose-800 border-rose-200">
          <div className="flex items-center gap-2 font-semibold text-sm">
            <X className="w-5 h-5 text-rose-600" />
            <span>AI Estimation Failed</span>
          </div>
          <p className="text-xs mt-1 leading-relaxed opacity-90">{errorMessage}</p>
        </div>
      )}

      {/* Target Progress Bar Cards */}
      <section className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        {[
          { label: "Calories", value: totals.calories, unit: "kcal", goal: dailyGoals.calories, color: "var(--citrus)" },
          { label: "Protein", value: totals.protein, unit: "g", goal: dailyGoals.protein, color: "var(--berry)" },
          { label: "Carbs", value: totals.carbs, unit: "g", goal: dailyGoals.carbs, color: "var(--carb)" },
          { label: "Fat", value: totals.fat, unit: "g", goal: dailyGoals.fat, color: "var(--sky)" },
          { label: "Fiber", value: totals.fiber, unit: "g", goal: dailyGoals.fiber, color: "var(--leaf)" }
        ].map((macro) => (
          <div key={macro.label} className="bg-white rounded-2xl border border-[var(--line)] p-4 relative overflow-hidden">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              {macro.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold leading-none">{macro.value}</span>
              <span className="text-[11px] text-slate-500">/ {macro.goal} {macro.unit}</span>
            </div>
            <div className="mt-3">
              <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ width: `${getPercent(macro.value, macro.goal)}%`, background: macro.color }}
                />
              </div>
              <div className="flex justify-between items-center mt-1 text-[9.5px] text-slate-400">
                <span>{getPercent(macro.value, macro.goal)}%</span>
                <span>{Math.max(0, Math.round(macro.goal - macro.value))} left</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Main layout splitting */}
      <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start">
        
        {/* LEFT COLUMN: Entry Form */}
        <div className="space-y-6">
          
          <div className="bg-white border border-[var(--line)] rounded-3xl p-6 relative">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3.5 mb-4">
              <div>
                <Eyebrow>Gemini AI Assistant</Eyebrow>
                <h3 className="f-display font-semibold text-lg mt-1">Free-form Paragraph Intake</h3>
              </div>
              <div className="flex rounded-full bg-[var(--paper-dim)] p-1 border border-[var(--line)]">
                {["Breakfast", "Lunch", "Dinner", "Snack"].map((mType) => (
                  <button
                    key={mType}
                    onClick={() => setSelectedMealType(mType)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full transition-all ${
                      selectedMealType === mType 
                        ? 'bg-[var(--ink)] text-[var(--paper)] shadow-sm' 
                        : 'text-[var(--ink-soft)] hover:text-[var(--ink)]'
                    }`}
                  >
                    {mType}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleAISubmit} className="space-y-4">
              <div className="relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Describe your meal in normal language... (e.g. 'I had a cup of plain non-fat greek yogurt with a handful of fresh blueberries, 1 tablespoon of ground flaxseeds, and a cup of freshly brewed green tea.')"
                  className="w-full bg-[#FFFDF7] border border-[var(--line)] focus:border-[var(--ink)] rounded-2xl p-4 text-[14.5px] text-[var(--ink)] placeholder-slate-400 outline-none resize-none transition-all leading-[28px]"
                  style={{
                    backgroundImage: "repeating-linear-gradient(#FFFDF7 0px, #FFFDF7 27px, var(--line) 28px)",
                    minHeight: "140px"
                  }}
                  maxLength={1500}
                  disabled={isLoading}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <span className="text-xs text-[var(--ink-soft)] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[var(--citrus)]" />
                  Gemini extracts meals & weights automatically.
                </span>
                
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md ${
                    isLoading 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' 
                      : !inputText.trim()
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                        : 'bg-[var(--citrus)] hover:brightness-105 active:scale-[0.98] text-white shadow-orange-500/10'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                      Analyzing meal...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Analyze with AI
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Quick templates */}
          <div className="bg-white border border-[var(--line)] rounded-3xl p-6">
            <h4 className="font-semibold text-[14px] text-[var(--ink)] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[var(--leaf)]" />
              Try similar paragraph descriptions
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUICK_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInputText(tpl.text);
                    setSelectedMealType(tpl.type);
                  }}
                  className="p-3.5 rounded-2xl border border-[var(--line)] bg-[var(--paper-dim)]/30 hover:bg-[var(--paper-dim)]/80 text-left transition-colors group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-semibold text-[var(--ink)] group-hover:underline">
                      {tpl.title}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[var(--ink)] text-[var(--paper)]">
                      {tpl.type}
                    </span>
                  </div>
                  <p className="text-[12px] text-[var(--ink-soft)] line-clamp-2 italic">
                    "{tpl.text}"
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* API Key Setup Toggle card */}
          <div className="bg-white border border-[var(--line)] rounded-3xl p-5">
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setShowKeySetup(!showKeySetup)}
                className="flex items-center gap-2 text-xs font-semibold text-[var(--ink-soft)] hover:text-[var(--ink)]"
              >
                <Settings className="w-4 h-4 text-[var(--citrus)]" />
                <span>AI Engine & API Settings</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showKeySetup ? 'rotate-180' : ''}`} />
              </button>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                aiEngine === "gemini"
                  ? apiKey ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-50 border-rose-100"
                  : aiEngine === "ollama"
                    ? "text-sky-600 bg-sky-50 border-sky-100"
                    : "text-amber-600 bg-amber-50 border-amber-100"
              }`}>
                {getActiveEngineLabel()}
              </span>
            </div>

            {showKeySetup && (
              <div className="mt-4 pt-4 border-t border-[var(--line)] space-y-4">
                {/* Engine Selector Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-[var(--paper-dim)] rounded-xl border border-[var(--line)]">
                  {[
                    { id: "local", name: "Offline Matcher" },
                    { id: "gemini", name: "Google Gemini" },
                    { id: "ollama", name: "Ollama Local" }
                  ].map((engine) => (
                    <button
                      key={engine.id}
                      onClick={() => {
                        setAiEngine(engine.id);
                        localStorage.setItem("ai_engine", engine.id);
                      }}
                      className={`py-1.5 text-[10.5px] font-bold rounded-lg transition-all text-center ${
                        aiEngine === engine.id
                          ? "bg-[var(--ink)] text-[var(--paper)] shadow-sm"
                          : "text-[var(--ink-soft)] hover:text-[var(--ink)]"
                      }`}
                    >
                      {engine.name}
                    </button>
                  ))}
                </div>

                {/* Conditional Panel Rendering */}
                {aiEngine === "local" && (
                  <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                    Uses the local <strong>Nutrient Lab Database</strong> to match common ingredients (eggs, banana, bread, oatmeal, tofu, chicken, etc.) directly in your browser. Fully private, works 100% offline, and requires no API keys or configuration.
                  </p>
                )}

                {aiEngine === "gemini" && (
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                      Connects directly to the high-limit, private <strong>Google Gemini API</strong> for intelligent full-paragraph nutritional analysis. Paste your API key below. You can get a free key from{" "}
                      <a 
                        href="https://aistudio.google.com/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="underline text-[var(--citrus)] font-semibold"
                      >
                        Google AI Studio
                      </a>.
                    </p>
                    
                    <div className="flex gap-2">
                      <input
                        type="password"
                        placeholder="AIzaSy..."
                        defaultValue={apiKey}
                        id="key-input"
                        className="flex-1 bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[var(--ink)]"
                      />
                      <button
                        onClick={() => {
                          const inputVal = document.getElementById("key-input")?.value || "";
                          saveApiKey(inputVal);
                        }}
                        className="bg-[var(--ink)] hover:bg-[var(--ink-soft)] text-[var(--paper)] font-bold text-xs px-4 py-2 rounded-xl transition-all"
                      >
                        Save Key
                      </button>
                    </div>

                    {apiKey && (
                      <button 
                        onClick={clearApiKey}
                        className="text-[10.5px] text-rose-600 underline hover:text-rose-800 block"
                      >
                        Disconnect and remove API Key
                      </button>
                    )}
                  </div>
                )}

                {aiEngine === "ollama" && (
                  <div className="space-y-3">
                    <p className="text-xs text-[var(--ink-soft)] leading-relaxed">
                      Connects to a free open-source AI model (like <code>llama3</code> or <code>gemma2</code>) running locally on your laptop using <strong>Ollama</strong>.
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Ollama Host URL</label>
                        <input
                          type="text"
                          value={ollamaUrl}
                          onChange={(e) => {
                            setOllamaUrl(e.target.value);
                            localStorage.setItem("ollama_url", e.target.value);
                          }}
                          className="bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[var(--ink)]"
                          placeholder="http://localhost:11434"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-bold text-[var(--ink-soft)]">Model Name</label>
                        {localModels.length > 0 ? (
                          <select
                            value={ollamaModel}
                            onChange={(e) => {
                              setOllamaModel(e.target.value);
                              localStorage.setItem("ollama_model", e.target.value);
                            }}
                            className="bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs outline-none focus:border-[var(--ink)]"
                          >
                            {localModels.map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={ollamaModel}
                            onChange={(e) => {
                              setOllamaModel(e.target.value);
                              localStorage.setItem("ollama_model", e.target.value);
                            }}
                            className="bg-white border border-[var(--line)] rounded-xl px-3 py-2 text-xs font-mono outline-none focus:border-[var(--ink)]"
                            placeholder="llama3"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={fetchOllamaModels}
                        disabled={isConnectingOllama}
                        className="bg-[var(--ink)] hover:bg-[var(--ink-soft)] text-[var(--paper)] font-bold text-xs px-4 py-2 rounded-xl transition-all disabled:opacity-50"
                      >
                        {isConnectingOllama ? "Connecting..." : "Connect & Get Models"}
                      </button>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10.5px] leading-relaxed text-[var(--ink-soft)]">
                      <span className="font-bold block text-[11px] text-[var(--ink)] mb-0.5">Setup Instruction:</span>
                      To avoid CORS blocks, start Ollama in your terminal with:
                      <code className="block bg-slate-100 p-1.5 rounded mt-1 font-mono text-[9.5px] select-all">
                        OLLAMA_ORIGINS="*" ollama serve
                      </code>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: AI Analysis Result Preview / Today's Timeline */}
        <div className="space-y-6">
          
          {/* Active Analysis Preview: Nutrition Facts Label */}
          {lastAnalysis ? (
            <div className="bg-white border-2 border-[var(--ink)] rounded-3xl p-5 relative shadow-md">
              <div className="flex justify-between items-start mb-4">
                <h3 className="f-display font-semibold text-lg">AI Estimation Result</h3>
                <button 
                  onClick={() => setLastAnalysis(null)}
                  className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Nutrition Facts box */}
              <div className="border border-[var(--ink)] bg-white p-4 font-sans text-[var(--ink)]">
                <p className="f-mono text-[10px] uppercase tracking-wider m-0">
                  {lastAnalysis.type} &middot; Estimate
                </p>
                <h2 className="f-display font-black text-2xl m-0 leading-tight">Nutrition Facts</h2>
                <div className="border-t-[8px] border-[var(--ink)] my-1.5" />
                
                <div className="flex justify-between items-baseline py-1">
                  <span className="text-sm font-extrabold">Calories</span>
                  <span className="text-3xl font-black">{Math.round(lastAnalysis.totals.calories)}</span>
                </div>
                <div className="border-t-[4px] border-[var(--ink)] my-1.5" />

                {[
                  { name: "Total Fat", val: `${lastAnalysis.totals.fat.toFixed(1)}g`, indent: false },
                  { name: "Total Carbohydrate", val: `${lastAnalysis.totals.carbs.toFixed(1)}g`, indent: false },
                  { name: "Dietary Fiber", val: `${lastAnalysis.totals.fiber.toFixed(1)}g`, indent: true },
                  { name: "Sugars", val: `${lastAnalysis.totals.sugar.toFixed(1)}g`, indent: true },
                  { name: "Protein", val: `${lastAnalysis.totals.protein.toFixed(1)}g`, indent: false },
                  { name: "Sodium", val: `${Math.round(lastAnalysis.totals.sodium)}mg`, indent: false }
                ].map((nut, idx) => (
                  <div 
                    key={idx} 
                    className={`flex justify-between py-1.5 border-t border-slate-200 text-xs ${
                      nut.indent ? 'pl-4 font-normal text-slate-600' : 'font-bold'
                    }`}
                  >
                    <span>{nut.name}</span>
                    <span className="f-mono">{nut.val}</span>
                  </div>
                ))}
                <div className="border-t-[6px] border-[var(--ink)] my-1.5" />
                
                {lastAnalysis.feedback && (
                  <p className="text-[11.5px] italic text-[var(--ink-soft)] mt-2 leading-relaxed">
                    <strong>Dietitian Coach: </strong> {lastAnalysis.feedback}
                  </p>
                )}
              </div>

              {/* Items Identified */}
              <div className="mt-4 bg-[var(--paper-dim)]/30 rounded-2xl p-4 border border-[var(--line)]">
                <span className="f-mono text-[10.5px] uppercase tracking-wider text-[var(--ink-soft)] block mb-2">
                  Identified Food Portions
                </span>
                <div className="space-y-1.5">
                  {lastAnalysis.items.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-baseline text-xs border-b border-dashed border-[var(--line)] pb-1.5 last:border-0 last:pb-0">
                      <div>
                        <span className="font-semibold">{it.foodName}</span>
                        <span className="text-[11px] text-[var(--ink-soft)] ml-1">({it.quantity})</span>
                      </div>
                      <span className="f-mono font-bold text-[var(--citrus)]">{it.calories} kcal</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save trigger */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={saveAnalysisToLog}
                  className="flex-1 bg-[var(--ink)] hover:bg-[var(--ink-soft)] text-[var(--paper)] font-bold text-sm py-3 rounded-full flex items-center justify-center gap-2 shadow-md"
                >
                  <Save className="w-4 h-4" />
                  Add to Today's Diary
                </button>
              </div>

            </div>
          ) : null}

          {/* Timeline list card */}
          <div className="bg-white border border-[var(--line)] rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="f-display font-semibold text-lg">Today's Intake History</h3>
                <p className="text-xs text-[var(--ink-soft)] mt-0.5">Naturally logged meals timeline</p>
              </div>
              {meals.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-3 py-1.5 text-xs font-semibold rounded-full border border-rose-200 text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                >
                  Clear Logs
                </button>
              )}
            </div>

            {meals.length === 0 ? (
              <div className="py-12 border border-dashed border-[var(--line)] rounded-2xl text-center space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <h5 className="font-bold text-sm text-[var(--ink)]">No meals logged yet</h5>
                <p className="text-xs text-[var(--ink-soft)] max-w-[32ch] mx-auto leading-relaxed">
                  Enter what you had for breakfast, lunch, or dinner in paragraph format to log your daily minerals.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {meals.map((meal) => {
                  const mCalories = meal.items.reduce((sum, it) => sum + (it.calories || 0), 0);
                  const mProtein = meal.items.reduce((sum, it) => sum + (it.protein || 0), 0);
                  const mFat = meal.items.reduce((sum, it) => sum + (it.fat || 0), 0);
                  const mCarbs = meal.items.reduce((sum, it) => sum + (it.carbs || 0), 0);
                  const mFiber = meal.items.reduce((sum, it) => sum + (it.fiber || 0), 0);

                  return (
                    <div key={meal.id} className="relative pl-6 border-l-2 border-[var(--line)] pb-2 last:pb-0">
                      {/* Timeline Dot */}
                      <div className="absolute -left-[5.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--citrus)] ring-4 ring-white" />

                      <div className="flex justify-between items-start gap-2 mb-1.5">
                        <div>
                          <span className="text-xs font-bold text-[var(--ink)]">{meal.type}</span>
                          <span className="text-[10px] text-slate-400 font-mono ml-2">{meal.timestamp}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded-full border ${
                            meal.score >= 8
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : meal.score >= 5
                                ? 'bg-amber-50 text-amber-700 border-amber-100'
                                : 'bg-rose-50 text-rose-700 border-rose-100'
                          }`}>
                            Score: {meal.score}/10
                          </span>
                          <button
                            onClick={() => handleDeleteMeal(meal.id)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded-full hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <p className="text-[12px] italic text-[var(--ink-soft)] bg-[var(--paper-dim)]/20 p-2.5 rounded-xl border border-[var(--line)] mb-2.5 leading-relaxed">
                        "{meal.rawText}"
                      </p>

                      {/* Items parsed */}
                      <div className="bg-slate-50 rounded-2xl border border-slate-100 p-3 mb-2.5 divide-y divide-slate-100 text-xs text-[var(--ink)]">
                        {meal.items.map((it, idx) => (
                          <div key={idx} className="py-1.5 first:pt-0 last:pb-0">
                            <div className="flex justify-between items-baseline mb-0.5">
                              <span className="font-semibold">{it.foodName}</span>
                              <span className="text-[10px] text-[var(--ink-soft)]">({it.quantity})</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-[var(--ink-soft)] font-mono">
                              <span className="text-[var(--citrus)] font-semibold">{it.calories} kcal</span>
                              <span>·</span>
                              <span>P: {it.protein}g</span>
                              <span>·</span>
                              <span>C: {it.carbs}g</span>
                              <span>·</span>
                              <span>F: {it.fat}g</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Quick Macro Bar */}
                      <div className="flex flex-wrap gap-1.5 mb-2.5">
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--citrus-bg)] text-[var(--citrus)] font-semibold">
                          {Math.round(mCalories)} kcal
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--berry-bg)] text-[var(--berry)] font-semibold">
                          P: {mProtein.toFixed(1)}g
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--carb-bg)] text-[var(--carb)] font-semibold">
                          C: {mCarbs.toFixed(1)}g
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--sky-bg)] text-[var(--sky)] font-semibold">
                          F: {mFat.toFixed(1)}g
                        </span>
                      </div>

                      {meal.feedback && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] leading-relaxed text-[var(--ink-soft)]">
                          <span className="font-bold block text-[10.5px] text-[var(--ink)] mb-0.5">Dietitian Advice</span>
                          {meal.feedback}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Goal adjustment settings */}
          <div className="bg-white border border-[var(--line)] rounded-3xl p-5 flex justify-between items-center">
            <div>
              <h5 className="font-semibold text-xs text-[var(--ink)]">Daily Nutrition Goals</h5>
              <p className="text-[10.5px] text-[var(--ink-soft)]">
                Cal: {dailyGoals.calories}kcal &middot; P: {dailyGoals.protein}g &middot; C: {dailyGoals.carbs}g &middot; F: {dailyGoals.fat}g
              </p>
            </div>
            <button
              onClick={() => {
                setGoalsForm({ ...dailyGoals });
                setIsEditingGoals(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-full border border-[var(--line)] hover:bg-[var(--paper-dim)] transition-colors"
            >
              Modify Goals
            </button>
          </div>

        </div>

      </div>

      {/* Goal configuration Modal */}
      {isEditingGoals && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white border border-[var(--line)] rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-scale-up text-[var(--ink)]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="f-display font-semibold text-base">Adjust Daily Goal Targets</h3>
              <button 
                onClick={() => setIsEditingGoals(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveGoals} className="space-y-4">
              <div className="space-y-3">
                <Field label="Calories Target (kcal)">
                  <input
                    type="number"
                    value={goalsForm.calories}
                    onChange={(e) => setGoalsForm({ ...goalsForm, calories: e.target.value })}
                    className={inputCls}
                    style={inputStyle}
                    required
                    min={500}
                    max={10000}
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3.5">
                  <Field label="Protein (g)">
                    <input
                      type="number"
                      value={goalsForm.protein}
                      onChange={(e) => setGoalsForm({ ...goalsForm, protein: e.target.value })}
                      className={inputCls}
                      style={inputStyle}
                      required
                      min={10}
                      max={500}
                    />
                  </Field>
                  <Field label="Carbs (g)">
                    <input
                      type="number"
                      value={goalsForm.carbs}
                      onChange={(e) => setGoalsForm({ ...goalsForm, carbs: e.target.value })}
                      className={inputCls}
                      style={inputStyle}
                      required
                      min={10}
                      max={1000}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <Field label="Fat (g)">
                    <input
                      type="number"
                      value={goalsForm.fat}
                      onChange={(e) => setGoalsForm({ ...goalsForm, fat: e.target.value })}
                      className={inputCls}
                      style={inputStyle}
                      required
                      min={5}
                      max={300}
                    />
                  </Field>
                  <Field label="Fiber (g)">
                    <input
                      type="number"
                      value={goalsForm.fiber}
                      onChange={(e) => setGoalsForm({ ...goalsForm, fiber: e.target.value })}
                      className={inputCls}
                      style={inputStyle}
                      required
                      min={0}
                      max={150}
                    />
                  </Field>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingGoals(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-full hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold rounded-full bg-[var(--citrus)] hover:brightness-105 text-white transition-colors"
                >
                  Save Goals
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
