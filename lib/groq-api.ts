"use server"

export async function analyzePitchDeck(sections: Record<string, string>): Promise<any> {
  const GROQ_API_KEY = "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"

  const sectionText = Object.entries(sections)
    .map(([title, content]) => `### ${title.replace(/_/g, " ").toUpperCase()}\n${content}`)
    .join("\n\n")

  const prompt = `
You are a senior venture capital partner with 15+ years of experience evaluating startup pitch decks. You've seen over 10,000 pitches and invested in 200+ companies, with notable exits including several unicorns.

EVALUATION FRAMEWORK:
Rate each section individually (1-10), then provide an overall rating based on weighted averages:

SECTION WEIGHTS & CRITERIA:
1. Problem/Market Opportunity (20%): 
   - Is the problem significant, urgent, and widespread?
   - Market size validation and growth potential
   - Personal connection/pain point demonstration

2. Solution & Product (18%):
   - Clarity and uniqueness of the solution
   - Product-market fit evidence
   - Technical feasibility and innovation level

3. Business Model & Revenue (15%):
   - Revenue model clarity and scalability
   - Unit economics and path to profitability
   - Multiple revenue streams potential

4. Market Analysis & Competition (12%):
   - TAM/SAM/SOM breakdown with sources
   - Competitive landscape understanding
   - Differentiation and competitive advantages

5. Traction & Validation (15%):
   - Customer acquisition and retention metrics
   - Revenue growth and key milestones
   - Market validation evidence (LOIs, pilots, etc.)

6. Team & Execution (10%):
   - Founder-market fit and relevant experience
   - Team completeness and skill gaps
   - Previous startup/industry experience

7. Financial Projections (5%):
   - Realistic assumptions and growth projections
   - Key metrics and unit economics
   - Funding requirements justification

8. Go-to-Market Strategy (3%):
   - Customer acquisition strategy
   - Sales and marketing channels
   - Partnership and distribution plans

9. Investment Ask & Use of Funds (2%):
   - Clear funding requirements
   - Specific allocation of funds
   - Milestones and timeline

RATING SCALE:
- 9-10: Exceptional - Top 5% of pitches, immediate investment consideration
- 7-8: Strong - Well-executed with minor gaps, worth deeper discussion
- 5-6: Average - Has potential but needs significant improvements
- 3-4: Weak - Major flaws or missing critical elements
- 1-2: Poor - Not investment ready, fundamental issues

ANALYSIS REQUIREMENTS:
- Be brutally honest but constructive
- Compare against industry benchmarks
- Identify 3 biggest strengths and 3 biggest weaknesses
- Suggest specific, actionable improvements
- Consider stage-appropriate expectations (pre-seed vs Series A)
- Flag any red flags or concerning elements

IMPORTANT: Respond with VALID JSON only. No markdown, no backticks, no additional text. Start directly with { and end with }.

OUTPUT FORMAT:
{
  "overall_rating": 6.8,
  "stage_assessment": "Seed-stage startup",
  "investment_readiness": "Needs 2-3 months of improvements before investor meetings",
  "section_ratings": {
    "problem_market": { "score": 7, "weight": 20 },
    "solution_product": { "score": 6, "weight": 18 },
    "business_model": { "score": 5, "weight": 15 },
    "market_analysis": { "score": 8, "weight": 12 },
    "traction": { "score": 4, "weight": 15 },
    "team": { "score": 7, "weight": 10 },
    "financials": { "score": 6, "weight": 5 },
    "go_to_market": { "score": 5, "weight": 3 },
    "funding_ask": { "score": 7, "weight": 2 }
  },
  "detailed_feedback": {
    "strengths": [
      "Strong market opportunity with $50B TAM and 25% CAGR",
      "Experienced founding team with 2 previous exits",
      "Clear competitive differentiation through proprietary technology"
    ],
    "critical_weaknesses": [
      "No customer traction or revenue despite 18 months of development",
      "Business model lacks clarity on customer acquisition costs",
      "Financial projections seem overly optimistic without supporting data"
    ],
    "section_feedback": {
      "problem_market": "Well-articulated problem with strong market research. Add more personal anecdotes and customer interviews to strengthen emotional connection.",
      "solution_product": "Solution is clear but needs more technical depth. Include product demos, user testimonials, or beta testing results.",
      "business_model": "Revenue model is mentioned but lacks detail. Provide unit economics, customer lifetime value, and acquisition cost breakdowns.",
      "market_analysis": "Excellent market research with credible sources. Consider adding bottom-up market sizing to validate TAM claims.",
      "traction": "This is the weakest section. Need concrete metrics: users, revenue, partnerships, or pilot programs. Consider pivoting if no traction after 18 months.",
      "team": "Strong technical team but missing sales/marketing expertise. Consider adding a business development co-founder or advisor.",
      "financials": "Projections lack supporting assumptions. Show scenario planning and key driver analysis.",
      "go_to_market": "Generic approach without channel-specific strategies. Define ideal customer profile and prioritize 1-2 acquisition channels.",
      "funding_ask": "Clear ask but tie funding milestones to specific achievements and metrics."
    }
  },
  "next_steps": [
    "Focus on customer development and early traction in next 90 days",
    "Refine business model with clear unit economics",
    "Add business development expertise to team or advisory board"
  ],
  "comparable_companies": [
    "Similar to early-stage [Company X] but lacks their customer validation",
    "Technical approach reminiscent of [Company Y] with better market positioning"
  ],
  "risk_assessment": {
    "execution_risk": "High",
    "market_risk": "Medium",
    "team_risk": "Low",
    "technology_risk": "Medium"
  }
}

--- PITCH DECK CONTENT ---;

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
    const rawContent = data.choices[0].message.content
    
    // Parse the JSON response
    try {
      const parsedResult = JSON.parse(rawContent)
      return parsedResult
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError)
      console.error("Raw response:", rawContent)
      throw new Error("Failed to parse AI response as JSON")
    }
  } catch (error: any) {
    console.error("GROQ API error:", error)
    throw new Error(error.message || "Failed to analyze with GROQ API")
  }
}