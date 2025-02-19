"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackHomeButton({ className = "" }) {
  const router = useRouter();

  return (
  <div className="pt-2">

      <div className="flex justify-center mb-2">
      <button
        onClick={() => router.push('/')}
        className={`flex items-center px-4 py-2 text-blue-600 border border-blue-600 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300 ease-in-out ${className}`}
      >
        <ArrowLeft size={22} className="mr-2" />
        Back home
      </button>
    </div>
  </div>
  );
}
