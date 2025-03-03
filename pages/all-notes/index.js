import { useEffect, useState } from "react"; 
import { motion, AnimatePresence } from "framer-motion";
import apiClient from "../../utils/apiClient";
import axios from "axios";
import Navbar from '../../components/Header'
import Loader from "../../components/Loader";
import BackButton from "../../components/BackButton";

export default function NotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 15;

  useEffect(() => {
    const fetchUserAndNotes = async () => {
      try {
        const userRes = await apiClient.get("/get-user");
        if (userRes?.data?.user.isLoggedIn) {
          const userId = userRes.data.user.userId;
          const notesRes = await axios.get(`/api/notes?userId=${userId}`);
          setNotes(notesRes.data.reverse());
        }
      } catch (err) {
        setError("Failed to load notes.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserAndNotes();
  }, []);

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(notes.length / notesPerPage);

  return (
    <div>
      <Navbar />
      <div className="bg-gray-50 p-6 md:p-10 flex flex-col items-center">
        <h1 className="text-3xl font-bold text-black mb-6">My Notes</h1>
        {loading && <Loader />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && notes.length === 0 && <p className="text-gray-500">No notes found.</p>}
        <div className="w-full max-w-3xl space-y-4">
          <AnimatePresence>
            {currentNotes.map((note) => (
              <motion.div
                key={note.timestamp}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-lg rounded-lg p-5 flex flex-col md:flex-row items-start md:items-center justify-between border border-gray-200 hover:shadow-xl transition-all"
              >
                <div>
                  <h2 className="text-lg font-semibold text-blue-600">{note.tag}</h2>
                  <p className="text-gray-800 mt-1">{note.text}</p>
                </div>
                <span className="text-gray-500 text-sm md:ml-4">{new Date(note.timestamp).toLocaleString()}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {notes.length > notesPerPage && (
          <div className="mt-6 flex space-x-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg transition-all ${currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
      <BackButton/>
    </div>
  );
}