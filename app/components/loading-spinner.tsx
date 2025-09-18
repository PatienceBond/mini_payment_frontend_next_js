"use client";

import { Spinner } from "@heroui/react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  label?: string;
  className?: string;
}

export function LoadingSpinner({ 
  size = "lg", 
  color = "primary", 
  label = "Loading...",
  className = ""
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 ${className}`}>
      <Spinner size={size} color={color} />
      {label && (
        <p className="mt-4 text-default-500 text-sm">{label}</p>
      )}
    </div>
  );
}
