import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AiImageLabClient from "./AiImageLabClient";

export const metadata: Metadata = {
  title: "AI Image Lab (interno) | BISMILLAH",
  robots: { index: false, follow: false },
};

// Internal dev-only tool: never reachable in production builds.
export default function AiImageLabPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return <AiImageLabClient />;
}
