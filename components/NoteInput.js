import React, {useState} from 'react'

export default function NoteInput({ addNote, isLoading }) {
    const [note, setNote] = useState("");
    const [tag, setTag] = useState("");
  
    const handleSubmit = () => {
      if (note.trim()) {
        addNote(note, tag);
        setNote("");
        setTag("");
      }
    };
  
    return (
      <div className="p-4 bg-white rounded-xl shadow-lg">
        <textarea
          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write your note here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tag (optional)"
          className="w-full p-2 border rounded-md mt-2"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`w-full mt-3 py-2 rounded-md transition ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          }`}
        >
          {isLoading ? "Saving..." : "Save Note"}
        </button>
      </div>
    );
  }
  