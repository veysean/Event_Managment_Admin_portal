import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api";
import CustomerList from "../components/CustomerList.jsx";
import EmployeeList from "../components/EmployeeList.jsx";


export default function User() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("customer");
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("id");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await API.get(`/api/users/${userId}`);
                setUser(response.data);
            } catch (err) {
                setError("Failed to load user data");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

//     if (loading) {
//         return (
//         <div className="flex justify-center items-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//         </div>
//         );
//     }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <p className="text-red-500">{error}</p>
//       </div>
//     );
//   }

   return (
    <div className="container mx-auto px-4 py-8 relative">
      <h1 className="text-slate-500 text-3xl font-semibold mb-6">User Management</h1>

      {/* Toggle Buttons */}
      <div className="flex w-full md:w-96 border border-slate-500 rounded overflow-hidden mb-8">
        <button
          onClick={() => setActiveTab("employee")}
          className={`w-1/2 py-2 font-medium ${
            activeTab === "employee"
              ? "bg-slate-500 text-white"
              : "bg-white text-slate-600"
          }`}
        >
          Employee
        </button>
        <button
          onClick={() => setActiveTab("customer")}
          className={`w-1/2 py-2 font-medium ${
            activeTab === "customer"
              ? "bg-slate-500 text-white"
              : "bg-white text-slate-600"
          }`}
        >
          Customer
        </button>
      </div>

      {/* Content */}
      {activeTab === "employee" ? (
        <div>
          {/* Employee List Component */}
          <EmployeeList />
        </div>
      ) : (
        <div>
          {/* Customer List Component */}
          <CustomerList />
        </div>
      )}
    </div>
  );
};