// File: src/components/common/Popup.jsx
import { theme } from "@/styles/theme";
import { X } from "lucide-react";

export function Popup({ children, onClose, className = "" }) {
  return (
    <div className={`${theme.colors.overlay} fixed inset-0 z-50 flex items-center justify-center p-6`}>
      <div
        className={`${theme.colors.popupBackground} ${theme.spacing.padding} rounded-2xl shadow-2xl border border-gray-600 w-full max-w-2xl text-center relative ${className}`}
      >
        <button className="absolute top-6 right-6 text-white" onClick={onClose}>
          <X size={30} />
        </button>
        {children}
      </div>
    </div>
  );
}
