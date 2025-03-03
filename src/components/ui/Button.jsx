// File: src/components/ui/Button.jsx
import { theme } from "@/styles/theme";

export function Button({ children, className = "", ...props }) {
  return (
    <button
      className={`px-4 py-2 ${theme.colors.primary} ${theme.colors.primaryHover} ${theme.colors.text} rounded ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
