"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Loader2 } from "lucide-react";
import { showToast } from "../utils/toastConfig";

export default function LogoutButton({ className = "" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return; 
    setLoading(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        router.push("/");
        window.location.reload()
      } else {
        showToast("Logout failed. Please try again or refresh the page, refresh the page");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-2">
      <div className="flex justify-center mb-2">
        <button
          onClick={handleLogout}
          disabled={loading}
          className={`flex items-center px-4 py-2 border border-blue-600 rounded-full shadow-md transition-all duration-300 ease-in-out ${
            loading
              ? "bg-gray-400 text-gray-600 cursor-not-allowed"
              : "text-blue-600 hover:bg-blue-600 hover:text-white"
          } ${className}`}
        >
          {loading ? (
            <>
              <Loader2 size={22} className="animate-spin mr-2" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut size={22} className="mr-2" />
              Logout
            </>
          )}
        </button>
      </div>
    </div>
  );
}
