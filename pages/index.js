"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "../components/ui/button";
import LogoutButton from "../components/LogoutButton";

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/get-user", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Navbar */}
      <nav className="bg-gray-400 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <h1 className="text-2xl font-bold">
              Note<span className="text-blue-600">Master</span>
            </h1>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-4">
              {user ? (
                <LogoutButton />
              ) : (
                <>
                  <Link href="/login">
                    <button className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-gray-800 transition">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden flex items-center"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>

          {/* Mobile Dropdown Menu */}
          {isOpen && (
            <div className="md:hidden flex flex-col space-y-2 bg-gray-500 py-4 px-6 rounded-lg">
              {user ? (
                <LogoutButton />
              ) : (
                <>
                  <Link href="/login">
                    <button className="w-full py-2 border border-white rounded-lg hover:bg-white hover:text-gray-800 transition">
                      Login
                    </button>
                  </Link>
                  <Link href="/signup">
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="text-center py-20 bg-gray-100">
        <h2 className="text-4xl font-bold mb-4">
          Organize Your Thoughts, Effortlessly
        </h2>
        <p className="text-gray-400 max-w-lg mx-auto">
          Take notes, stay productive, and keep everything in one place with
          NoteMaster.
        </p>
        <Link href="/signup">
          <Button className="mt-6 bg-blue-600 text-white px-6 py-3 text-lg">
            Get Started
          </Button>
        </Link>
      </header>

      {/* Features Section */}
      <section className="max-w-3xl mx-auto p-6 text-center">
        <h3 className="text-2xl font-bold mb-6">Why Choose NoteMaster?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h4 className="font-semibold text-lg">Fast & Secure</h4>
            <p className="text-gray-400 mt-2">
              Your notes are safely stored and quickly accessible anytime.
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h4 className="font-semibold text-lg">Easy to Use</h4>
            <p className="text-gray-400 mt-2">
              A clean and intuitive interface designed for productivity.
            </p>
          </div>
          <div className="p-4 bg-gray-100 rounded-lg shadow">
            <h4 className="font-semibold text-lg">Accessible Anywhere</h4>
            <p className="text-gray-400 mt-2">
              Access your notes from any device, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-4 bg-gray-200 text-gray-400 mt-10">
        &copy; {new Date().getFullYear()} NoteMaster. All rights reserved.
      </footer>
    </div>
  );
}
