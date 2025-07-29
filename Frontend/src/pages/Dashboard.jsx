import React, { useEffect, useState } from "react";
import API from "../api";
import EventRow from "../components/EventRow.jsx";
import EventDetail from "../components/EventDetail.jsx";
import UpdateEventForm from "../components/UpdateEventForm.jsx";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    pending: 0,
    accepted: 0,
    denied: 0,
  });
  const [eventToUpdate, setEventToUpdate] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  useEffect(() => {

     const fetchData = async () => {
    try {
      const [pendingRes, acceptedRes, deniedRes] = await Promise.all([
        API.get("api/events?status=pending"),
        API.get("api/events?status=accepted"),
        API.get("api/events?status=denied"),
      ]);

      
      setSummary({
      pending: pendingRes.data.total || pendingRes.data.events.length || 0,
      accepted: acceptedRes.data.total || acceptedRes.data.events.length || 0,
      denied: deniedRes.data.total || deniedRes.data.events.length || 0,
});

      console.log("Fetched data:", {
        pending: pendingRes.data.total,
        accepted: acceptedRes.data.total,
        denied: deniedRes.data.total,
      });

      console.log("Rendering dashboard with summary:", summary);
      // Set the latest pending events for list (you can limit to 5 or so)
        setEvents(pendingRes.data.events?.slice(0, 5) || []);
    } catch (err) {
      console.error("Dashboard fetch failed:", err);
    }
  };

  fetchData();
}, []);
const handleView = (event) => {
    setSelectedEvent(event);
    // Maybe navigate or open a modal
    };

    const handleUpdate = (event) => {
    setEventToUpdate(event);
    };
        //handle save update
    const handleSaveUpdate = async (updatedEventData) => {
    try {
        await API.put(`/api/events/${eventToUpdate.eventId}`, updatedEventData);
        const updatedEvents = events.map((evt) =>
        evt.eventId === eventToUpdate.eventId ? { ...evt, ...updatedEventData } : evt
        );
        setEvents(updatedEvents);
        setEventToUpdate(null); // Close the form
    } catch (error) {
        console.error("Update failed:", error);
    }
    };
    //handle cancel update
    const handleCancelUpdate = () => {
    setEventToUpdate(null);
    };

    //delete event
    const handleDelete = async (id) => {
    try {
        await API.delete(`/api/events/${id}`);
        setEvents((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
        console.error("Delete failed:", err);
    }
    };

  return (
    <>
    <div className="p-6">
      <h1 className="text-slate-500 text-3xl font-semibold">Dashboard overview</h1>

      <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card title="Pending Event" count={summary.pending} />
        <Card title="Accepted Event" count={summary.accepted} />
        <Card title="Denied Event" count={summary.denied} />
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent requested Event</h2>
      {events.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
            <p>No events found. Create a new event to get started.</p>
        </div>
    ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">ID</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Name</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Start Date</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">End Date</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Budget</th>
                        <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Status</th>
                        <th className="py-3 px-6 text-end text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {events.map((event) => (
                        <EventRow
                        key={event.eventId}
                        event={event}
                        onView={handleView}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                        />
                    ))}
                </tbody>
            </table>
        </div>
      )}
       {selectedEvent && (
              <EventDetail
                  event={selectedEvent}
                  onClose={() => setSelectedEvent(null)}
              />
              )}
      {eventToUpdate && (
              <UpdateEventForm
                  event={eventToUpdate}
                  onSave={handleSaveUpdate}
                  onCancel={handleCancelUpdate}
              />
              )}
      </div>
      {/* <div className="my-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3">Quick Access</h2>
          <div className="flex flex-wrap gap-4">
            <button
            
              className="px-6 py-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition"
            >
              Add New Employee
            </button>
            <button
          
              className="px-6 py-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition"
            >
              Add New Venue
            </button>
            <button
            
              className="px-6 py-2 bg-slate-600 text-white rounded-full hover:bg-slate-700 transition"
            >
              Add New Catering
            </button>
          </div>
      </div> */}
    </>
  );
}

function Card({ title, count }) {
  return (
    <div className="border border-gray-300 rounded-xl p-6 text-center hover:shadow-lg transition-all duration-200">
      <div className="text-4xl font-bold text-gray-700">{count}</div>
      <div className="mt-2 text-lg text-gray-600">{title}</div>
    </div>
  );
}
function EventCard({ event }) {
  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition">
      <h3 className="text-lg font-semibold text-gray-800">{event.name}</h3>
      <p className="text-sm text-gray-500">{new Date(event.startDate).toLocaleDateString()} → {new Date(event.end_date).toLocaleDateString()}</p>
      <p className="text-sm text-gray-600 mt-1">Budget: ${event.budget}</p>
      <p className="text-sm text-gray-600 mt-1">Status: <span className="capitalize">{event.status}</span></p>
      <p className="text-sm text-gray-600 mt-1">{event.desc}</p>
    </div>
  );
}