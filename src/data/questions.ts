import type { Question } from "@/types/quiz";
import someRaw from "./some-questions.json";
import q1Raw from "./questionnaires-1.json";

export const TOPICS = [
  "Medical-Surgical Nursing",
  "Pediatric Nursing",
  "Maternal and Child Health",
  "Fundamentals of Nursing",
  "Psychiatric Nursing",
  "Community Health Nursing",
] as const;

export const ALL_TOPICS = ["ALL", ...TOPICS] as const;

type SomeRawType = {
  document_1_75_items_ms_random_questions: {
    item_number: number;
    question: string;
    options: Record<string, string>;
    correct_answer: string;
    rationale: string;
  }[];
};

const TOPIC_MAP = new Map<number, string>();
(q1Raw as Question[]).forEach((q) => TOPIC_MAP.set(q.id, q.topic));

function inferTopic(id: number, question: string): string {
  if (TOPIC_MAP.has(id)) return TOPIC_MAP.get(id)!;
  const q = question.toLowerCase();
  if (q.includes("kawasaki") || q.includes("toddler") || q.includes("infant") || q.includes("child") || q.includes("pediatric") || q.includes("newborn") || q.includes("tetralogy") || q.includes("bronchopulmonary")) return "Pediatric Nursing";
  if (q.includes("pregnan") || q.includes("postpartum") || q.includes("uterus") || q.includes("delivery") || q.includes("breastfeed") || q.includes("maternal")) return "Maternal and Child Health";
  if (q.includes("schizophrenia") || q.includes("depression") || q.includes("psychiatric") || q.includes("haloperidol") || q.includes("suicide") || q.includes("therapeutic relationship") || q.includes("domestic violence")) return "Psychiatric Nursing";
  if (q.includes("dengue") || q.includes("community") || q.includes("glaucoma") && q.includes("community")) return "Community Health Nursing";
  if (q.includes("assertive communication") || q.includes("pressure ulcer") || q.includes("z-track") || q.includes("fundamentals")) return "Fundamentals of Nursing";
  return TOPICS[(id - 1) % TOPICS.length];
}

function normalize(): Question[] {
  const raw = someRaw as unknown as SomeRawType;
  const list = raw.document_1_75_items_ms_random_questions;
  return list.map((item) => {
    const opts = Object.entries(item.options).map(([k, v]) => `${k}) ${v}`);
    const answerText = item.options[item.correct_answer];
    const answer = `${item.correct_answer}) ${answerText}`;
    return {
      id: item.item_number,
      topic: inferTopic(item.item_number, item.question),
      question: item.question,
      options: opts,
      answer,
      rationale: item.rationale.replace(/\[cite:[^\]]*\]/g, "").trim(),
    };
  });
}

export const QUESTIONS: Question[] = normalize();
