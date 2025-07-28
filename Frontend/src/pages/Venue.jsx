import React, { useEffect, useState } from "react";
import API from "../api";

export default function Venue() {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const res = await API.get("api/venues");
        setVenues(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load venues.");
      } finally {
        setLoading(false);
      }
    };
    fetchVenues();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/venues/${id}`);
      setVenues((prev) => prev.filter((v) => v.venueId !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("location", e.target.location.value);
    formData.append("max_occupancy", e.target.max_occupancy.value);
    formData.append("email", e.target.email.value);
    formData.append("phone", e.target.phone.value);
    if (image) formData.append("image", image);

    try {
          for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
}
      let res;
      if (showUpdateForm) {
        res = await API.put(`/api/venues/${showUpdateForm.venueId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setVenues((prev) =>
          prev.map((v) =>
            v.venueId === res.data.venue.venueId ? res.data.venue : v
          )
        );
        setShowUpdateForm(null);
      } else {
        res = await API.post("/api/venues", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setVenues((prev) => [...prev, res.data.venue]);
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Submit error:", err);
      setError("Failed to submit venue data.");
    } finally {
      setLoading(false);
      setImage(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-slate-500 text-3xl font-semibold">Venue Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
        >
          Add New Venue
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-6 text-start">ID</th>
              <th className="py-3 px-6 text-start">Name</th>
              <th className="py-3 px-6 text-start">Location</th>
              <th className="py-3 px-6 text-start">Occupancy</th>
              <th className="py-3 px-6 text-start">Email</th>
              <th className="py-3 px-6 text-end">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {venues.map((v) => (
              <tr key={v.venueId} className="hover:bg-gray-50">
                <td className="py-4 px-6 text-sm text-gray-600">{v.venueId}</td>
                <td className="py-4 px-6 text-sm font-medium text-gray-900">{v.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{v.location}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{v.max_occupancy}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{v.email}</td>
                <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="relative inline-block text-left">
                        <button
                        className="inline-flex justify-center w-full px-3 py-1 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-200"
                        onClick={() => document.getElementById(`menu-${v.venueId}`).classList.toggle("hidden")}
                        >
                        Actions ▾
                        </button>
                        <div
                        id={`menu-${v.venueId}`}
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg hidden z-10"
                        >
                        <button
                            onClick={() => {
                            setSelectedVenue(v);
                            document.getElementById(`menu-${v.venueId}`).classList.add("hidden");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        >
                            View
                        </button>
                        <button
                            onClick={() => {
                            setShowUpdateForm(v);
                            document.getElementById(`menu-${v.venueId}`).classList.add("hidden");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
                        >
                            Update
                        </button>
                        <button
                            onClick={() => {
                            handleDelete(v.venueId);
                            document.getElementById(`menu-${v.venueId}`).classList.add("hidden");
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            Delete
                        </button>
                        </div>
                    </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddForm || selectedVenue || showUpdateForm) && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-70">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl mx-4 border border-gray-300 shadow-lg">
            {(showAddForm || showUpdateForm) && (
              <>
                <h2 className="text-slate-500 text-xl font-extrabold underline pb-4 text-center">
                  {showAddForm ? "Add Venue" : "Update Venue"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    name="name"
                    defaultValue={showUpdateForm?.name || ""}
                    placeholder="Name"
                    required
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                  />
                  <input
                    name="location"
                    defaultValue={showUpdateForm?.location || ""}
                    placeholder="Location"
                    required
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                  />
                  <input
                    name="max_occupancy"
                    type="number"
                    defaultValue={showUpdateForm?.max_occupancy || ""}
                    placeholder="Max Occupancy"
                    required
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                  />
                  <input
                    name="email"
                    type="email"
                    defaultValue={showUpdateForm?.email || ""}
                    placeholder="Email"
                    required
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                  />
                  <input
                    name="phone"
                    defaultValue={showUpdateForm?.phone || ""}
                    placeholder="Phone"
                    required
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                  />
                  <input
                    name="image"
                    type="file"
                    onChange={handleImageChange}
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                  />
                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddForm(false);
                        setShowUpdateForm(null);
                        setImage(null);
                      }}
                      className="px-4 py-2 bg-gray-300 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-600 text-white rounded"
                    >
                      {showAddForm ? "Confirm" : "Update"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {selectedVenue && (
              <div className="flex flex-col gap-2">
                {selectedVenue.imageUrl && (
                  <img
                    src={`http://localhost:4000${selectedVenue.imageUrl}`}
                    alt="Venue Preview"
                    className="w-full md:w-64 h-auto rounded border border-slate-100 shadow-lg mb-4"
                  />
                )}
                <h2 className="text-slate-500 text-xl font-extrabold underline">
                  Venue Details
                </h2>
                <p><strong>ID:</strong> {selectedVenue.venueId}</p>
                <p><strong>Name:</strong> {selectedVenue.name}</p>
                <p><strong>Location:</strong> {selectedVenue.location}</p>
                <p><strong>Max Occupancy:</strong> {selectedVenue.max_occupancy}</p>
                <p><strong>Email:</strong> {selectedVenue.email}</p>
                <p><strong>Phone:</strong> {selectedVenue.phone}</p>
                <button
                  onClick={() => setSelectedVenue(null)}
                  className="mt-6 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
