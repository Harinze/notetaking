import Link from "next/link";
import { Home } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function Header() {
  return (
    <header className="relative w-full bg-blue-600 shadow-md py-6 px-4 sm:px-6 md:px-10 flex items-center justify-between">
      
      <Link href="/" className="text-white hover:text-gray-200 transition">
        <Home size={28} />
      </Link>
      
      <div className="flex flex-col items-center text-center flex-grow">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Daily Notes
        </h1>
        <p className="text-white text-sm sm:text-base mt-1 max-w-[90%] sm:max-w-[70%] md:max-w-[50%]">
          Capture your thoughts, stay organized.
        </p>
      </div>
      
      <LogoutButton />
    </header>
  );
}
