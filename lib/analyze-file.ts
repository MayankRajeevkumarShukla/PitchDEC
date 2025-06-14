"use client"

import { parseFile } from "./file-parser"

export async function analyzeFile(file: File): Promise<any> {
  const text = await parseFile(file)

  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })

  if (!response.ok) throw new Error("Failed to analyze file")

  return response.json()
}
