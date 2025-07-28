import React, { useEffect, useState } from "react";
import API from "../api"; 
import AddEmployeeForm from "./AddEmployeeForm.jsx";

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchEmployees = async (pageOffset = 0) => {
    setLoading(true);
    try {
      const res = await API.get(`/api/employees?offset=${pageOffset}&limit=${limit}`);
      setEmployees(res.data.data || []);
      setTotal(res.data.total);
      setOffset(pageOffset);
      setError(null);
    } catch (err) {
      console.error("Error loading employees:", err);
      setError("Failed to load employees.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(0);
  }, []);

  const handleNext = () => {
    const nextOffset = offset + limit;
    if (nextOffset < total) {
      fetchEmployees(nextOffset);
    }
  };

  const handlePrevious = () => {
    const prevOffset = offset - limit;
    if (prevOffset >= 0) {
      fetchEmployees(prevOffset);
    }
  };

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="mt-6">
      <h2 className="text-slate-500 text-2xl font-semibold mb-4">Employee List</h2>
      <button
        onClick={() => setShowAddForm(true)}
          className="mb-5 px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
        >
          Add New Employee
        </button>
        {showAddForm && (
            <div className="fixed inset-0 z-50 flex justify-center items-center">
              <AddEmployeeForm
                onClose={() => setShowAddForm(false)}
                onSuccess={() => {
                  fetchEmployees(offset);
                  setShowAddForm(false);
                }} 
              />
            </div>
        )}
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
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Role</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Email</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Phone</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Gender</th>
                  <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Salary</th>
                  <th className="py-3 px-6 text-end text-sm font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {employees.map((emp) => (
                  <tr key={emp.empId} className="hover:bg-gray-50">
                    <td className="py-4 px-6 text-sm text-gray-700">{emp.empId}</td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">
                      {emp.role?.role_name || "N/A"}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-700">{emp.email}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">{emp.phone}</td>
                    <td className="py-4 px-6 text-sm text-gray-700 capitalize">{emp.gender}</td>
                    <td className="py-4 px-6 text-sm text-gray-700">${parseFloat(emp.salary).toFixed(2)}</td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="flex justify-end relative">
                      <button
                        className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-200"
                        onClick={() => document.getElementById(`employee-menu-${emp.empId}`).classList.toggle("hidden")}
                      >
                        Actions▾
                      </button>
                      <div
                        id={`employee-menu-${emp.empId}`}
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg hidden z-10"

                      >
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            document.getElementById(`employee-menu-${emp.empId}`).classList.add("hidden");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            document.getElementById(`employee-menu-${emp.empId}`).classList.add("hidden");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            document.getElementById(`employee-menu-${emp.empId}`).classList.add("hidden");
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={handlePrevious}
              disabled={offset === 0}
              className={`px-4 py-2 rounded ${
                offset === 0
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
              disabled={offset + limit >= total}
              className={`px-4 py-2 rounded ${
                offset + limit >= total
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-slate-600 text-white hover:bg-slate-700"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
