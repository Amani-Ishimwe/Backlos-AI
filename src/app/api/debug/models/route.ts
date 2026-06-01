import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function GET() {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // List all available models for this API key
    const pager = await ai.models.list();
    const models: string[] = [];

    for await (const model of pager) {
      if (model.name) models.push(model.name);
    }

    return NextResponse.json({ 
      success: true, 
      keyPrefix: process.env.GEMINI_API_KEY?.slice(0, 8),
      models 
    });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err?.message || String(err),
      keyPrefix: process.env.GEMINI_API_KEY?.slice(0, 8),
    }, { status: 500 });
  }
}
