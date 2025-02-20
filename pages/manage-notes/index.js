
import { useState, useEffect } from "react";
import NoteInput from "../../components/NoteInput";
import NoteList from "../../components/NoteList";
import SearchBar from "../../components/SearchBar";
import Header from "../../components/Header";
import { showToast } from "../../utils/toastConfig"; 
import {useRouter} from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false)
  const router = useRouter()

  // Fetch user details
  useEffect(() => {
    fetchUser();
  }, []);

  // const fetchUser = async () => {
  //   setLoadingUser(true);
  //   try {
  //     const res = await fetch("/api/get-user");
  //     if (res.ok) {
  //       const data = await res.json();
  //       setUser(data);
  //       fetchNotes(data.userId);
  //     } else {
  //       const sessionCookie = document.cookie
  //         .split("; ")
  //         .find((row) => row.startsWith("session="));
  
  //       if (sessionCookie) {
  //         const sessionData = JSON.parse(decodeURIComponent(sessionCookie.split("=")[1]));
  //         setUser(sessionData);
  //         fetchNotes(sessionData.userId);
  //         return;
  //       }
  
  //       showToast("error", "User not authenticated!");
  //       router.push("/login");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user:", error);
  //     router.push("/login");
  //   } finally {
  //     setLoadingUser(false);
  //   }
  // };
  

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await fetch("/api/get-user");
  
      if (!res.ok) {
        showToast("error", "User not authenticated!");
        router.push("/login");
        return;
      }
  
      const data = await res.json();
      setUser(data);
      fetchNotes(data.userId);
    } catch (error) {
      console.error("Error fetching user:", error);
      router.push("/login");
    } finally {
      setLoadingUser(false);
    }
  };
  

  const fetchNotes = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/notes?userId=${userId}`);
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      showToast("error", "Failed to fetch notes!");
    }
    setLoading(false);
  };

  const addNote = async (note, tag) => {
    if (!user) {
      showToast("error", "You must be logged in to add notes.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note, tag, userId: user.userId }),
      });

      if (!res.ok) throw new Error("Failed to add note");

      fetchNotes(user.userId);
      showToast("success", "Note added successfully!");
    } catch (error) {
      showToast("error", "Error adding note!");
    }
    setActionLoading(false);
  };

  const updateNote = async (id, newText) => {
    if (!user) {
      showToast("error", "You must be logged in to update notes.");
      return;
    }

    setUpdateLoading(id);
    try {
      const res = await fetch("/api/notes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newText, userId: user.userId }),
      });

      if (!res.ok) throw new Error("Failed to update note");

      fetchNotes(user.userId);
      showToast("success", "Note updated!");
    } catch (error) {
      showToast("error", "Error updating note!");
    }
    setUpdateLoading(null);
  };

  const deleteNote = async (id) => {
    if (!user) {
      showToast("error", "You must be logged in to delete notes.");
      return;
    }

    setDeleteLoading(id);
    try {
      const res = await fetch("/api/notes", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, userId: user.userId }),
      });

      if (!res.ok) throw new Error("Failed to delete note");

      fetchNotes(user.userId);
      showToast("success", "Note deleted!");
    } catch (error) {
      showToast("error", "Error deleting note!");
    }
    setDeleteLoading(null);
  };

  const filteredNotes = notes?.filter((note) =>
    note.text.toLowerCase().includes(searchQuery.toLowerCase())
  );


if (loadingUser) {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="flex flex-col items-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
        <p className="text-gray-600 text-lg mt-3 font-medium">
          Loading your data...
        </p>
      </div>
    </div>
  );
}


  return (
    <div>
      <Header />
      <div className="min-h-screen p-6 bg-gray-50 flex flex-col items-center">
        <div className="w-full max-w-3xl space-y-6 bg-white shadow-lg rounded-2xl p-6">
          {/* User Info */}
          {user && (
            <div className="mb-4 text-center">
              <h2 className="text-lg font-semibold">Welcome, {user.fullName}!</h2>
              {/* <p className="text-sm text-gray-500">Email: {user.email}</p> */}
            </div>
          )}

          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

          <NoteInput addNote={addNote} isLoading={actionLoading} />

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <NoteList
              notes={filteredNotes}
              deleteNote={deleteNote}
              updateNote={updateNote}
              updateLoading={updateLoading}
              deleteLoading={deleteLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
