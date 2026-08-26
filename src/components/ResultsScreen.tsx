"use client";
import type { Question, UserAnswer } from "@/types/quiz";
import { Trophy, RotateCcw, LayoutGrid, Mail } from "lucide-react";

export default function ResultsScreen({
  questions,
  answers,
  onRetake,
  onNewTopics,
}: {
  questions: Question[];
  answers: Record<number, UserAnswer>;
  onRetake: () => void;
  onNewTopics: () => void;
}) {
  const total = questions.length;
  const correct = questions.filter((q) => answers[q.id]?.isCorrect).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;

  const topicStats = (() => {
    const m = new Map<string, { correct: number; total: number }>();
    questions.forEach((q) => {
      const s = m.get(q.topic) ?? { correct: 0, total: 0 };
      s.total++;
      if (answers[q.id]?.isCorrect) s.correct++;
      m.set(q.topic, s);
    });
    return Array.from(m.entries());
  })();

  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8] px-4 py-8">
      <div className="max-w-3xl w-full mx-auto space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900">Exam Complete</h2>
          <div className="mt-4 inline-flex flex-col items-center">
            <span className={`text-5xl font-black ${pct >= 75 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-rose-600"}`}>{pct}%</span>
            <span className="text-sm font-semibold text-slate-500 mt-1">
              {correct} / {total} correct
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">{pct >= 75 ? "Excellent work — keep it up!" : pct >= 50 ? "Good effort — review rationales and retake." : "Keep reviewing — you’ve got this!"}</p>

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-lg font-bold text-slate-900">{total}</div>
              <div className="text-xs text-slate-500">Questions</div>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-lg font-bold text-emerald-700">{correct}</div>
              <div className="text-xs text-emerald-700">Correct</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-lg font-bold text-rose-700">{total - correct}</div>
              <div className="text-xs text-rose-700">Wrong</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-slate-500" /> Topic Breakdown
          </h3>
          <div className="mt-4 space-y-3">
            {topicStats.map(([topic, s]) => {
              const p = Math.round((s.correct / s.total) * 100);
              return (
                <div key={topic} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-sm font-medium text-slate-700">{topic}</span>
                  <span className="text-sm font-bold text-slate-900">
                    {s.correct}/{s.total} <span className="text-slate-500 font-medium">({p}%)</span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onRetake} className="flex-1 py-3.5 rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2 shadow-sm">
            <RotateCcw className="w-5 h-5" /> Retake Quiz
          </button>
          <button onClick={onNewTopics} className="flex-1 py-3.5 rounded-xl font-bold bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300">
            Choose New Topics
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 flex gap-3 items-center text-sm text-slate-600">
          <Mail className="w-5 h-5 text-slate-400 shrink-0" />
          <span>
            Found a bug or have suggestions? Contact us at: <span className="font-bold text-slate-900">billyjoecruzada12@gmail.com</span>
          </span>
        </div>
      </div>
    </div>
  );
}
