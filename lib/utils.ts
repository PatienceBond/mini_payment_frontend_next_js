import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unknown error occurred";
}

export function isNetworkError(error: any): boolean {
  return (
    error?.code === "ECONNREFUSED" ||
    error?.code === "ENOTFOUND" ||
    error?.code === "ECONNABORTED" ||
    error?.message?.includes("timeout") ||
    error?.message?.includes("Network Error")
  );
}

export function getErrorSeverity(error: any): "low" | "medium" | "high" {
  if (error?.status >= 500) return "high";
  if (error?.status >= 400) return "medium";
  if (isNetworkError(error)) return "high";
  return "low";
}
