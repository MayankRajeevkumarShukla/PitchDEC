"use server"

import { parseFile } from "./file-parser"
import { analyzePitchDeck } from "./groq-api"

export async function analyzeFile(file: File): Promise<any> {
  try {
    // Parse the file content
    const text = await parseFile(file)

    // Extract sections from the text
    const sections = parseDynamicSections(text)

    // Send to GROQ API for analysis
    const result = await analyzePitchDeck(sections)

    return result
  } catch (error: any) {
    console.error("Analysis error:", error)
    throw new Error(error.message || "Failed to analyze file")
  }
}

function parseDynamicSections(text: string) {
  const lines = text.split("\n")
  const result: Record<string, string> = {}
  let currentSection: string | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    const isHeader =
      /^#{1,6}\s/.test(trimmed) ||
      /^[A-Z ]{3,}$/.test(trimmed) ||
      /^[-=]{3,}\s*$/.test(trimmed) ||
      /^[A-Z][a-zA-Z\s]+$/.test(trimmed)

    if (isHeader) {
      const key = trimmed.replace(/^#+/, "").trim().toLowerCase().replace(/\s+/g, "_")
      currentSection = key
      result[currentSection] = ""
    } else if (currentSection) {
      result[currentSection] += line + "\n"
    }
  }

  for (const key in result) {
    result[key] = result[key].trim()
  }

  return result
}
