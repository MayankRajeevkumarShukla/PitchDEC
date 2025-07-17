// app/api/analyze/route.ts
import { analyzePitchDeck } from "@/lib/groq-api";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return Response.json(
        { error: 'Text content is required' },
        { status: 400 }
      );
    }

    const sections = parseDynamicSections(text);
    
    // Check if sections were parsed successfully
    if (Object.keys(sections).length === 0) {
      return Response.json(
        { error: 'No sections found in the provided text' },
        { status: 400 }
      );
    }

    console.log('Parsed sections:', Object.keys(sections));
    
    const result = await analyzePitchDeck(sections);
    
    return Response.json(result);
  } catch (error: any) {
    console.error('API route error:', error);
    
    // Return a more detailed error response
    return Response.json(
      { 
        error: error.message || 'Failed to analyze pitch deck',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

function parseDynamicSections(text: string) {
  const lines = text.split("\n");
  const result: Record<string, string> = {};
  let currentSection: string | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    
    // Skip empty lines when looking for headers
    if (trimmed === "") continue;
    
    const isHeader =
      /^#{1,6}\s/.test(trimmed) ||
      /^[A-Z ]{3,}$/.test(trimmed) ||
      /^[-=]{3,}\s*$/.test(trimmed) ||
      /^[A-Z][a-zA-Z\s]+$/.test(trimmed);

    if (isHeader) {
      const key = trimmed
        .replace(/^#+/, "")
        .replace(/^[-=]+/, "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "_");
      
      // Only create section if key is not empty
      if (key) {
        currentSection = key;
        result[currentSection] = "";
      }
    } else if (currentSection) {
      result[currentSection] += line + "\n";
    }
  }

  // Clean up sections
  for (const key in result) {
    result[key] = result[key].trim();
    
    // Remove empty sections
    if (result[key] === "") {
      delete result[key];
    }
  }

  return result;
}