import Groq from "groq-sdk";

let client: Groq | null = null;

export function getGroqClient(): Groq {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not configured");
  if (!client) client = new Groq({ apiKey: key });
  return client;
}

export const GROQ_MODEL = "qwen/qwen3.8-27b";
export const GROQ_FALLBACK_MODEL = "qwen/qwen3-32b";
