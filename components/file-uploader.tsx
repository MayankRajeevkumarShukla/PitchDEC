"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FileUploaderProps {
  onFileChange: (file: File | null) => void
}

export default function FileUploader({ onFileChange }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileChange(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onFileChange(e.target.files[0])
    }
  }

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onFileChange(null)
  }

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center
        ${dragActive ? "border-emerald-500 bg-emerald-50" : "border-gray-300 bg-gray-50"}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept=".pdf,.docx,.txt,.md,.html" />

      <Upload className="h-10 w-10 text-gray-400 mb-2" />
      <p className="mb-2 text-sm text-gray-500">
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-gray-500">PDF, DOCX, TXT, MD, or HTML</p>

      <div className="mt-4">
        <Button type="button" variant="outline" onClick={handleClick} className="mr-2">
          Select File
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={handleClear}
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>
    </div>
  )
}
