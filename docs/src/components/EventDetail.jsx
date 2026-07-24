import { useState } from "react";
export default function EventDetail({ event, onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="bg-white w-[600px] rounded-lg shadow-lg p-6 relative">
        <h2 className="text-xl font-semibold text-slate-500 text-center mb-4 border-b pb-2">
          Event Details
        </h2>
        
        <div className="space-y-2 text-sm text-gray-700">
          <p><strong>ID:</strong> {event.eventId}</p>
          <p><strong>Start Date:</strong> {new Date(event.startDate).toLocaleDateString()}</p>
          <p><strong>End Date:</strong> {new Date(event.endDate).toLocaleDateString()}</p>
          <p><strong>Budget:</strong> ${parseFloat(event.budget).toFixed(2)}</p>
          <p><strong>Status:</strong> <span className="text-green-600 font-medium">{event.status}</span></p>
        </div>

        {/* Related Models */}
        <div className="mt-6 space-y-4">
          <ModelCard title="Customer" data={event.customer} />
          <ModelCard title="Venue" data={event.venue} />
          <ModelCard title="Catering" data={event.catering} />
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
function ModelCard({ title, data }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!data || (Array.isArray(data) && data.length === 0)) return null;

  const toggleCard = () => setIsOpen((prev) => !prev);

  return (
    <div className="border border-slate-500 rounded p-3 shadow-sm">
      <button
        onClick={toggleCard}
        className="w-full text-left text-md font-medium text-gray-500 mb-2 hover:text-slate-700"
      >
        {isOpen ? "▼" : "►"} {title}
      </button>

      {isOpen && (
        <div className="ml-2">
          {Array.isArray(data) ? (
            data.map((item, index) => (
              <div key={index} className="mb-4">
                <p className="text-sm font-semibold text-gray-600">Set {index + 1}</p>
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {Object.entries(item).map(([key, value]) => (
                    <li key={key}>
                      <strong>{key}:</strong> {String(value)}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {Object.entries(data).map(([key, value]) => (
                <li key={key}>
                  <strong>{key}:</strong> {String(value)}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

