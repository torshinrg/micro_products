// File: src/components/ui/Card.jsx
import { theme } from "@/styles/theme";

export function Card({ children, className = "" }) {
  return <div className={`border rounded p-4 ${theme.colors.card} ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }) {
  return <div className={`p-2 ${className}`}>{children}</div>;
}
