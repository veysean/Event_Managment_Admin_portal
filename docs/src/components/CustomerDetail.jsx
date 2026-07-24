import { useState } from "react";

export default function CustomerDetail({ customer, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white w-[600px] rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-semibold text-slate-500 text-center mb-4 border-b pb-2">
          Customer Details
        </h2>

        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>ID:</strong> {customer.custId}</p>
          <p><strong>First Name:</strong> {customer.firstName}</p>
          <p><strong>Last Name:</strong> {customer.lastName}</p>
          <p><strong>Organization:</strong> {customer.organizationName || "N/A"}</p>
          <p><strong>Phone:</strong> {customer.phoneNumber || "N/A"}</p>
          <p><strong>User ID:</strong> {customer.userId}</p>
        </div>

        <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-slate-600 text-white rounded"
        >
        Close
        </button>

      </div>
    </div>
  );
}

