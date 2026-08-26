import type { Question } from "@/types/quiz";

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getQuestionsByTopics(
  all: Question[],
  selected: string[],
  count: number
): Question[] {
  const topics = selected.includes("ALL") ? [...all.map((q) => q.topic)] : selected;
  const pool = selected.includes("ALL") ? all : all.filter((q) => topics.includes(q.topic));
  const grouped = new Map<string, Question[]>();
  pool.forEach((q) => {
    const g = grouped.get(q.topic) ?? [];
    g.push(q);
    grouped.set(q.topic, g);
  });
  const shuffledGroups = Array.from(grouped.entries()).map(([topic, qs]) => [topic, shuffle(qs)] as const);
  const shuffledOrder = shuffle(shuffledGroups);
  const result: Question[] = [];
  let idx = 0;
  while (result.length < count) {
    let added = false;
    for (const [, qs] of shuffledOrder) {
      if (idx < qs.length && result.length < count) {
        result.push(qs[idx]);
        added = true;
      }
    }
    if (!added) {
      const extra = shuffle(pool);
      for (const q of extra) {
        if (result.length >= count) break;
        result.push({ ...q, id: q.id * 1000 + result.length });
      }
      break;
    }
    idx++;
  }
  return shuffle(result);
}

export function validateConfig(selected: string[], target: number): { valid: boolean; warning: string | null } {
  if (selected.length === 0) return { valid: false, warning: null };
  if (target > 75 && selected.filter((t) => t !== "ALL").length < 4 && !selected.includes("ALL")) {
    return { valid: false, warning: `WARNING: More than 75 questions are chosen. Please select at least 4 topics to avoid repetitive questions.` };
  }
  if (target > 50 && selected.filter((t) => t !== "ALL").length < 3 && !selected.includes("ALL")) {
    return { valid: false, warning: `WARNING: More than 50 questions are chosen. Please select at least 3 topics to avoid repetitive questions.` };
  }
  if (target > 15 && selected.filter((t) => t !== "ALL").length < 2 && !selected.includes("ALL")) {
    return { valid: false, warning: `WARNING: More than 15 questions are chosen. Please select at least 2 topics to avoid repetitive questions.` };
  }
  if (target > 15 && selected.filter((t) => t !== "ALL").length < 2 && !selected.includes("ALL")) {
    return { valid: false, warning: `WARNING: More than 15 questions are chosen. Please select more topics to avoid repetitive questions.` };
  }
  const poolWarning = (() => {
    if (selected.includes("ALL")) return null;
    if (target > 15 && selected.length < 2) return `WARNING: More than ${target} questions are chosen. Please select more topics to avoid repetitive questions.`;
    if (target > 50 && selected.length < 3) return `WARNING: More than ${target} questions are chosen. Please select more topics to avoid repetitive questions.`;
    if (target > 75 && selected.length < 4) return `WARNING: More than ${target} questions are chosen. Please select more topics to avoid repetitive questions.`;
    return null;
  })();
  return { valid: true, warning: poolWarning };
}
