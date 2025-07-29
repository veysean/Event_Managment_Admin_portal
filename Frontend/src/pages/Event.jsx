import React, { useEffect, useState } from "react";
import API from "../api";
import EventRow from "../components/EventRow.jsx";
import EventDetail from "../components/EventDetail.jsx";
export default function Event() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventType, setEventType] = useState("");
    const [status, setStatus] = useState("");
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await API.get("api/events");
                setEvents(response.data.events || []); 
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

    useEffect(() => {
    setFilteredEvents(events);
    }, [events]);

    const handleFilter = () => {
        const filtered = events.filter((event) => {
        const typeMatch = eventType ? event.type === eventType : true;
        const statusMatch = status ? event.status === status : true;
        const nameMatch = searchQuery
        ? event.name.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

        return typeMatch && statusMatch && nameMatch;
        });

        setFilteredEvents(filtered);
    };
    const getSuggestions = (query) => {
        if (!query) return [];
        return events.filter((event) =>
            event.name.toLowerCase().includes(query.toLowerCase())
        );
    };

    const handleView = (event) => {
    setSelectedEvent(event);
    
    };
    // Update event
    const handleUpdate = (event) => {
    setShowUpdateForm(event);
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
    //loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <h1 className="text-slate-500 text-3xl font-semibold">Event Management</h1>
                <div>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                        const query = e.target.value;
                        setSearchQuery(query);
                        setSuggestions(getSuggestions(query));
                        }}
                    placeholder="Search by name..."
                    className="px-4 py-2 rounded-md border border-gray-300 text-sm w-full md:w-64"
                />
                <button
                    onClick={handleFilter}
                    className="ml-2 px-4 py-2 bg-slate-500 text-white rounded-md text-sm hover:bg-slate-300"
                >
                    Search
                </button>
                <ul
                    className="absolute z-10 w-full md:w-64 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1"
                    >
                    {suggestions.map((event, index) => (
                        <li
                        key={index}
                        onClick={() => {
                            setSearchQuery(event.name);
                            setSuggestions([]);
                        }}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                        >
                        {event.name}
                        </li>
                    ))}
                    </ul>
                    </div>
                <div className="flex flex-wrap items-center gap-4">
                    <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-sm"
                    >
                    <option value="">Event Type</option>
                    <option value="Conference">Conference</option>
                    <option value="Workshop">Workshop</option>
                    <option value="Seminar">Seminar</option>
                    <option value="Concert">Concert</option>
                    <option value="Festival">Festival</option>
                    </select>
                    <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="px-4 py-2 rounded-md border border-gray-300 text-sm"
                    >
                    <option value="">Status</option>
                    <option value="accepted">Accepted</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="pending">Pending</option>
                    <option value="denied">Denied</option>
                    </select>
                    <button
                    onClick={() => handleFilter()}
                    className="px-4 py-2 rounded-md bg-slate-500 text-white text-sm hover:bg-slate-300"
                    >
                    Filter
                    </button>
                </div>
            </div>
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
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">ID</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Name</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Start Date</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">End Date</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Budget</th>
                                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-600">Status</th>
                                <th className="py-3 px-6 text-end ">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredEvents.map((event) => (
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
        </div>
    );
}
