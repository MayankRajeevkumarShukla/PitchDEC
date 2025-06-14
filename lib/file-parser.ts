// lib/file-parser.ts
"use client";

export async function parseFile(file: File): Promise<string> {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();
  
  try {
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await parsePDF(file);
    } else if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
      return await parseDOCX(file);
    } else if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await file.text();
    } else if (fileType === 'text/markdown' || fileName.endsWith('.md')) {
      return await file.text();
    } else if (fileType === 'text/html' || fileName.endsWith('.html')) {
      return await parseHTML(file);
    } else {
      // Fallback to text for unknown types
      return await file.text();
    }
  } catch (error) {
    console.error('Error parsing file:', error);
    throw new Error(`Failed to parse file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function parsePDF(file: File): Promise<string> {
  // Using PDF-lib for client-side PDF parsing (lighter than pdf-parse)
  const pdfjsLib = await import('pdfjs-dist');
  
  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
  
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  
  let fullText = '';
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const textItems = textContent.items as any[];
    
    // Extract text and maintain some structure
    let pageText = '';
    let lastY = -1;
    
    textItems.forEach((item) => {
      // Add line break if we're on a significantly different Y position
      if (lastY !== -1 && Math.abs(lastY - item.transform[5]) > 5) {
        pageText += '\n';
      }
      pageText += item.str + ' ';
      lastY = item.transform[5];
    });
    
    fullText += `\n--- Page ${i} ---\n${pageText}\n`;
  }
  
  return fullText.trim();
}

async function parseDOCX(file: File): Promise<string> {
  const mammoth = await import('mammoth');
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

async function parseHTML(file: File): Promise<string> {
  const htmlContent = await file.text();
  // Create a temporary div to extract text content
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  return tempDiv.textContent || tempDiv.innerText || '';
}