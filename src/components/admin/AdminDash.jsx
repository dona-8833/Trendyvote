import React, { useEffect, useState, useCallback } from "react";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../firebase/config";
import AdminAddCandidateForm from "./AdminCanForm";
import AdminPostModal from "./AdminPostForm";
import VotingToggle from "../VoteToggle";
import AllCandidatesModal from "../Allcan";

export default function Admin() {
  const [numCandidates, setNumCandidates] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [numPosts, setNumPosts] = useState(0);
  const [topCandidatesByPost, setTopCandidatesByPost] = useState({});
  const [allCandidates, setAllCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStatsAndTopCandidates = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all candidates
      const candidatesSnapshot = await getDocs(collection(db, "candidates"));
      setNumCandidates(candidatesSnapshot.size);

      let votesSum = 0;
      const allCandData = [];

      candidatesSnapshot.forEach((doc) => {
        const data = doc.data();
        votesSum += data.votes || 0;
        allCandData.push({ id: doc.id, ...data });
      });

      setTotalVotes(votesSum);
      setAllCandidates(allCandData);

      // Fetch all posts/categories
      const postsSnapshot = await getDocs(collection(db, "posts"));
      setNumPosts(postsSnapshot.size);

      const postsData = [];
      postsSnapshot.forEach((doc) => {
        postsData.push({ id: doc.id, ...doc.data() });
      });

      const topByPost = {};

      // For each post, fetch top 3 candidates ordered by votes desc
      for (const post of postsData) {
        const candidatesQuery = query(
          collection(db, "candidates"),
          where("postId", "==", post.id),
          orderBy("votes", "desc")
        );
        const candsSnap = await getDocs(candidatesQuery);
        const candidatesData = [];
        candsSnap.forEach((doc) => {
          candidatesData.push({ id: doc.id, ...doc.data() });
        });

        topByPost[post.id] = {
          postName: post.name,
          candidates: candidatesData.slice(0, 3),
        };
      }

      setTopCandidatesByPost(topByPost);
    } catch (error) {
      alert("Error loading admin dashboard: " + error.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchStatsAndTopCandidates();
  }, [fetchStatsAndTopCandidates]);

  if (loading)
    return (
    <p className="p-4 text-center text-yellow-500 text-sm sm:text-base animate-pulse font-semibold">
  Loading Dashboard...
</p>

    );

return (
  <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white py-6 px-4 sm:px-6">
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      {/* Header + Refresh Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-300">
          Admin Command Center
        </h1>
        <button
          onClick={fetchStatsAndTopCandidates}
          disabled={loading}
          className={`px-4 py-2 rounded-md focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium shadow-md
            ${
              loading
                ? "bg-zinc-700 cursor-not-allowed text-white"
                : "bg-gradient-to-r from-[#4b0e18] via-yellow-600 to-yellow-500 hover:from-[#7e1d3a] hover:to-yellow-400 text-white"
            }`}
        >
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-4 bg-gradient-to-br from-amber-900 to-yellow-700 text-black rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center">
          <p className="text-xl sm:text-2xl font-bold">{numCandidates}</p>
          <p className="text-sm sm:text-base font-medium">Candidates</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-800 to-red-600 text-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center">
          <p className="text-xl sm:text-2xl font-bold">{totalVotes}</p>
          <p className="text-sm sm:text-base font-medium">Total Votes</p>
        </div>
        <div className="p-4 bg-gradient-to-br from-yellow-900 to-yellow-500 text-black rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center">
          <p className="text-xl sm:text-2xl font-bold">{numPosts}</p>
          <p className="text-sm sm:text-base font-medium">Posts / Categories</p>
        </div>
      </div>

      {/* Top 3 candidates per category */}
      <div className="flex flex-col space-y-6">
        <h2 className="text-xl sm:text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-200">
          Top 3 Candidates per Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Object.entries(topCandidatesByPost).map(([postId, { postName, candidates }]) => (
            <div
              key={postId}
              className="bg-zinc-900 rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-zinc-700 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 to-yellow-300"></div>
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">{postName}</h3>
              {candidates.length === 0 ? (
                <p className="text-zinc-400 text-sm sm:text-base">No candidates yet.</p>
              ) : (
                <ul className="space-y-3">
                  {candidates.map((cand) => (
                    <li
                      key={cand.id}
                      className="flex items-center space-x-3 sm:space-x-4 py-2 hover:bg-zinc-800 rounded-md transition-all duration-200"
                    >
                      {cand.imageUrl ? (
                        <img
                          src={cand.imageUrl}
                          alt={cand.name}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-yellow-500 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-zinc-700 flex items-center justify-center text-white text-xs sm:text-sm border-2 border-zinc-600">
                          No Image
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-white truncate">
                          {cand.name}
                        </p>
                        <p className="text-xs sm:text-sm text-zinc-400 truncate">
                          {cand.department || ""} {cand.faculty ? `- ${cand.faculty}` : ""}
                        </p>
                      </div>
                      <p className="font-semibold text-sm sm:text-base text-yellow-400">
                        {cand.votes || 0} votes
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* All Registered Candidates Button and Modal */}
      <div className="p-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#4b0e18] via-yellow-600 to-yellow-500 text-white rounded-md hover:from-[#7e1d3a] hover:to-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 text-sm sm:text-base font-medium shadow-md"
        >
          All Candidates
        </button>

        <AllCandidatesModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>

      {/* Forms and toggle */}
      <AdminAddCandidateForm />
      <AdminPostModal />
      <VotingToggle />
    </div>
  </div>
);


}
