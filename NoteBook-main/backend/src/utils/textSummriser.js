import { geminiGenerateText } from "./geminiGenerate.js";

function fallbackSummary(noteContent) {
  const t = noteContent.trim().replace(/\s+/g, " ");
  if (!t) return "";
  return t.length > 800 ? `${t.slice(0, 797)}…` : t;
}

export default async function textSummarizer(noteContent) {
  try {
    if (!noteContent || !noteContent.trim()) {
      return { analysis: "No content provided." };
    }

    const prompt = `Summarize the following note clearly and concisely. Use short paragraphs or bullet points if it helps readability.\n\nNOTE:\n${noteContent}`;

    const { text, noKey } = await geminiGenerateText(prompt);

    if (text) {
      return { analysis: text };
    }

    if (noKey) {
      const fb = fallbackSummary(noteContent);
      return { analysis: fb || "No content to summarize." };
    }

    const fb = fallbackSummary(noteContent);
    if (fb) {
      return { analysis: fb };
    }

    return {
      analysis: "Could not generate a summary. Try again later.",
    };
  } catch (error) {
    console.error("[summary]", error?.message || error);
    const fb = fallbackSummary(noteContent || "");
    return {
      analysis: fb || "Error generating summary.",
    };
  }
}
