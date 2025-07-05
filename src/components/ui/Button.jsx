import React from "react";

const Button = () => {
  return (
    <button className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold text-lg bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition-all duration-300 shadow-md">
      🗳️ <span>VOTE NOW</span>
    </button>
  );
};

export default Button;
