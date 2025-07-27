import React, { useEffect, useState } from "react";
import API from "../api";

export default function Event() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await API.get("/events");
                setEvents(response.data.events); // Assuming response has { events: [...] }
                setError(null);
            } catch (err) {
                console.error("Error fetching events:", err);
                setError("Failed to load events. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Event List</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {events.length === 0 ? (
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
                    <p>No events found. Create a new event to get started.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Name</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Start Date</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">End Date</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Budget</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {events.map((event) => (
                                <tr key={event.eventId} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-sm text-gray-500">{event.eventId}</td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{event.name}</td>
                                    <td className="py-4 px-6 text-sm text-gray-700">{new Date(event.startDate).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-700">{new Date(event.end_date).toLocaleDateString()}</td>
                                    <td className="py-4 px-6 text-sm text-gray-700">${parseFloat(event.budget).toFixed(2)}</td>
                                    <td className="py-4 px-6 text-sm capitalize text-gray-700">{event.status}</td>
                                    <td className="py-4 px-6 text-sm space-x-2">
                                        <button className="px-3 py-1 rounded-md text-sm font-medium transition duration-200 bg-blue-500 text-white hover:bg-blue-600">
                                            View
                                        </button>
                                        <button className="px-3 py-1 rounded-md text-sm font-medium transition duration-200 bg-amber-500 text-white hover:bg-amber-600">
                                            Update
                                        </button>
                                        <button className="px-3 py-1 rounded-md text-sm font-medium transition duration-200 bg-red-500 text-white hover:bg-red-600">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
