"use client"

import { useState } from "react"
import { FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import FileUploader from "@/components/file-uploader"
import ResultsDisplay from "@/components/results-display"
import { analyzeFile } from "@/lib/analyze-file"

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (selectedFile: File | null) => {
    setFile(selectedFile)
    setResults(null)
    setError(null)
  }

  const handleAnalyze = async () => {
    if (!file) return

    try {
      setIsAnalyzing(true)
      setProgress(10)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const result = await analyzeFile(file)
      clearInterval(progressInterval)
      setProgress(100)

      try {
        const parsedResult = typeof result === "string" ? JSON.parse(result) : result
        setResults(parsedResult)
      } catch (e) {
        setResults({ rawResponse: result })
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis")
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-2">Pitch Deck Analyzer</h1>
        <p className="text-gray-500 text-center mb-8">Upload your pitch deck and get AI-powered feedback instantly</p>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Upload Your Pitch Deck</CardTitle>
            <CardDescription>Supported formats: PDF, DOCX, TXT, MD, HTML</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onFileChange={handleFileChange} />
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {file ? (
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  {file.name}
                </div>
              ) : (
                "No file selected"
              )}
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={!file || isAnalyzing}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Pitch Deck"}
            </Button>
          </CardFooter>
        </Card>

        {isAnalyzing && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analyzing your pitch deck</CardTitle>
              <CardDescription>This may take a moment...</CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
              <div className="mt-2 text-sm text-gray-500 text-right">{progress}%</div>
            </CardContent>
          </Card>
        )}

        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <AlertCircle className="h-5 w-5 mr-2" />
                Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error}</p>
            </CardContent>
          </Card>
        )}

        {results && <ResultsDisplay results={results} />}
      </div>
    </main>
  )
}
