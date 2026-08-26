"use client";
import { useState, useMemo } from "react";
import { TOPICS } from "@/data/questions";
import { validateConfig } from "@/lib/quiz";
import { AlertTriangle, Check } from "lucide-react";

const ITEM_OPTIONS = [15, 25, 50, 75, 100] as const;

export default function ConfigScreen({
  onProceed,
  onBack,
}: {
  onProceed: (topics: string[], count: number) => void;
  onBack: () => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const [count, setCount] = useState<number>(15);
  const [custom, setCustom] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);

  const target = isCustom ? parseInt(custom) || 0 : count;

  const { valid, warning } = useMemo(() => validateConfig(selected, target), [selected, target]);

  const toggleTopic = (t: string) => {
    if (t === "ALL") {
      setSelected((prev) => (prev.includes("ALL") ? [] : ["ALL"]));
      return;
    }
    setSelected((prev) => {
      const withoutAll = prev.filter((x) => x !== "ALL");
      if (withoutAll.includes(t)) return withoutAll.filter((x) => x !== t);
      return [...withoutAll, t];
    });
  };

  const canProceed = valid && target > 0 && target <= 150 && selected.length > 0;

  return (
    <div className="flex flex-1 flex-col px-4 sm:px-6 py-8 bg-[#F0F4F8]">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Configure your exam</h2>
          <button onClick={onBack} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-slate-200">Back</button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Select Topics</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["ALL", ...TOPICS].map((t) => {
                const active = selected.includes(t) || (selected.includes("ALL") && t === "ALL");
                return (
                  <button
                    key={t}
                    onClick={() => toggleTopic(t)}
                    className={`text-left flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                      active ? "border-emerald-500 bg-emerald-50" : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <span className={`text-sm font-medium ${active ? "text-emerald-900" : "text-slate-700"}`}>{t}</span>
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shrink-0 ${active ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-white"}`}>
                      {active && <Check className="w-4 h-4" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-slate-900 mb-3">Number of Questions</h3>
            <div className="flex flex-wrap gap-2">
              {ITEM_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => {
                    setIsCustom(false);
                    setCount(n);
                  }}
                  className={`px-5 py-2.5 rounded-xl font-semibold border-2 transition-all ${!isCustom && count === n ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"}`}
                >
                  {n}
                </button>
              ))}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCustom(true)}
                  className={`px-5 py-2.5 rounded-xl font-semibold border-2 ${isCustom ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-200"}`}
                >
                  Custom
                </button>
                {isCustom && (
                  <input
                    type="number"
                    min={1}
                    max={150}
                    value={custom}
                    onChange={(e) => setCustom(e.target.value)}
                    placeholder="e.g. 30"
                    className="w-24 px-3 py-2.5 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:outline-none text-slate-900"
                  />
                )}
              </div>
            </div>
            {isCustom && target > 150 && <p className="text-sm text-rose-600 mt-2">Maximum 150 questions.</p>}
          </div>

          {warning && (
            <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-sm">
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
              <span>{warning}</span>
            </div>
          )}

          {!valid && selected.length === 0 && <p className="text-sm text-slate-500">Select at least one topic to proceed.</p>}

          <button
            disabled={!canProceed}
            onClick={() => onProceed(selected, target)}
            className={`w-full py-3.5 rounded-xl font-bold text-lg transition-all ${canProceed ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-md" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
