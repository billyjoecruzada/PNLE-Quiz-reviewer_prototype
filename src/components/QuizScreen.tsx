"use client";
import type { Question, UserAnswer } from "@/types/quiz";
import { CheckCircle2, XCircle, ChevronRight, Flag } from "lucide-react";

export default function QuizScreen({
  questions,
  currentIndex,
  answers,
  visited,
  onSelect,
  onSubmit,
  onNext,
  onJump,
  onFinish,
}: {
  questions: Question[];
  currentIndex: number;
  answers: Record<number, UserAnswer>;
  visited: Set<number>;
  onSelect: (qid: number, opt: string) => void;
  onSubmit: () => void;
  onNext: () => void;
  onJump: (idx: number) => void;
  onFinish: () => void;
}) {
  const q = questions[currentIndex];
  const ua = answers[q.id];
  const isSubmitted = ua?.isSubmitted;

  return (
    <div className="flex flex-1 flex-col bg-[#F0F4F8]">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-slate-600">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-medium">{q.topic}</span>
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
            {questions.map((qq, idx) => {
              const a = answers[qq.id];
              const isCurrent = idx === currentIndex;
              let cls = "border-2 border-slate-300 text-slate-500 bg-white";
              if (a?.isSubmitted) cls = a.isCorrect ? "bg-emerald-500 text-white border-emerald-500" : "bg-rose-500 text-white border-rose-500";
              else if (a?.selectedOption || visited.has(qq.id)) cls = "bg-slate-400 text-white border-slate-400";
              return (
                <button
                  key={qq.id + "-" + idx}
                  onClick={() => onJump(idx)}
                  className={`h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-all ${cls} ${isCurrent ? "ring-2 ring-emerald-400 ring-offset-1" : ""}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-4">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-bold text-slate-900 leading-relaxed text-[17px]">{q.question}</h3>

          <div className="mt-5 space-y-3">
            {q.options.map((opt) => {
              const selected = ua?.selectedOption === opt;
              let card = "border-slate-200 bg-white hover:border-slate-300";
              if (isSubmitted) {
                if (opt === q.answer) card = "border-emerald-500 bg-emerald-50";
                else if (selected) card = "border-rose-400 bg-rose-50";
                else card = "border-slate-200 bg-slate-50 opacity-60";
              } else if (selected) card = "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500";
              return (
                <button
                  key={opt}
                  disabled={!!isSubmitted}
                  onClick={() => onSelect(q.id, opt)}
                  className={`w-full text-left p-4 rounded-xl border-2 flex gap-3 items-start transition-all ${card}`}
                >
                  <span className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300 bg-white"}`}>{selected && <span className="w-2 h-2 bg-white rounded-full" />}</span>
                  <span className="text-slate-800 text-sm leading-relaxed">{opt}</span>
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <div className={`mt-6 rounded-xl border-2 p-4 ${ua.isCorrect ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold ${ua.isCorrect ? "bg-emerald-600 text-white" : "bg-rose-500 text-white"}`}>
                {ua.isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {ua.isCorrect ? "Correct" : "Wrong"} — Answer: {q.answer}
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{q.rationale}</p>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            {!isSubmitted ? (
              <button
                onClick={onSubmit}
                disabled={!ua?.selectedOption}
                className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 ${ua?.selectedOption ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
              >
                <Flag className="w-4 h-4" /> Submit Answer
              </button>
            ) : (
              <span className="text-sm text-slate-500 py-3">Answer submitted</span>
            )}
            <div className="flex-1" />
            {currentIndex < questions.length - 1 ? (
              <button onClick={onNext} className="px-6 py-3 rounded-xl font-semibold bg-white border-2 border-slate-200 text-slate-700 hover:border-slate-300 flex items-center gap-2">
                {isSubmitted ? "Next Question" : "Skip"} <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={onFinish} className="px-6 py-3 rounded-xl font-bold bg-slate-900 text-white hover:bg-black">
                Finish Exam
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-between text-xs text-slate-500 px-1">
          <span>
            {Object.values(answers).filter((a) => a.isSubmitted).length} answered • {Object.values(answers).filter((a) => a.isSubmitted && a.isCorrect).length} correct
          </span>
          <button onClick={onFinish} className="underline hover:text-slate-700">Finish Exam</button>
        </div>
      </div>
    </div>
  );
}
