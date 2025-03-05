"use client";

import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

export function Header() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/settings")}
      className="fixed top-4 right-4 p-3 bg-gray-800 rounded-full shadow-lg hover:bg-gray-700 z-50"
      aria-label="Open Settings"
    >
      <Settings size={24} className="text-white" />
    </button>
  );
}
