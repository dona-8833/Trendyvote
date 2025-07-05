import React, { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function VotingToggle() {
  const [isVotingEnabled, setIsVotingEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const docRef = doc(db, "settings", "votingStatus");

  useEffect(() => {
    const fetchVotingStatus = async () => {
      try {
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          setIsVotingEnabled(snap.data().isVotingEnabled);
        } else {
          await setDoc(docRef, { isVotingEnabled: true }); // default to true
        }
      } catch (error) {
        alert("Failed to fetch voting status: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVotingStatus();
  }, []);

  const toggleVoting = async () => {
    try {
      const newStatus = !isVotingEnabled;
      await setDoc(docRef, { isVotingEnabled: newStatus });
      setIsVotingEnabled(newStatus);
    } catch (error) {
      alert("Failed to update voting status: " + error.message);
    }
  };

  if (loading) return <p className="text-sm text-gray-500">Loading voting status...</p>;

  return (
    <div className="mt-6 p-4 border rounded-lg shadow bg-white flex items-center justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Voting Process</h3>
        <p className="text-sm text-gray-600">
          Voting is currently <strong>{isVotingEnabled ? "ENABLED" : "DISABLED"}</strong>
        </p>
      </div>
      <button
        onClick={toggleVoting}
        className={`px-4 py-2 rounded-md text-white font-medium transition-all duration-300 ${
          isVotingEnabled ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isVotingEnabled ? "Turn OFF Voting" : "Turn ON Voting"}
      </button>
    </div>
  );
}
