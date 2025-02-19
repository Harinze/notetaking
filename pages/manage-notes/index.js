import { useState, useEffect } from "react";
import NoteInput from "../../components/NoteInput";
import NoteList from "../../components/NoteList";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import { showToast } from "../../utils/toastConfig"; 

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      showToast("error", "Failed to fetch notes!");
    }
    setLoading(false);
  };

  const addNote = async (note, tag) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, tag }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      fetchNotes();
      showToast("success", "Note added successfully!");
    } catch (error) {
      showToast("error", "Error adding note!");
    }
    setActionLoading(false);
  };

  const updateNote = async (id, newText) => {
    setUpdateLoading(id);
    try {
      const res = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newText }),
      });

      if (!res.ok) throw new Error("Failed to update note");

      fetchNotes();
      showToast("success", "Note updated!");
    } catch (error) {
      showToast(error.response);
    }
    setUpdateLoading(id);
  };

  const deleteNote = async (id) => {
    setDeleteLoading(id);
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to delete note");

      fetchNotes();
      showToast("success", "Note deleted!");
    } catch (error) {
      showToast("error", "Error deleting note!");
    }
    setDeleteLoading(id);
  };

  const filteredNotes = notes?.filter((note) =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Header />
      <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-6 bg-white shadow-lg rounded-2xl p-6">
          {/* Search Bar */}
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          {/* Note Input (Disable button while loading) */}
          <NoteInput addNote={addNote} isLoading={actionLoading} />

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <NoteList notes={filteredNotes} deleteNote={deleteNote} updateNote={updateNote} updateLoading={updateLoading} deleteLoading={deleteLoading} />
          )}
        </div>
      </div>
    </div>
  );
}
