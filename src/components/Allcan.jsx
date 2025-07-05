// components/AllCandidatesModal.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

export default function AllCandidatesModal({ isOpen, onClose }) {
  const [candidates, setCandidates] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    department: "",
    faculty: "",
    post: "",
    imageUrl: "",
  });

  useEffect(() => {
    if (!isOpen) return;

    const q = query(collection(db, "candidates"), orderBy("name"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setCandidates(list);
    }, (error) => {
      console.error("Error fetching candidates:", error);
    });

    return () => unsubscribe();
  }, [isOpen]);

  const filteredCandidates = candidates.filter((candidate) =>
    candidate.name?.toLowerCase().includes(search.toLowerCase()) ||
    candidate.department?.toLowerCase().includes(search.toLowerCase()) ||
    candidate.faculty?.toLowerCase().includes(search.toLowerCase()) ||
    candidate.post?.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      await deleteDoc(doc(db, "candidates", id));
    } catch (error) {
      alert("Failed to delete candidate: " + error.message);
    }
  };

  const handleEditClick = (candidate) => {
    setEditId(candidate.id);
    setEditForm({
      name: candidate.name || "",
      department: candidate.department || "",
      faculty: candidate.faculty || "",
      post: candidate.post || "",
      imageUrl: candidate.imageUrl || "",
    });
  };

  const handleInputChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    if (!editId) return;
    try {
      const ref = doc(db, "candidates", editId);
      await updateDoc(ref, {
        name: editForm.name,
        department: editForm.department,
        faculty: editForm.faculty,
        post: editForm.post,
        imageUrl: editForm.imageUrl,
        // votes field NOT updated here to prevent manual changes
      });
      setEditId(null);
    } catch (error) {
      alert("Failed to update candidate: " + error.message);
    }
  };

  if (!isOpen) return null;

return (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-start pt-20 overflow-y-auto">
    <div className="bg-[#1a1a1a] text-white w-full max-w-3xl rounded-xl shadow-2xl p-6 relative">
      <button
        className="absolute top-3 right-3 text-red-500 hover:text-red-300 text-2xl"
        onClick={onClose}
      >
        &times;
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center text-yellow-500">All Registered Candidates</h2>

      <input
        type="text"
        placeholder="Search by name, department, faculty, or post"
        className="w-full border border-white/10 bg-black text-white px-4 py-2 rounded-md mb-6 focus:ring-2 focus:ring-yellow-500 outline-none placeholder:text-white/60"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="space-y-4">
        {filteredCandidates.length === 0 && (
          <p className="text-center text-sm text-white/60 mt-4">No candidates found.</p>
        )}

        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="p-4 bg-[#111] border border-white/10 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            {editId === candidate.id ? (
              <div className="flex-1 space-y-2">
                {["name", "department", "faculty", "post", "imageUrl"].map((field) => (
                  <input
                    key={field}
                    type="text"
                    name={field}
                    value={editForm[field]}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded bg-black border border-white/10 focus:ring-2 focus:ring-yellow-500 text-white"
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  />
                ))}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 text-white rounded-md"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex-1 flex items-center gap-4">
                  {candidate.imageUrl ? (
                    <img
                      src={candidate.imageUrl}
                      alt={candidate.name}
                      className="w-16 h-16 object-cover rounded-full border-2 border-yellow-500"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/10 text-white text-xs flex items-center justify-center">
                      No Image
                    </div>
                  )}
                  <div>
                    <div className="font-bold text-lg text-yellow-400">{candidate.name}</div>
                    <div className="text-sm text-white/70">
                      {candidate.department} {candidate.faculty && `- ${candidate.faculty}`}
                    </div>
                    <div className="text-sm text-white/70">Post: {candidate.post}</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 items-end">
                  <div className="text-yellow-500 font-semibold">Votes: {candidate.votes || 0}</div>
                  <button
                    onClick={() => handleEditClick(candidate)}
                    className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black font-semibold rounded hover:from-yellow-700 hover:to-yellow-500"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(candidate.id)}
                    className="px-3 py-1 bg-red-700 hover:bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

}
