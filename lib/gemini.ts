import { Sermon } from "./types"

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY

export async function generateSermon(topic: string): Promise<Sermon> {
  if (!GEMINI_API_KEY) {
    throw new Error("Missing EXPO_PUBLIC_GEMINI_API_KEY")
  }

  const systemInstruction =
    "You are a helpful assistant that returns only valid JSON. Do not include any extra text."

  const prompt = `Return ONLY valid minified JSON with keys: verses (array of 2 strings), interpretation (string), story (string). Do not include markdown, code fences, or commentary. Example: {"verses":["...","..."],"interpretation":"...","story":"..."}. Now create content about: "${topic}".`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          { role: "user", parts: [{ text: systemInstruction }] },
          { role: "user", parts: [{ text: prompt }] },
        ],
        generationConfig: {
          temperature: 0.8,
        },
      }),
    }
  )

  if (!res.ok) {
    throw new Error(`Gemini error: ${res.status}`)
  }

  const result = await res.json()
  const text: string | undefined = result?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error("Unexpected Gemini response format")
  }

  const trimmed = text.trim().replace(/^```(json)?/i, "").replace(/```$/, "").trim()
  let json: unknown
  try {
    json = JSON.parse(trimmed)
  } catch {
    throw new Error("Gemini returned non-JSON content")
  }

  // Basic shape validation
  const maybe = json as Partial<Sermon>
  if (!maybe || !Array.isArray(maybe.verses) || maybe.verses.length < 1 || !maybe.interpretation || !maybe.story) {
    throw new Error("Gemini JSON failed validation")
  }

  return {
    verses: maybe.verses,
    interpretation: maybe.interpretation,
    story: maybe.story,
  } as Sermon
}


