import { useState } from "react";

export default function UpdateEventForm({ event, onSave, onCancel }) {
  const [updatedEvent, setUpdatedEvent] = useState({
    name: event.name || "",
    startDate: event.startDate || "",
    endDate: event.endDate || "",
    budget: event.budget || "",
    status: event.status || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedEvent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(updatedEvent);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-[600px] p-6 rounded-lg shadow-lg space-y-4 relative"
      >
        <h2 className="text-xl font-semibold text-slate-500 text-center mb-2 border-b pb-2">
          Update Event
        </h2>

        <input
          type="text"
          name="name"
          value={updatedEvent.name}
          onChange={handleChange}
          placeholder="Event Name"
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
        />

        <div className="flex gap-4">
          <input
            type="date"
            name="startDate"
            value={updatedEvent.startDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
          />
          <input
            type="date"
            name="endDate"
            value={updatedEvent.endDate}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
          />
        </div>

        <input
          type="number"
          name="budget"
          value={updatedEvent.budget}
          onChange={handleChange}
          placeholder="Budget"
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
        />

        <select
          name="status"
          value={updatedEvent.status}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-gray-300 rounded text-sm"
        >
          <option value="">Select Status</option>
          <option value="accepted">Accepted</option>
          <option value="cancelled">Cancelled</option>
          <option value="pending">Pending</option>
          <option value="denied">Denied</option>
        </select>

        <div className="flex justify-end gap-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="mt-4 px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
