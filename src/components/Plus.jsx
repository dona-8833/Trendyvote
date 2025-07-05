import React, { useState, useEffect, useRef } from "react";
import AdminPostForm from "./admin/AdminPostForm";
import AdminAddCandidateForm from "./admin/AdminCanForm";

export default function AddButton() {
  const [showForms, setShowForms] = useState(false);
  const modalRef = useRef(null);

  // Close modal if click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowForms(false);
      }
    }

    if (showForms) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForms]);

  return (
    <>
      {/* Plus Button */}
      <button
        onClick={() => setShowForms((prev) => !prev)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-green-600 text-white text-3xl flex items-center justify-center shadow-lg hover:bg-green-700 transition"
        aria-label="Add new"
      >
        +
      </button>

      {/* Show your two components conditionally */}
      {showForms && (
        <div
          ref={modalRef}
          className="fixed bottom-20 right-6 bg-white p-6 overflow-y-auto rounded-lg shadow-lg space-y-6 w-96 max-w-full z-50"
        >
          <AdminPostForm />
        </div>
      )}
    </>
  );
}
