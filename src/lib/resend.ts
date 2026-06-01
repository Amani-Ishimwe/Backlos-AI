import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY || "re_dummy_key";
export const resend = new Resend(resendApiKey);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "feedback@backlos.app";
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
