import React, { useEffect, useState } from "react";
import API from "../api";
import CustomerDetail from "./CustomerDetail.jsx";
import UpdateCustomerForm from "./UpdateCustomr.jsx";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [mode, setMode] = useState(null); // 'view' or 'update'

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    try {
      const res = await API.get(`/api/customers?page=${page}`);
      setCustomers(res.data.data || []);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.currentPage);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch customers", err);
      setError("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleNext = () => {
    if (currentPage < totalPages) {
      fetchCustomers(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      fetchCustomers(currentPage - 1);
    }
  };

  const handleUpdateCustomer = async (updatedData) => {
    try {
      await API.put(`/api/customers/${selectedCustomer.custId}`, updatedData);
      setSelectedCustomer(null);
      setMode(null);
      fetchCustomers(currentPage); // refresh list
    } catch (err) {
      console.error("Failed to update customer", err);
      alert("Update failed.");
    }
  };

  const handleDeleteCustomer = async (custId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/api/customers/${custId}`);
      fetchCustomers(currentPage); // Refresh the list
    } catch (err) {
      console.error("Failed to delete customer", err);
      alert("Delete failed.");
    }
  };


  return (
    <div className="mt-6">
      <h2 className="text-slate-500 text-2xl font-semibold mb-4">Customer List</h2>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-blue-500 rounded-full"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          {error}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">ID</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Organization</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Phone</th>
                  <th className="py-3 px-6 text-end text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {customers.map((cust) => (
                  <tr key={cust.custId} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-700">{cust.custId}</td>
                    <td className="py-4 px-6 text-sm text-gray-900">{cust.firstName} {cust.lastName}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{cust.organizationName || "-"}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{cust.phoneNumber}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      <div className="flex justify-end relative">
                        <button
                          className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-600"
                          onClick={() => document.getElementById(`customer-menu-${cust.custId}`).classList.toggle("hidden")}
                        >
                          Actions▾
                        </button>
                        <div
                          id={`customer-menu-${cust.custId}`}
                          className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg hidden z-10"
                        >
                          <button
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setMode("view");
                              document.getElementById(`customer-menu-${cust.custId}`).classList.add("hidden");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setMode("update");
                              document.getElementById(`customer-menu-${cust.custId}`).classList.add("hidden");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => {
                              document.getElementById(`customer-menu-${cust.custId}`).classList.add("hidden");
                              handleDeleteCustomer(cust.custId);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-slate-600 text-white hover:bg-slate-700"
              }`}
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-slate-600 text-white hover:bg-slate-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && mode === "view" && (
        <CustomerDetail
          customer={selectedCustomer}
          onClose={() => {
            setSelectedCustomer(null);
            setMode(null);
          }}
        />
      )}

      {/* Update Customer Modal */}
      {selectedCustomer && mode === "update" && (
        <UpdateCustomerForm
          customer={selectedCustomer}
          onSave={handleUpdateCustomer}
          onCancel={() => {
            setSelectedCustomer(null);
            setMode(null);
          }}
        />
      )}
    </div>
  );
}
