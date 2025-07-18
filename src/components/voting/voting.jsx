import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  increment,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

export default function VotePage() {
  const { user, logout } = useAuth();
  const [posts, setPosts] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [voting, setVoting] = useState(false);
  const [votedPosts, setVotedPosts] = useState({});
  const [isVotingEnabled, setIsVotingEnabled] = useState(true);
  const [checkingVotingStatus, setCheckingVotingStatus] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkVotingStatus() {
      try {
        const statusDoc = await getDoc(doc(db, "settings", "votingStatus"));
        if (statusDoc.exists()) {
          setIsVotingEnabled(statusDoc.data().isVotingEnabled);
        } else {
          setIsVotingEnabled(true);
        }
      } catch (err) {
        console.error("Error checking voting status:", err);
        setIsVotingEnabled(true);
      } finally {
        setCheckingVotingStatus(false);
      }
    }
    checkVotingStatus();
  }, []);

  useEffect(() => {
    async function fetchPosts() {
      setLoadingPosts(true);
      try {
        const q = query(collection(db, "posts"), orderBy("name"));
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPosts(postsData);
        if (postsData.length > 0) setSelectedPostId(postsData[0].id);
      } catch (error) {
        alert("Failed to load posts: " + error.message);
      }
      setLoadingPosts(false);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (!selectedPostId) return;
    async function fetchCandidates() {
      setLoadingCandidates(true);
      try {
        const q = query(
          collection(db, "candidates"),
          where("postId", "==", selectedPostId),
          orderBy("name")
        );
        const querySnapshot = await getDocs(q);
        const candidatesData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setCandidates(candidatesData);
      } catch (error) {
        alert("Failed to load candidates: " + error.message);
      }
      setLoadingCandidates(false);
    }
    fetchCandidates();
  }, [selectedPostId]);

  useEffect(() => {
    async function fetchUserVotes() {
      if (!user) return;
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setVotedPosts(userDocSnap.data().votedPosts || {});
        } else {
          await updateDoc(userDocRef, { votedPosts: {} });
          setVotedPosts({});
        }
      } catch (err) {
        console.error("Failed to fetch user votes", err);
      }
    }
    fetchUserVotes();
  }, [user]);

  const handleVote = async (candidateId, postId) => {
    if (!isVotingEnabled) {
      alert("Voting is currently disabled by the admin.");
      return;
    }
    if (voting) return;
    const confirmVote = window.confirm("Are you sure you want to vote for this candidate?");
    if (!confirmVote) return;
    setVoting(true);
    try {
      const candidateRef = doc(db, "candidates", candidateId);
      await updateDoc(candidateRef, { votes: increment(1) });
      const userVotesRef = doc(db, "users", user.uid);
      await updateDoc(userVotesRef, { [`votedPosts.${postId}`]: true });
      setVotedPosts((prev) => ({ ...prev, [postId]: true }));
      alert("Vote recorded. Thank you!");
    } catch (error) {
      alert("Failed to record vote: " + error.message);
    }
    setVoting(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 sm:p-6">
        <h2 className="text-center text-red-600 text-xl sm:text-2xl font-semibold animate-pulse">
          You must be logged in to vote.
        </h2>
      </div>
    );
  }

  if (checkingVotingStatus) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg font-medium animate-pulse">
          Checking voting status...
        </p>
      </div>
    );
  }

  if (!isVotingEnabled) {
    return (
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-900/10 to-red-900/10"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-400 via-red-400 to-amber-500 bg-clip-text text-transparent">
              Table Reservations
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Secure your spot at the most prestigious award ceremony of the year
            </p>
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-4 max-w-2xl mx-auto">
              <p className="text-red-300 font-semibold text-lg">
                📅 Event Date: 19th July, 2025
              </p>
              <p className="text-yellow-300 font-medium mt-2">
                ⚠️ Important: Every nominee must secure a table for themselves
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300">
              <img 
                src="/regular.jpg" 
                alt="Regular ticket" 
                className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
              />
              <h3 className="text-xl font-bold text-white mb-2">Regular</h3>
              <p className="text-2xl font-bold text-red-400 mb-2">#2,000</p>
            
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300">
              <img 
                src="/table5.jpg" 
                alt="Table for 5 ticket" 
                className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
              />
              <h3 className="text-xl font-bold text-white mb-2">Table for 5</h3>
              <p className="text-2xl font-bold text-red-400 mb-2">#15,000</p>
            
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300">
              <img 
                src="/table10.jpg" 
                alt="Table for 10 ticket" 
                className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
              />
              <h3 className="text-xl font-bold text-white mb-2">Table for 10</h3>
              <p className="text-2xl font-bold text-red-400 mb-2">#30,000</p>
              
            </div>

            <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-300">
              <img 
                src="/premium.jpg" 
                alt="Premium ticket" 
                className="w-full h-48 object-cover rounded-xl mb-6 shadow-lg"
              />
              <h3 className="text-xl font-bold text-white mb-2">Premium</h3>
              <p className="text-2xl font-bold text-red-400 mb-2">#50,000</p>
              
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-2xl shadow-2xl max-w-4xl mx-auto">

            <div className="mt-6 text-center">
              <a
  href="https://wa.me/+2348130845336"
  target="_blank"
  rel="noopener noreferrer"
  className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white font-bold px-12 py-4 text-lg rounded-full transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/50 hover:scale-110 inline-block text-center"
>
  🎫 Reserve Your Table
</a>

            </div>
          </div>
        </div>
      </section>
                
    );
  }

