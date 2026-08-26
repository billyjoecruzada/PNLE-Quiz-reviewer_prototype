"use client";
import { useState, useEffect } from "react";
import { TRIVIAS } from "@/data/trivias";
import { Stethoscope, Sparkles } from "lucide-react";

export default function WelcomeScreen({ onStart }: { onStart: () => void }) {
  const [trivia, setTrivia] = useState(TRIVIAS[0]);
  useEffect(() => {
    setTrivia(TRIVIAS[Math.floor(Math.random() * TRIVIAS.length)]);
  }, []);
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-[#F0F4F8]">
      <div className="w-full max-w-2xl flex flex-col items-center gap-8">
        <div className="flex items-center gap-3 text-emerald-700">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Stethoscope className="w-8 h-8 text-emerald-600" />
          </div>
          <span className="text-sm font-semibold tracking-widest uppercase text-slate-500">PNLE Reviewer</span>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
            Philippine Nursing
            <br />
            <span className="text-emerald-600">Licensure Exam</span>
          </h1>
          <p className="text-slate-500 max-w-lg mx-auto">Practice smarter. Non-authenticated, highly responsive quiz tailored for nursing students.</p>
        </div>

        <div className="w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex gap-3 items-start">
          <div className="p-2 bg-amber-50 rounded-xl shrink-0">
            <Sparkles className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-slate-700 leading-relaxed text-[15px]">{trivia}</p>
        </div>

        <button
          onClick={onStart}
          className="bg-emerald-600 text-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-emerald-700 transition-all hover:scale-105 active:scale-100"
        >
          Start Quiz
        </button>

        <p className="text-xs text-slate-400 text-center">
          Found a bug or have suggestions? Contact us at: <span className="font-semibold text-slate-600">billyjoecruzada12@gmail.com</span>
        </p>
      </div>
    </div>
  );
}
