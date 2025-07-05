import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";

export default function AdminAddCandidateForm() {
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [name, setName] = useState("");
  const [postId, setPostId] = useState("");
  const [department, setDepartment] = useState("");
  const [faculty, setFaculty] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPosts() {
      setLoadingPosts(true);
      try {
        const q = query(collection(db, "posts"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const postsData = [];
        querySnapshot.forEach((doc) => {
          postsData.push({ id: doc.id, ...doc.data() });
        });
        setPosts(postsData);
        if (postsData.length > 0) setPostId(postsData[0].id);
      } catch (error) {
        alert("Failed to load posts: " + error.message);
      }
      setLoadingPosts(false);
    }
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !postId) return alert("Name and Post are required");

    setLoading(true);
    try {
      await addDoc(collection(db, "candidates"), {
        name,
        postId,
        department,
        faculty,
        imageUrl,
        votes: 0,
        createdAt: serverTimestamp(),
      });
      alert("Candidate added successfully!");
      setName("");
      setDepartment("");
      setFaculty("");
      setImageUrl("");
      setPostId(posts.length > 0 ? posts[0].id : "");
      setIsModalOpen(false);
    } catch (error) {
      alert("Error adding candidate: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="">
      <button
        onClick={() => setIsModalOpen(true)}
        className="px-6 py-3 bg-gradient-to-r from-red-900 via-amber-600 to-yellow-500 text-white rounded-md hover:from-red-700 hover:to-yellow-400 focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium shadow-md"
      >
        Add New Candidate
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-md bg-[#1f1f1f] text-white rounded-xl shadow-2xl p-6 sm:p-8 space-y-4 sm:space-y-5 relative transform transition-all duration-300 scale-100">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-2xl sm:text-3xl font-bold text-amber-500 text-center">
              Add New Candidate
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="space-y-1">
                <label htmlFor="name" className="block text-sm font-medium text-white/80">
                  Candidate Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Enter candidate name"
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-white/10 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all duration-300 text-sm sm:text-base bg-black text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="post" className="block text-sm font-medium text-white/80">
                  Post <span className="text-red-500">*</span>
                </label>
                {loadingPosts ? (
                  <p className="text-amber-600 text-sm animate-pulse">Loading posts...</p>
                ) : (
                  <select
                    id="post"
                    className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-white/10 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all duration-300 text-sm sm:text-base bg-black text-white"
                    value={postId}
                    onChange={(e) => setPostId(e.target.value)}
                    required
                  >
                    {posts.map((post) => (
                      <option key={post.id} value={post.id} className="bg-black text-white">
                        {post.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="space-y-1">
                <label htmlFor="department" className="block text-sm font-medium text-white/80">
                  Department (optional)
                </label>
                <input
                  type="text"
                  id="department"
                  placeholder="Enter department"
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-white/10 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all duration-300 text-sm sm:text-base bg-black text-white"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="faculty" className="block text-sm font-medium text-white/80">
                  Faculty (optional)
                </label>
                <input
                  type="text"
                  id="faculty"
                  placeholder="Enter faculty"
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-white/10 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all duration-300 text-sm sm:text-base bg-black text-white"
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="imageUrl" className="block text-sm font-medium text-white/80">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  placeholder="Enter image URL"
                  className="w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-white/10 rounded-md focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all duration-300 text-sm sm:text-base bg-black text-white"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-red-900 via-amber-600 to-yellow-500 text-white py-2.5 sm:py-3 px-4 rounded-md hover:from-red-700 hover:to-yellow-400 focus:ring-2 focus:ring-amber-600 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Candidate"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-white/10 text-white py-2.5 sm:py-3 px-4 rounded-md hover:bg-white/20 focus:ring-2 focus:ring-white focus:ring-offset-2 transition-all duration-300 text-sm sm:text-base font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
