// lib/file-parser.ts
"use client";

export async function parseFile(file: File): Promise<string> {
  const text = await file.text(); // or use PDF/text extractor
  return text;
}
