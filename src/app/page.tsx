"use client";
import { useState, useCallback } from "react";
import type { Question, UserAnswer, QuizState } from "@/types/quiz";
import { QUESTIONS } from "@/data/questions";
import { getQuestionsByTopics } from "@/lib/quiz";
import WelcomeScreen from "@/components/WelcomeScreen";
import ConfigScreen from "@/components/ConfigScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultsScreen from "@/components/ResultsScreen";

export default function Home() {
  const [state, setState] = useState<QuizState>("START");
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, UserAnswer>>({});
  const [visited, setVisited] = useState<Set<number>>(new Set());
  const [lastConfig, setLastConfig] = useState<{ topics: string[]; count: number } | null>(null);

  const handleStart = useCallback(() => setState("CONFIG"), []);

  const handleProceed = useCallback((topics: string[], count: number) => {
    const qs = getQuestionsByTopics(QUESTIONS, topics, count);
    setQuizQuestions(qs);
    setCurrentIndex(0);
    setAnswers({});
    setVisited(new Set(qs[0] ? [qs[0].id] : []));
    setLastConfig({ topics, count });
    setState("QUIZ");
  }, []);

  const handleSelect = useCallback((qid: number, opt: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qid]: { questionId: qid, selectedOption: opt, isSubmitted: prev[qid]?.isSubmitted ?? false, isCorrect: prev[qid]?.isCorrect ?? null },
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    const q = quizQuestions[currentIndex];
    const ua = answers[q.id];
    if (!ua?.selectedOption || ua.isSubmitted) return;
    const isCorrect = ua.selectedOption === q.answer;
    setAnswers((prev) => ({ ...prev, [q.id]: { ...ua, isSubmitted: true, isCorrect } }));
  }, [answers, currentIndex, quizQuestions]);

  const handleNext = useCallback(() => {
    if (currentIndex < quizQuestions.length - 1) {
      const next = currentIndex + 1;
      setCurrentIndex(next);
      setVisited((prev) => new Set([...prev, quizQuestions[next].id]));
    }
  }, [currentIndex, quizQuestions]);

  const handleJump = useCallback((idx: number) => {
    setCurrentIndex(idx);
    setVisited((prev) => new Set([...prev, quizQuestions[idx].id]));
  }, [quizQuestions]);

  const handleFinish = useCallback(() => setState("RESULTS"), []);

  const handleRetake = useCallback(() => {
    if (!lastConfig) return;
    handleProceed(lastConfig.topics, lastConfig.count);
  }, [lastConfig, handleProceed]);

  if (state === "START") return <WelcomeScreen onStart={handleStart} />;
  if (state === "CONFIG") return <ConfigScreen onProceed={handleProceed} onBack={() => setState("START")} />;
  if (state === "QUIZ")
    return (
      <QuizScreen
        questions={quizQuestions}
        currentIndex={currentIndex}
        answers={answers}
        visited={visited}
        onSelect={handleSelect}
        onSubmit={handleSubmit}
        onNext={handleNext}
        onJump={handleJump}
        onFinish={handleFinish}
      />
    );
  return <ResultsScreen questions={quizQuestions} answers={answers} onRetake={handleRetake} onNewTopics={() => setState("CONFIG")} />;
}
