// app/api/chat/route.ts
import { NextRequest } from "next/server";
import { streamText, tool } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

import { getFile } from "@/lib/tools/github";

// Configure Gemini using your GEMINI_API_KEY
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Tool to read files from your DualPilot repo
const githubGetFile = tool({
  description: "Read a file from the DualPilot GitHub repo.",
  parameters: {
    path: { type: "string" },
  },
  async execute({ path }: { path: string }) {
    const { content, sha } = await getFile(path);
    return { content, sha };
  },
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages } = body;

  const result = await streamText({
    model: google("gemini-1.5-flash"), // you can change to gemini-1.5-pro later if you want
    messages,
    system: `
You are DualPilot Dev Bot, an internal engineer for the DualPilot app.

You have a tool called githubGetFile that can read real files from the DualPilot GitHub repository.

Rules:
- Always call githubGetFile before talking about a specific file so you are working from the actual code.
- Never invent file contents or paths. If you are not sure, ask the user for the exact path.
- Do not print secrets or environment variable values.
- Focus on helping debug, explain, and improve the DualPilot codebase.
    `,
    tools: {
      githubGetFile,
    },
    maxSteps: 4,
  });

  return result.toAIStreamResponse();
}
