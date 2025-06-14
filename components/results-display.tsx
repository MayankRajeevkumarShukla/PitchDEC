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
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  TrendingUp,
  ThumbsDown,
  Lightbulb,
  Target,
  BarChart3,
} from "lucide-react"

interface ResultsDisplayProps {
  results: {
    rating?: number
    feedback?: Record<string, string>
    rawResponse?: string
    summary?: string
    strengths?: string[]
    weaknesses?: string[]
    nextSteps?: string[]
    comparableCompanies?: string[]
    riskAssessment?: Record<string, "High" | "Medium" | "Low">
    stage?: string
    investmentReadiness?: string
    sectionRatings?: Record<string, number>
  }
}

export default function ResultsDisplay({ results }: ResultsDisplayProps) {
  const [activeTab, setActiveTab] = useState("summary")

  const getRatingColor = (rating?: number) => {
    if (!rating) return "bg-gray-500"
    if (rating >= 8) return "bg-emerald-500"
    if (rating >= 6) return "bg-amber-500"
    return "bg-red-500"
  }

  const getRiskColor = (level: "High" | "Medium" | "Low") => {
    return level === "High"
      ? "bg-red-500"
      : level === "Medium"
      ? "bg-amber-500"
      : "bg-emerald-500"
  }

  return (
    <Card className="shadow-xl rounded-xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Pitch Deck Analysis</CardTitle>
          {results.rating !== undefined && (
            <Badge className={`text-white ${getRatingColor(results.rating)} px-3 py-1`}>
              Score: {results.rating}/10
            </Badge>
          )}
        </div>
        <CardDescription>Evaluation across 9 pitch sections and risk factors</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 gap-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="sections">Section Scores</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
            <TabsTrigger value="risks">Risk & Stage</TabsTrigger>
            {results.rawResponse && <TabsTrigger value="raw">Raw</TabsTrigger>}
          </TabsList>

          {/* SUMMARY */}
          <TabsContent value="summary">
            <div className="space-y-4">
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${getRatingColor(results.rating)} text-white mb-4`}
                >
                  <span className="text-3xl font-bold">{results.rating}/10</span>
                </div>
                <p className="text-lg font-semibold">Overall Rating</p>
                <p className="text-sm text-gray-500">{results.investmentReadiness}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium mb-2">Summary</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{results.summary}</p>
              </div>
            </div>
          </TabsContent>

          {/* SECTION SCORES */}
          <TabsContent value="sections">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.sectionRatings &&
                Object.entries(results.sectionRatings).map(([section, score]) => (
                  <div
                    key={section}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border"
                  >
                    <span className="capitalize text-sm font-medium">
                      {section.replace(/_/g, " ")}
                    </span>
                    <Badge className={`text-white ${getRatingColor(score)} px-2 py-1`}>
                      {score}/10
                    </Badge>
                  </div>
                ))}
            </div>
          </TabsContent>

          {/* INSIGHTS */}
          <TabsContent value="insights">
            <div className="space-y-6">
              {/* Strengths */}
              <div>
                <h4 className="text-md font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" /> Strengths
                </h4>
                <ul className="list-disc ml-5 text-sm text-green-700">
                  {results.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              </div>

              {/* Weaknesses */}
              <div>
                <h4 className="text-md font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Critical Weaknesses
                </h4>
                <ul className="list-disc ml-5 text-sm text-red-700">
                  {results.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>

              {/* Next Steps */}
              <div>
                <h4 className="text-md font-semibold flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" /> Next Steps
                </h4>
                <ul className="list-disc ml-5 text-sm text-gray-800">
                  {results.nextSteps?.map((step, i) => <li key={i}>{step}</li>)}
                </ul>
              </div>

              {/* Comparable Companies */}
              <div>
                <h4 className="text-md font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" /> Comparable Companies
                </h4>
                <ul className="list-disc ml-5 text-sm text-blue-800">
                  {results.comparableCompanies?.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
            </div>
          </TabsContent>

          {/* RISK & STAGE */}
          <TabsContent value="risks">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {results.riskAssessment &&
                Object.entries(results.riskAssessment).map(([type, level]) => (
                  <div
                    key={type}
                    className={`rounded-lg px-4 py-3 text-white ${getRiskColor(level)} flex justify-between items-center`}
                  >
                    <span className="capitalize font-medium">{type.replace(/_/g, " ")} risk</span>
                    <span className="text-sm font-bold uppercase">{level}</span>
                  </div>
                ))}
            </div>

            <div className="mt-6">
              <h4 className="text-md font-semibold">Stage</h4>
              <p className="text-sm text-gray-700">{results.stage}</p>
            </div>
          </TabsContent>

          {/* RAW */}
          {results.rawResponse && (
            <TabsContent value="raw">
              <div className="bg-gray-100 p-4 rounded-md max-h-96 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap break-words text-gray-800">
                  {typeof results.rawResponse === "string"
                    ? results.rawResponse
                    : JSON.stringify(results.rawResponse, null, 2)}
                </pre>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </CardContent>
    </Card>
  )
}
