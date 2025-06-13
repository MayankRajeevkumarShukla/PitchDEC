"use server"

export async function analyzePitchDeck(sections: Record<string, string>): Promise<any> {
  const GROQ_API_KEY = "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"

  const sectionText = Object.entries(sections)
    .map(([title, content]) => `### ${title.replace(/_/g, " ").toUpperCase()}\n${content}`)
    .join("\n\n")

  const prompt = `
You're a venture capital AI. Below is a startup pitch deck split into sections.

Evaluate the pitch out of 10 based on clarity, completeness, and potential. Then for each section, give 1–2 lines of constructive feedback on what can be improved.

Reply in JSON format like:
{
  "rating": 8,
  "feedback": {
    "introduction": "Needs stronger hook.",
    "problem": "Well explained.",
    ...
  }
}

--- PITCH DECK CONTENT ---

${sectionText}
`

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "compound-beta-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error?.message || "API request failed")
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error: any) {
    console.error("GROQ API error:", error)
    throw new Error(error.message || "Failed to analyze with GROQ API")
  }
}
