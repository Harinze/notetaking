import { useState } from "react";
import { formatDate } from "../utils/dateUtils";

export default function NoteList({ notes, deleteNote, updateNote, isLoading }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [updateLoadingId, setUpdateLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    setUpdateLoadingId(id);
    await updateNote(id, editText);
    setEditingId(null);
    setUpdateLoadingId(null);
  };

  const today = new Date();
  const threeDaysAgo = new Date();
  threeDaysAgo.setDate(today.getDate() - 3);

  const recentNotes = notes?.filter((note) => new Date(note.timestamp) >= threeDaysAgo);
  const oldNotes = notes?.filter((note) => new Date(note.timestamp) < threeDaysAgo);

  return (
    <div className="mt-6 w-full max-w-3xl flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">Latest Notes</h2>
        {isLoading ? (
          <p className="text-center text-gray-500">Loading notes...</p>
        ) : (
          <div className="space-y-4">
            {recentNotes?.map((note) => (
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
                      <p className="text-gray-800 text-lg font-medium">{note.tag}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 mt-3 sm:mt-0">
                  {editingId === note._id ? (
                    <button
                      onClick={() => saveEdit(note._id)}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 ml-4 transition-all"
                      disabled={updateLoadingId === note._id}
                    >
                      {updateLoadingId === note._id ? "Saving..." : "Save"}
                    </button>
                  ) : (
                    <button
                      onClick={() => startEditing(note._id, note.text)}
                      className="bg-yellow-500 text-white ml-1 px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={async () => {
                      if (window.confirm("Are you sure you want to delete this note?")) {
                        setDeleteLoadingId(note._id);
                        await deleteNote(note._id);
                        setDeleteLoadingId(null);
                      }
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                    disabled={deleteLoadingId === note._id}
                  >
                    {deleteLoadingId === note._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {oldNotes.length > 0 && (
        <div className="w-full lg:w-1/4 bg-gray-100 p-4 rounded-xl shadow-md h-fit self-start sticky top-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">Older Notes</h2>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {oldNotes.map((note) => (
              <div key={note._id} className="p-3 bg-white rounded-lg shadow">
                <p className="text-gray-800 text-sm font-medium">{note.text}</p>
                <p className="text-xs text-gray-500">{formatDate(note.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

