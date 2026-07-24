import { useState } from "react";

export default function UpdateCustomerForm({ customer, onSave, onCancel }) {
  const [updatedCustomer, setUpdatedCustomer] = useState({
    firstName: customer.firstName || "",
    lastName: customer.lastName || "",
    organizationName: customer.organizationName || "",
    phoneNumber: customer.phoneNumber || "",
    userId: customer.userId || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedCustomer);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[600px] p-6 rounded-lg shadow-lg space-y-4 relative"
      >
        <h2 className="text-xl font-semibold text-slate-500 text-center mb-2 border-b pb-2">
          Update Customer
        </h2>

        <input
          type="text"
          name="firstName"
          value={updatedCustomer.firstName}
          onChange={handleChange}
          placeholder="First Name"
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
        />

        <input
          type="text"
          name="lastName"
          value={updatedCustomer.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
        />

        <input
          type="text"
          name="organizationName"
          value={updatedCustomer.organizationName}
          onChange={handleChange}
          placeholder="Organization Name"
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
        />

        <input
          type="text"
          name="phoneNumber"
          value={updatedCustomer.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
        />

        <input
          type="number"
          name="userId"
          value={updatedCustomer.userId}
          onChange={handleChange}
          placeholder="User ID"
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
        />

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
