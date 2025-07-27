import React, { useEffect, useState } from "react";
import API from "../api";

export default function Dashboard() {
  const [summary, setSummary] = useState({
    pending: 0,
    accepted: 0,
    denied: 0,
  });

  const [events, setEvents] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("token");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

     const fetchData = async () => {
    try {
      const [pendingRes, acceptedRes, deniedRes] = await Promise.all([
        API.get("/events?status=pending", { headers }),
        API.get("/events?status=accepted", { headers }),
        API.get("/events?status=denied", { headers }),
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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-700">Dashboard overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card title="Pending Event" count={summary.pending} />
        <Card title="Accepted Event" count={summary.accepted} />
        <Card title="Denied Event" count={summary.denied} />
      </div>

      <h2 className="text-lg font-semibold text-gray-700 mb-3">Recent requested Event</h2>
        <div className="space-y-4">
        {events.length === 0 ? (
          <div className="text-gray-500">No recent events found.</div>
        ) : (
          events.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))
        )}
      </div>
    </div>
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