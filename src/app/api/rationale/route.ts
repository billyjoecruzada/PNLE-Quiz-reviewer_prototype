import { NextRequest, NextResponse } from "next/server";
import { getGroqClient, GROQ_MODEL, GROQ_FALLBACK_MODEL } from "@/lib/groq";

const rateMap = new Map<string, { count: number; reset: number }>();
const RATE_LIMIT = 20;
const WINDOW_MS = 60_000;
const MAX_QUESTION_LEN = 2000;
const MAX_OPTIONS_LEN = 1000;

function getClientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? req.headers.get("x-real-ip") ?? "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = rateMap.get(ip);
  if (!rec || now > rec.reset) {
    rateMap.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  if (rec.count >= RATE_LIMIT) return true;
  rec.count += 1;
  return false;
}

function sanitize(s: string): string {
  return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim().slice(0, MAX_QUESTION_LEN);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Rate limit exceeded. Try again in a minute." }, { status: 429 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body.question !== "string" || typeof body.answer !== "string") {
      return NextResponse.json({ error: "Invalid request body. Required: question, answer" }, { status: 400 });
    }

    const question = sanitize(body.question);
    const answer = sanitize(body.answer).slice(0, 200);
    const topic = typeof body.topic === "string" ? sanitize(body.topic).slice(0, 100) : "Nursing";
    let options: Record<string, string> | string[] | undefined = body.options;
    if (options && typeof options === "object" && !Array.isArray(options)) {
      const cleaned: Record<string, string> = {};
      for (const [k, v] of Object.entries(options as Record<string, string>)) {
        if (/^[A-D]$/i.test(k) && typeof v === "string") cleaned[k.toUpperCase()] = v.slice(0, MAX_OPTIONS_LEN);
      }
      options = cleaned;
    }

    if (question.length < 10 || answer.length < 1) {
      return NextResponse.json({ error: "Invalid question or answer" }, { status: 400 });
    }

    const groq = getGroqClient();
    const systemPrompt =
      "You are a PNLE expert nurse educator. Given a nursing question, options, and correct answer, provide a concise 2-3 sentence factual rationale explaining why the correct answer is correct. Be evidence-based, no disallowed content, plain text only.";

    const userPrompt = `Question: ${question}\nOptions: ${JSON.stringify(options)}\nCorrect Answer: ${answer}\nTopic: ${topic}\nProvide rationale.`;

    const tryModels = [GROQ_MODEL, GROQ_FALLBACK_MODEL];
    let content = "";
    let lastErr: unknown = null;
    for (const model of tryModels) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
          max_tokens: 300,
        });
        content = completion.choices[0]?.message?.content?.trim() ?? "";
        if (content) break;
      } catch (e: unknown) {
        lastErr = e;
        const msg = e instanceof Error ? e.message : String(e);
        const isModelNotFound = /model/i.test(msg) && /not.*found|does not exist/i.test(msg);
        if (!isModelNotFound) throw e;
      }
    }

    if (!content) throw lastErr ?? new Error("Empty response from LLM");

    const rationale = `AI Rationale: ${content.replace(/^AI\s*(answer|rationale):\s*/i, "").trim()}`;

    return NextResponse.json({ rationale }, { status: 200 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    const isAuth = /api.*key|unauthorized|401/i.test(msg);
    if (isAuth) return NextResponse.json({ error: "LLM auth failed" }, { status: 502 });
    return NextResponse.json({ error: "Failed to generate rationale" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
