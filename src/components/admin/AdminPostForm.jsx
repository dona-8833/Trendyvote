import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminPostModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const snapshot = await getDocs(collection(db, "posts"));
        const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }
    fetchPosts();
  }, [isOpen, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return alert("Post name is required");

    setLoading(true);
    try {
      if (editingPostId) {
        await updateDoc(doc(db, "posts", editingPostId), {
          name,
          description,
        });
        alert("Post updated successfully!");
      } else {
        await addDoc(collection(db, "posts"), {
          name,
          description,
          createdAt: serverTimestamp(),
        });
        alert("Post added successfully!");
      }
      setName("");
      setDescription("");
      setEditingPostId(null);
      setIsOpen(false);
    } catch (error) {
      alert("Error saving post: " + error.message);
    }
    setLoading(false);
  };

  const handleEdit = (post) => {
    setName(post.name);
    setDescription(post.description || "");
    setEditingPostId(post.id);
    setIsOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteDoc(doc(db, "posts", id));
        setPosts((prev) => prev.filter((post) => post.id !== id));
        alert("Post deleted successfully!");
      } catch (error) {
        alert("Error deleting post: " + error.message);
      }
    }
  };

return (
  <>
    <button
      onClick={() => {
        setName("");
        setDescription("");
        setEditingPostId(null);
        setIsOpen(true);
      }}
      className="px-6 py-3 bg-gradient-to-r from-[#4b0e18] via-yellow-600 to-yellow-500 text-white rounded-md hover:from-[#7e1d3a] hover:to-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium shadow-md"
      aria-label="Add Post"
    >
      Add Position
    </button>

    {isOpen && (
      <div
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={() => setIsOpen(false)}
      >
        <div
          className="w-full max-w-md bg-[#1a1a1a] text-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-4 overflow-y-auto max-h-[90vh] relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            ✕
          </button>

          <h2 className="text-2xl font-bold text-center text-yellow-500">
            {editingPostId ? "Edit Post" : "Add New Post"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80">
                Post Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-white/10 rounded-md focus:ring-2 focus:ring-yellow-500 bg-black text-white"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80">Description</label>
              <textarea
                className="w-full px-4 py-2 border border-white/10 rounded-md focus:ring-2 focus:ring-yellow-500 bg-black text-white min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#4b0e18] via-yellow-600 to-yellow-500 text-white py-2 rounded-md hover:from-[#7e1d3a] hover:to-yellow-400 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? editingPostId
                    ? "Updating..."
                    : "Adding..."
                  : editingPostId
                  ? "Update Post"
                  : "Add Post"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full bg-white/10 text-white py-2 rounded-md hover:bg-white/20 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )}

    <div className="mt-6 space-y-2">
      <h3 className="text-lg font-semibold text-yellow-500">All Positions</h3>
      <ul className="space-y-1">
        {posts.map((post) => (
          <li
            key={post.id}
            className="flex justify-between items-center bg-[#111111] border border-white/10 px-4 py-2 rounded-md shadow-sm"
          >
            <span className="font-medium text-white">{post.name}</span>
            <div className="flex gap-4">
              <button
                onClick={() => handleEdit(post)}
                className="text-sm text-yellow-400 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </>
);

}
