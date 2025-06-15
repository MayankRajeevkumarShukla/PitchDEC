"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  ThumbsDown,
  Lightbulb,
  Target,
  BarChart3,
  Users,
  DollarSign,
  TrendingDown,
  Star,
} from "lucide-react"

interface SectionRating {
  score: number
  weight: number
}

interface DetailedFeedback {
  strengths: string[]
  critical_weaknesses: string[]
  section_feedback: Record<string, string>
}

interface ResultsDisplayProps {
  results: {
    overall_rating?: number
    stage_assessment?: string
    investment_readiness?: string
    section_ratings?: Record<string, SectionRating>
    detailed_feedback?: DetailedFeedback
    next_steps?: string[]
    comparable_companies?: string[]
    risk_assessment?: Record<string, "High" | "Medium" | "Low">
    rawResponse?: string
  }
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const getRatingColor = (rating?: number) => {
    if (!rating) return "bg-gray-500"
    if (rating >= 8) return "bg-emerald-500"
    if (rating >= 6) return "bg-amber-500"
    return "bg-red-500"
  }

  const getRatingLabel = (rating?: number) => {
    if (!rating) return "Not Rated"
    if (rating >= 9) return "Exceptional"
    if (rating >= 7) return "Strong"
    if (rating >= 5) return "Average"
    if (rating >= 3) return "Weak"
    return "Poor"
  }

  const getRiskColor = (level: "High" | "Medium" | "Low") => {
    return level === "High"
      ? "destructive"
      : level === "Medium"
      ? "secondary"
      : "default"
  }

  const sectionLabels: Record<string, string> = {
    problem_market: "Problem & Market",
    solution_product: "Solution & Product",
    business_model: "Business Model",
    market_analysis: "Market Analysis",
    traction: "Traction & Validation",
    team: "Team & Execution",
    financials: "Financial Projections",
    go_to_market: "Go-to-Market",
    funding_ask: "Investment Ask"
  }

  return (
    <Card className="shadow-xl rounded-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold">Pitch Deck Analysis</CardTitle>
            <CardDescription className="text-gray-600 mt-1">
              {results.stage_assessment && `${results.stage_assessment} • `}
              Comprehensive evaluation across 9 key areas
            </CardDescription>
          </div>
          {results.overall_rating !== undefined && (
            <div className="text-right">
              <Badge className={`text-white ${getRatingColor(results.overall_rating)} px-3 py-1 text-lg mb-1`}>
                {results.overall_rating.toFixed(1)}/10
              </Badge>
              <div className="text-sm text-gray-600">
                {getRatingLabel(results.overall_rating)}
              </div>
            </div>
          )}
        </div>
        {results.investment_readiness && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Investment Readiness</span>
            </div>
            <p className="text-sm text-blue-700 mt-1">{results.investment_readiness}</p>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 w-full justify-start overflow-x-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="sections" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Section Breakdown
            </TabsTrigger>
            <TabsTrigger value="feedback" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Detailed Feedback
            </TabsTrigger>
            <TabsTrigger value="risks" className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Risk Assessment
            </TabsTrigger>
            <TabsTrigger value="next-steps" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Next Steps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Strengths & Weaknesses */}
            <div className="grid md:grid-cols-2 gap-6">
              {results.detailed_feedback?.strengths && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-emerald-700">
                      <CheckCircle className="w-5 h-5" />
                      Key Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.detailed_feedback.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Star className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {results.detailed_feedback?.critical_weaknesses && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                      <AlertCircle className="w-5 h-5" />
                      Critical Weaknesses
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.detailed_feedback.critical_weaknesses.map((weakness, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Comparable Companies */}
            {results.comparable_companies && results.comparable_companies.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Market Comparisons
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.comparable_companies.map((company, index) => (
                      <li key={index} className="text-sm p-2 bg-gray-50 rounded border-l-4 border-blue-400">
                        {company}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            {results.section_ratings && Object.entries(results.section_ratings).map(([key, rating]) => (
              <Card key={key}>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{sectionLabels[key] || key}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{rating.weight}% weight</Badge>
                      <Badge className={`${getRatingColor(rating.score)} text-white`}>
                        {rating.score}/10
                      </Badge>
                    </div>
                  </div>
                  <Progress value={rating.score * 10} className="h-2 mb-2" />
                  <p className="text-sm text-gray-600">{getRatingLabel(rating.score)}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {results.detailed_feedback?.section_feedback && Object.entries(results.detailed_feedback.section_feedback).map(([key, feedback]) => (
              <Card key={key}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">{sectionLabels[key] || key}</CardTitle>
                  {results.section_ratings?.[key] && (
                    <Badge className={`${getRatingColor(results.section_ratings[key].score)} text-white w-fit`}>
                      {results.section_ratings[key].score}/10
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed">{feedback}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="risks" className="space-y-4">
            {results.risk_assessment && (
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(results.risk_assessment).map(([risk, level]) => (
                  <Card key={risk}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium capitalize">
                          {risk.replace('_', ' ')} Risk
                        </h3>
                        <Badge variant={getRiskColor(level)}>
                          {level}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="next-steps" className="space-y-4">
            {results.next_steps && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Recommended Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3">
                    {results.next_steps.map((step, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}