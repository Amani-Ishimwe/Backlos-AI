import { Inngest } from "inngest";

/**
 * Initializes the Inngest runner client for scheduling B2B SaaS background operations.
 * In dev mode, explicitly targets the local dev server so inngest.send() doesn't
 * attempt to reach Inngest cloud (which causes ConnectTimeoutError).
 */
export const inngest = new Inngest({ 
  id: "backlos",
  eventKey: process.env.INNGEST_DEV === "1" ? "local" : (process.env.INNGEST_EVENT_KEY ?? "local"),
  ...(process.env.INNGEST_DEV === "1" && {
    baseUrl: "http://localhost:8288",
  }),
});
