import { Search } from "lucide-react"; // Importing an icon for a more professional look

export default function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="w-full max-w-2xl flex items-center bg-white border border-gray-300 rounded-lg shadow-sm p-3 mb-6">
      <Search className="text-gray-500 ml-2" size={20} /> 
      <input
        type="text"
        placeholder="Search notes..."
        className="w-full px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </div>
  );
}
