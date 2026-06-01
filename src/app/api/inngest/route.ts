import { serve } from "inngest/next";
import { inngest } from "@/lib/inngest/client";
import { generateFeedback } from "@/lib/inngest/functions/generateFeedback";
import { ghostFighting } from "@/lib/inngest/functions/ghostFighting";

// Exposes Inngest handlers to the background orchestration engine
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    generateFeedback,
    ghostFighting,
  ],
});
