// components/FileUploadClient.tsx
"use client";

import { useState } from "react";
import { parseFile } from "@/lib/file-parser";

export default function FileUploadClient() {
  const [result, setResult] = useState(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await parseFile(file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <>
      <input type="file" onChange={handleFileChange} />
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </>
  );
}
