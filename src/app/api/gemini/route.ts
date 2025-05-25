import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { prompt, systemMessage } = await req.json()
  const apiKey = "AIzaSyAZnliJTyXsOlTERc4cbhIewRHG2txeCyY"

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: systemMessage }],
          },
          {
            role: "model",
            parts: [{ text: "I understand and will follow these guidelines." }],
          },
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  )

  const data = await geminiResponse.json()
  return NextResponse.json(data)
}
