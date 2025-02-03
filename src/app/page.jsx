// File: src/app/page.jsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  // Define an array of pages with titles and paths
  const pages = [
    { title: "Split Training", href: "/split-training" },
    // Add more pages as needed, e.g.:
    // { title: "Another Feature", href: "/another-feature" },
  ];

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-6">
      <h1 className="text-xl font-bold mb-4">Welcome to Simple Apps</h1>
      <h2 className="text-x font-bold mb-4">They will help to you to live this life</h2>
      <div className="w-full max-w-lg">
        {pages.map((page, idx) => (
          <Link key={idx} href={page.href}>
            <Button className="w-full p-4 text-xl mb-4">
              {page.title}
            </Button>
          </Link>
        ))}
      </div>
    </main>
  );
}
