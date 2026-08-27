import type { Question } from "@/types/quiz";
import fullRaw from "./full-questions.json";

export const TOPICS = [
  "Medical-Surgical Nursing",
  "Pediatric Nursing",
  "Maternal and Child Health",
  "Fundamentals of Nursing",
  "Psychiatric Nursing",
  "Community Health Nursing",
] as const;

export const ALL_TOPICS = ["ALL", ...TOPICS] as const;

type FullRaw = {
  id: number;
  topic?: string;
  question: string;
  options: Record<string, string>;
  answer: string;
  rationale: string;
};

function normalize(): Question[] {
  const list = fullRaw as unknown as FullRaw[];
  return list.map((item) => {
    const opts = Object.entries(item.options).map(([k, v]) => `${k}) ${v}`);
    const answerText = item.options[item.answer] ?? "";
    const answer = answerText ? `${item.answer}) ${answerText}` : item.answer;
    return {
      id: item.id,
      topic: item.topic ?? "Medical-Surgical Nursing",
      question: item.question,
      options: opts,
      answer,
      rationale: (item.rationale ?? "").replace(/\[cite:[^\]]*\]/g, "").trim(),
    };
  });
}

export const QUESTIONS: Question[] = normalize();
