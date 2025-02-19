import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

export default function NoteList({ notes, deleteNote, updateNote, deleteLoading, updateLoading }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = (id) => {
    updateNote(id, editText);
    setEditingId(null);
  };

  return (
    <div className="mt-6 w-full max-w-3xl">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Today's Notes</h2>

      <div className="space-y-4">
        {notes?.map((note) => (
          <div
            key={note._id}
            className="p-4 bg-white rounded-xl shadow-md flex flex-col sm:flex-row items-center sm:justify-between transition-all"
          >
            <div className="flex-1 w-full">
              {editingId === note._id ? (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows="3"
                />
              ) : (
                <div className="w-full">
                  <p className="text-gray-800 text-lg font-medium">{note.text}</p>
                  <p className="text-sm text-gray-500">{formatDate(note.timestamp)}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-3 sm:mt-0">
              {editingId === note._id ? (
                <button
                  onClick={() => saveEdit(note._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-4 transition-all"
                >
                  {updateLoading ? "Saving" : "Save"}
                </button>
              ) : (
                <button
                  onClick={() => startEditing(note._id, note.text)}
                  className="bg-yellow-500 text-white ml-4 px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                >
                  Edit
                </button>
              )}
               <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to delete this note?")) {
                      deleteNote(note._id);
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  {deleteLoading ? "Deleting" : "Delete"}
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
