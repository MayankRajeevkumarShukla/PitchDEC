"use client"

import * as pdfjs from "pdfjs-dist"
import mammoth from "mammoth"

// Set up PDF.js worker
import pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function parseFile(file: File): Promise<string> {
  const fileType = file.name.split(".").pop()?.toLowerCase()

  switch (fileType) {
    case "pdf":
      return parsePdf(file)
    case "docx":
      return parseDocx(file)
    case "txt":
    case "md":
      return parseTextFile(file)
    case "html":
      return parseHtml(file)
    default:
      throw new Error(`Unsupported file type: ${fileType}`)
  }
}

async function parseTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string)
      } else {
        reject(new Error("Failed to read text file"))
      }
    }
    reader.onerror = () => reject(new Error("Error reading text file"))
    reader.readAsText(file)
  })
}

async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
  let text = ""

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item: any) => item.str).join(" ")
    text += pageText + "\n"
  }

  return text
}

async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

async function parseHtml(file: File): Promise<string> {
  const text = await parseTextFile(file)
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, "text/html")
  return doc.body.textContent || ""
}
