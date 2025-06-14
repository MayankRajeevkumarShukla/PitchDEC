// app/api/analyze/route.ts
import { analyzePitchDeck } from "@/lib/groq-api";

export async function POST(req: Request) {
  const { text } = await req.json();

  const sections = parseDynamicSections(text);
  const result = await analyzePitchDeck(sections);

  return Response.json(result);
}

function parseDynamicSections(text: string) {
  const lines = text.split("\n");
  const result: Record<string, string> = {};
  let currentSection: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const isHeader =
      /^#{1,6}\s/.test(trimmed) ||
      /^[A-Z ]{3,}$/.test(trimmed) ||
      /^[-=]{3,}\s*$/.test(trimmed) ||
      /^[A-Z][a-zA-Z\s]+$/.test(trimmed);

    if (isHeader) {
      const key = trimmed.replace(/^#+/, "").trim().toLowerCase().replace(/\s+/g, "_");
      currentSection = key;
      result[currentSection] = "";
    } else if (currentSection) {
      result[currentSection] += line + "\n";
    }
  }

  for (const key in result) {
    result[key] = result[key].trim();
  }

  return result;
}
