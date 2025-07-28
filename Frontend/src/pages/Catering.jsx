import React, { useEffect, useState } from "react";
import API from "../api";

export default function Catering() {
  const [caterings, setCaterings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCatering, setSelectedCatering] = useState(null);
  const [showUpdateForm, setShowUpdateForm] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchCaterings = async () => {
      try {
        const res = await API.get("api/caterings");
        setCaterings(res.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching caterings:", err);
        setError("Failed to load catering sets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCaterings();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/api/caterings/${id}`);
      setCaterings((prev) => prev.filter((item) => item.cateringId !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
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
        <h1 className="text-3xl font-bold text-gray-800">Catering Management</h1>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition"
        >
          Add New Catering
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6">
          <p>{error}</p>
        </div>
      )}

      {caterings.length === 0 ? (
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4">
          <p>No catering sets found. Add a new one to get started.</p>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">ID</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Catering Set</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Price</th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {caterings.map((item) => (
                <tr key={item.cateringId} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 text-sm text-gray-500">{item.cateringId}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{item.cateringSet}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-4 px-6 text-sm space-x-2">
                    <button onClick={() => setSelectedCatering(item)} className="px-3 py-1 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600">
                      View
                    </button>
                    <button onClick={() => setShowUpdateForm(item)} className="px-3 py-1 rounded-md text-sm font-medium bg-amber-500 text-white hover:bg-amber-600">
                      Update
                    </button>
                    <button onClick={() => handleDelete(item.cateringId)} className="px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {(showAddForm || selectedCatering || showUpdateForm) && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl mx-4 relative">
            {showAddForm && (
              <>
                <div className="w-56 mx-auto pb-5 text-slate-500 text-2xl font-extrabold font-['Inter'] underline">
                  Add Catering
                </div>

                <form className="flex flex-col gap-4">
                  <input placeholder="Catering Set" className="w-80 h-10 p-2.5 bg-white rounded-[20px] border border-slate-500" />
                  <input placeholder="Price" type="number" className="w-80 h-10 p-2.5 bg-white rounded-[20px] border border-slate-500" />
                  <input type="file" onChange={handleImageChange} className="w-80 h-10 p-2.5 bg-white rounded-[20px] border border-slate-500" />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button className="px-4 py-2 bg-slate-600 text-white rounded">Confirm</button>
                  </div>
                </form>
              </>
            )}

           {selectedCatering && (
              <div className="flex flex-col md:flex-row items-start gap-6 p-4 bg-white rounded-lg shadow">
                {/* Image Section */}
                {selectedCatering.imageUrl && (
                  <img
                    src={selectedCatering.imageUrl}
                    alt="Catering Preview"
                    className="w-full md:w-64 h-auto rounded-md object-cover border border-slate-300"
                  />
                )}

                {/* Text Details Section */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold mb-4 text-slate-700">Catering Details</h2>
                  <p><strong>ID:</strong> {selectedCatering.cateringId}</p>
                  <p><strong>Catering Set:</strong> {selectedCatering.cateringSet}</p>
                  <p><strong>Price:</strong> ${selectedCatering.price}</p>
                  <button
                    onClick={() => setSelectedCatering(null)}
                    className="mt-6 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}


            {showUpdateForm && (
              <>
                <h2 className="text-xl font-bold mb-4 text-slate-700">Update Catering</h2>
                <form className="flex flex-col gap-4">
                  <input defaultValue={showUpdateForm.cateringSet} className="w-80 h-10 p-2.5 bg-white rounded-[20px] border border-slate-500" />
                  <input defaultValue={showUpdateForm.price} className="w-80 h-10 p-2.5 bg-white rounded-[20px] border border-slate-500" />
                  <input type="file" onChange={handleImageChange} className="w-80 h-10 p-2.5 bg-white rounded-[20px] border border-slate-500" />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowUpdateForm(null)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button className="px-4 py-2 bg-amber-600 text-white rounded">Update</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