return (
  <div className="min-h-screen bg-gradient-to-br from-black via-[#1a1a1a] to-[#331a1a] text-white">
    {/* Sidebar */}
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-[#1a1a1a] p-4 text-white transform transition-transform duration-300 ease-in-out z-50 flex flex-col 
      ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
    >
      {/* Close button on small screens */}
      <button
        className="md:hidden absolute top-4 right-4 text-white"
        onClick={() => setIsSidebarOpen(false)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 className="text-xl font-bold text-amber-500 mb-4">Posts</h2>

      {/* Scrollable post list */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {loadingPosts ? (
          <p className="text-gray-400">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-400">No posts available.</p>
        ) : (
          <ul className="space-y-2">
            {posts.map((post) => (
              <li
                key={post.id}
                onClick={() => {
                  setSelectedPostId(post.id);
                  setIsSidebarOpen(false);
                }}
                className={`p-2 cursor-pointer rounded ${
                  post.id === selectedPostId ? "bg-amber-600" : "hover:bg-gray-700"
                }`}
              >
                {post.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Fixed logout button */}
      <div className="pt-4 border-t border-gray-800">
        <button
          onClick={logout}
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>

    {/* Sidebar backdrop on small screens */}
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${
        isSidebarOpen ? "block" : "hidden"
      }`}
      onClick={() => setIsSidebarOpen(false)}
    />

    {/* Main Content */}
    <div className="ml-0 md:ml-64 p-4">
      {/* Sidebar toggle on small screens */}
      <button
        className="md:hidden p-2 text-white"
        onClick={() => setIsSidebarOpen(true)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-amber-500 drop-shadow-lg mb-6">
        🗳️ Cast Your Vote
      </h1>

      {/* Voting Section */}
      {selectedPostId ? (
        loadingCandidates ? (
          <p className="text-gray-400 text-base animate-pulse">Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p className="text-gray-400 text-base">No candidates for this post yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-[#1a0d0d]/80 backdrop-blur border border-red-900/30 rounded-xl p-5 flex items-center gap-4 shadow-lg hover:shadow-2xl hover:border-amber-600 transition-all duration-300 transform hover:-translate-y-1"
              >
                {candidate.imageUrl ? (
                  <img
                    src={candidate.imageUrl}
                    alt={candidate.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-600 shadow"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 text-sm border border-white/10">
                    No Image
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg text-white break-words">
  {candidate.name}
</h3>
                  <p className="text-sm text-gray-400 truncate">
                    {candidate.department || ""} {candidate.faculty ? `– ${candidate.faculty}` : ""}
                  </p>
                </div>
                <button
                  onClick={() => handleVote(candidate.id, selectedPostId)}
                  disabled={voting || votedPosts[selectedPostId]}
                  className={`px-4 py-2.5 rounded-lg text-white text-sm font-semibold transition-all duration-300 focus:ring-2 focus:ring-amber-500 hover:scale-105 ${
                    votedPosts[selectedPostId]
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-900 via-amber-600 to-yellow-500 hover:from-red-700 hover:to-yellow-400 shadow-md"
                  }`}
                >
                  {votedPosts[selectedPostId] ? "Already Voted" : voting ? "Voting..." : "Vote"}
                </button>
              </div>
            ))}
          </div>
        )
      ) : (
        <p className="text-gray-400 text-base">Please select a post from the sidebar.</p>
      )}
    </div>
  </div>
);

}
