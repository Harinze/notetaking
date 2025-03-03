import { useState } from "react";
import { formatDate } from "../utils/dateUtils";
import { motion } from "framer-motion";
import BackButton from "./BackButton";


export default function NoteList({ notes, deleteNote, updateNote, isLoading }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [updateLoadingId, setUpdateLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [expandedNote, setExpandedNote] = useState(null);

  const toggleExpand = (id) => {
    setExpandedNote(expandedNote === id ? null : id);
  };

  const truncateText = (text) => {
    const words = text.split(" ");
    return words.length > 20 ? words.slice(0, 20).join(" ") + "..." : text;
  };

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

  const recentNotes = notes
  ?.filter((note) => new Date(note.timestamp) >= threeDaysAgo)
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const oldNotes = notes
  ?.filter((note) => new Date(note.timestamp) < threeDaysAgo)
  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));


  return (

  <div>
   
      <div className="mt-6 w-full max-w-4xl flex flex-col gap-6">
    <div className="flex-1">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Latest Notes
      </h2>
      {isLoading ? (
        <p className="text-center text-gray-500">Loading notes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {recentNotes?.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-5 bg-white rounded-xl shadow-lg flex flex-col space-y-2 transform hover:scale-[1.02] transition-all"
            >
              {editingId === note._id ? (
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows="3"
                />
              ) : (
                <>
                  <p className="text-gray-800 text-lg font-medium">
                    {expandedNote === note._id ? note.text : truncateText(note.text)}
                  </p>
                  {note.text.split(" ").length > 20 && (
                    <button
                      onClick={() => toggleExpand(note._id)}
                      className="text-blue-600 text-sm font-semibold underline"
                    >
                      {expandedNote === note._id ? "Show Less" : "Read More"}
                    </button>
                  )}
                  <p className="text-sm text-gray-500">{formatDate(note.timestamp)}</p>
                  <p className="text-blue-600 text-sm font-semibold">#{note.tag}</p>
                </>
              )}

              <div className="flex gap-2 mt-2">
                {editingId === note._id ? (
                  <button
                    onClick={() => saveEdit(note._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
                    disabled={updateLoadingId === note._id}
                  >
                    {updateLoadingId === note._id ? "Saving..." : "Save"}
                  </button>
                ) : (
                  <button
                    onClick={() => startEditing(note._id, note.text)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-all"
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
            </motion.div>
          ))}
        </div>
      )}
    </div>

    {oldNotes?.length > 0 && (
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          Older Notes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {oldNotes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-white rounded-lg shadow"
            >
              <p className="text-gray-800 text-sm font-medium">
                {expandedNote === note._id ? note.text : truncateText(note.text)}
              </p>
              {note.text.split(" ").length > 20 && (
                <button
                  onClick={() => toggleExpand(note._id)}
                  className="text-blue-600 text-sm font-semibold underline"
                >
                  {expandedNote === note._id ? "Show Less" : "Read More"}
                </button>
              )}
              <p className="text-xs text-gray-500 mt-1">{formatDate(note.timestamp)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    )}
  </div>
  <BackButton/>
  </div>
  )
}

