import React from "react";

export default function EmployeeDetail({ employee, onClose }) {
  if (!employee) return null;

  return (
    <div className="fixed inset-0 bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg drop-shadow-xl relative">
        <h2 className="text-xl font-semibold text-slate-500 text-center mb-4 border-b pb-2">
          Employee Details
        </h2>

        <div className="grid grid-cols-2 gap-4 text-gray-600">
          <div>
            <p className="font-medium">First Name:</p>
            <p>{employee.firstName}</p>
          </div>
          <div>
            <p className="font-medium">Last Name:</p>
            <p>{employee.lastName}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p>{employee.email}</p>
          </div>
          <div>
            <p className="font-medium">Phone:</p>
            <p>{employee.phone}</p>
          </div>
          <div>
            <p className="font-medium">Gender:</p>
            <p className="capitalize">{employee.gender}</p>
          </div>
          <div>
            <p className="font-medium">Date of Birth:</p>
            <p>{employee.DOB}</p>
          </div>
          <div>
            <p className="font-medium">Role:</p>
            <p>{employee.role?.role_name || "N/A"}</p>
          </div>
          <div>
            <p className="font-medium">Salary:</p>
            <p>${parseFloat(employee.salary).toFixed(2)}</p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-600 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
