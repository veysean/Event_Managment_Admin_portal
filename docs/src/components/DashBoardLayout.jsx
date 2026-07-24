import React from "react";
import Navbar from "./NavBar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex">
      {/* Fixed Sidebar */}
      <div className="w-64 h-screen fixed top-0 left-0 bg-slate-500 text-white ">
        <Navbar />
      </div>

      {/* Main content (shifted to the right) */}
      <div className="ml-64 flex-1 p-6 bg-gray-100 min-h-screen overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
