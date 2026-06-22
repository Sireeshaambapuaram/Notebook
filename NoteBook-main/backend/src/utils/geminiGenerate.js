import { GoogleGenAI } from "@google/genai";

const DEFAULT_MODELS = [
  "gemini-2.5-flash-lite",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-lite-001",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
];

function isRateLimitError(error) {
  if (error?.status === 429) return true;
  if (error?.error?.code === 429) return true;
  if (error?.error?.status === "RESOURCE_EXHAUSTED") return true;
  const msg = error?.message;
  if (typeof msg === "string") {
    if (/"code"\s*:\s*429/.test(msg)) return true;
    if (msg.includes("RESOURCE_EXHAUSTED")) return true;
    if (msg.includes("quota") && msg.includes("exceeded")) return true;
  }
  return false;
}

/** API key invalid, revoked, or flagged — retrying other models will not help. */
function isPermissionOrAuthError(error) {
  if (error?.status === 403) return true;
  if (error?.error?.code === 403) return true;
  if (error?.error?.code === 401) return true;
  const msg = typeof error?.message === "string" ? error.message : "";
  if (msg.includes("PERMISSION_DENIED")) return true;
  if (msg.includes("API key") && msg.includes("leaked")) return true;
  return false;
}

/** Non-quota failures only (429 is silent; we try the next model). */
function logGeminiFailure(model, error) {
  const msg =
    typeof error?.message === "string" ? error.message : String(error);
  const short =
    msg.length > 200 ? `${msg.slice(0, 197).replace(/\s+/g, " ")}…` : msg;
  console.warn(`[Gemini] ${model}:`, short);
}

/**
 * One try per model, no sleep between models — fast path to offline fallback when quota is exhausted.
 * @param {string} contents - Full prompt / user message for the model
 * @returns {{ text: string | null, sawRateLimit: boolean, noKey: boolean }}
 */
export async function geminiGenerateText(contents) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) {
    return { text: null, sawRateLimit: false, noKey: true };
  }

  const ai = new GoogleGenAI({ apiKey });
  const envModel = process.env.GEMINI_SUMMARY_MODEL?.trim();
  const models = envModel ? [envModel] : DEFAULT_MODELS;

  let sawRateLimit = false;

  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
      });
      const text = response.text;
      if (text && text.trim()) {
        return { text: text.trim(), sawRateLimit: false, noKey: false };
      }
    } catch (error) {
      if (isPermissionOrAuthError(error)) {
        console.warn(
          "[Gemini] API key rejected or not allowed (403/401). Create a new key at https://aistudio.google.com/apikey and set GEMINI_API_KEY in backend/.env"
        );
        return { text: null, sawRateLimit: false, noKey: false };
      }
      if (isRateLimitError(error)) {
        sawRateLimit = true;
        continue;
      }
      logGeminiFailure(model, error);
      continue;
    }
  }

  if (sawRateLimit) {
    console.warn(
      "[Gemini] Rate limits or quota hit for all tried models — app will use offline fallback if available."
    );
  }

  return { text: null, sawRateLimit, noKey: false };
}
