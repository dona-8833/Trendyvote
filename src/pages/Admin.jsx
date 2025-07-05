import React from "react";
import AdminPostForm from "../components/admin/AdminPostForm";
import AdminAddCandidateForm from "../components/admin/AdminCanForm";
import AdminDash from "../components/admin/AdminDash";

export default function Admin() {
  return (
  <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white py-6 px-4 sm:px-6">
      <AdminDash/>
      {/* You can add dashboard here later */}
    </div>
  );
}
