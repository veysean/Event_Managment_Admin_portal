import React, { useState, useEffect } from "react";
import API from "../api"; 

export default function AddEmployeeForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    DOB: "",
    gender: "",
    email: "",
    phone: "",
    salary: "",
    roleId: "",
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Fetch roles from API
    const fetchRoles = async () => {
      try {
        const res = await API.get("api/roles");
        setRoles(res.data);
        console.log("Fetched roles:", res.data);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/employees", form);
      alert("Employee added successfully!");
      setForm({
        firstName: "",
        lastName: "",
        DOB: "",
        gender: "",
        email: "",
        phone: "",
        salary: "",
        roleId: "",
      });
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee.");
    }
  };

  return (
    <div className="bg-gray-50 p-6 rounded-md border border-gray-300 max-w-3xl mx-auto mt-10">
      <h2 className="text-xl font-semibold text-slate-600 underline text-center mb-6">
        Add Employee
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={form.firstName}
            onChange={handleChange}
            required
            className="border border-slate-400 px-4 py-2 rounded-full text-slate-700 focus:outline-none"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            required
            className="border border-slate-400 px-4 py-2 rounded-full text-slate-700 focus:outline-none"
          >
            <option value="">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={form.lastName}
            onChange={handleChange}
            required
            className="border border-slate-400 px-4 py-2 rounded-full text-slate-700 focus:outline-none"
          />
          <select
            name="roleId"
            value={form.roleId}
            onChange={handleChange}
            required
            className="border border-slate-400 px-4 py-2 rounded-full text-slate-700 focus:outline-none"
          >
            <option value="">Role</option>
            {roles.map((role) => (
              <option key={role.roleId} value={role.roleId}>
                {role.role_name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="DOB"
            placeholder="DOB"
            value={form.DOB}
            onChange={handleChange}
            required
            className="border border-slate-400 px-4 py-2 rounded-full text-slate-700 focus:outline-none"
          />
          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={form.salary}
            onChange={handleChange}
            required
            className="border border-slate-400 px-4 py-2 rounded-full text-slate-700 focus:outline-none"
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="border border-slate-400 px-4 py-2 rounded-full text-slate-700 focus:outline-none"
          />
        
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="border border-slate-400 px-4 py-2 rounded-full text-slate-700 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-slate-600 text-white px-6 py-2 rounded hover:bg-slate-700 transition"
          >
            Confirm
          </button>
          <button type="button" onClick={onClose} className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 transition">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
