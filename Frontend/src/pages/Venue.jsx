import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Venue = () => {
    const [venues, setVenues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVenues = async () => {
            try {
                const response = await API.get("/venues");
                setVenues(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching venues:", err);
                setError("Failed to load venues. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchVenues();
    }, []);

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this venue?");
        if (!confirm) return;

        try {
            await API.delete(`/venues/${id}`);
            setVenues(venues.filter((v) => v.venueId !== id));
        } catch (err) {
            console.error("Error deleting venue:", err);
            alert("Failed to delete venue.");
        }
    };

    const handleEdit = (id) => {
        navigate(`/venues/edit/${id}`);
    };

    const handleView = (id) => {
        navigate(`/venues/${id}`);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Venue List</h1>

            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                    <p>{error}</p>
                </div>
            )}

            {venues.length === 0 ? (
                <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
                    <p>No venues found. Create a new venue to get started.</p>
                </div>
            ) : (
                <div className="overflow-x-auto shadow-md rounded-lg">
                    <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase">ID</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase">Max Occupancy</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase">Email</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase">Phone</th>
                                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {venues.map((venue) => (
                                <tr key={venue.venueId} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 text-sm text-gray-500">{venue.venueId}</td>
                                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{venue.name}</td>
                                    <td className="py-4 px-6 text-sm text-gray-700">{venue.location}</td>
                                    <td className="py-4 px-6 text-sm text-gray-700">{venue.max_occupancy}</td>
                                    <td className="py-4 px-6 text-sm text-blue-600 hover:text-blue-800">
                                        {venue.email ? (
                                            <a href={`mailto:${venue.email}`} className="underline">{venue.email}</a>
                                        ) : (
                                            <span className="text-gray-400">N/A</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-sm text-gray-700">{venue.phone}</td>
                                    <td className="py-4 px-6 text-sm text-gray-700 space-x-2">
                                        <button
                                            onClick={() => handleView(venue.venueId)}
                                            className="px-3 py-1 rounded-md text-sm font-medium transition duration-200 bg-blue-500 text-white hover:bg-blue-600"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(venue.venueId)}
                                            className="px-3 py-1 rounded-md text-sm font-medium transition duration-200 bg-amber-500 text-white hover:bg-amber-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(venue.venueId)}
                                            className="px-3 py-1 rounded-md text-sm font-medium transition duration-200 bg-red-500 text-white hover:bg-red-600"
                                        >
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
};

export default Venue;
