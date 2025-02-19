import LogoutButton from "./LogoutButton";

export default function Header() {
  return (


    <div>
      
        <LogoutButton />
    
      <header className="relative w-full bg-blue-600 shadow-md py-6 px-4 sm:px-6 md:px-10">
      <div className="flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
          Daily Notes
        </h1>
        <p className="text-white text-sm sm:text-base mt-1 max-w-[90%] sm:max-w-[70%] md:max-w-[50%]">
          Capture your thoughts, stay organized.
        </p>
      </div>
    </header>
    </div>
  );
}
