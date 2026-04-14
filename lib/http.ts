import { NextResponse } from "next/server";

type ErrorContext = {
  fallbackMessage?: string;
  defaultStatus?: number;
};

export function errorResponse(error: unknown, context: ErrorContext = {}) {
  const message = error instanceof Error ? error.message : "Request failed";
  const fallbackMessage = context.fallbackMessage ?? "Request failed";
  const defaultStatus = context.defaultStatus ?? 400;

  if (message === "Unauthorized" || message === "Unauthorized demo user") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (message === "Forbidden") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ error: fallbackMessage }, { status: defaultStatus });
}
