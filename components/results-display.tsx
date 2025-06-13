"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react"

interface ResultsDisplayProps {
  results: {
    rating?: number
    feedback?: Record<string, string>
    rawResponse?: string
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

  const getRatingIcon = (rating?: number) => {
    if (!rating) return null
    if (rating >= 8) return <CheckCircle className="h-5 w-5" />
    if (rating >= 6) return <AlertTriangle className="h-5 w-5" />
    return <AlertCircle className="h-5 w-5" />
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Analysis Results</CardTitle>
          {results.rating !== undefined && (
            <Badge className={`text-white ${getRatingColor(results.rating)}`}>Score: {results.rating}/10</Badge>
          )}
        </div>
        <CardDescription>AI-powered feedback on your pitch deck</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="summary" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Feedback</TabsTrigger>
            {results.rawResponse && <TabsTrigger value="raw">Raw Response</TabsTrigger>}
          </TabsList>

          <TabsContent value="summary">
            <div className="space-y-4">
              {results.rating !== undefined && (
                <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center h-24 w-24 rounded-full ${getRatingColor(results.rating)} text-white mb-4`}
                    >
                      <div className="text-3xl font-bold">{results.rating}/10</div>
                    </div>
                    <p className="text-lg font-medium">Overall Rating</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {results.rating >= 8
                        ? "Excellent pitch deck!"
                        : results.rating >= 6
                          ? "Good pitch with room for improvement"
                          : "Needs significant improvement"}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-lg font-medium mb-2">Key Takeaways</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {results.feedback &&
                    Object.entries(results.feedback)
                      .slice(0, 3)
                      .map(([section, feedback]) => (
                        <li key={section} className="text-sm">
                          <span className="font-medium">{section.replace(/_/g, " ")}:</span> {feedback}
                        </li>
                      ))}
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="detailed">
            <div className="space-y-4">
              {results.feedback &&
                Object.entries(results.feedback).map(([section, feedback]) => (
                  <div key={section} className="border-b pb-3 last:border-b-0">
                    <h3 className="font-medium capitalize mb-1">{section.replace(/_/g, " ")}</h3>
                    <p className="text-sm text-gray-700">{feedback}</p>
                  </div>
                ))}

              {(!results.feedback || Object.keys(results.feedback).length === 0) && (
                <p className="text-gray-500 italic">No detailed feedback available</p>
              )}
            </div>
          </TabsContent>

          {results.rawResponse && (
            <TabsContent value="raw">
              <div className="bg-gray-50 p-4 rounded-md">
                <pre className="text-xs overflow-auto whitespace-pre-wrap">
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
