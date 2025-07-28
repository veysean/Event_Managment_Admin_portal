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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("cateringSet", e.target.cateringSet.value);
    formData.append("price", e.target.price.value);
    if (image) formData.append("image", image);

    try {
      let res;
      if (showUpdateForm) {
        res = await API.put(`/api/caterings/${showUpdateForm.cateringId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCaterings((prev) =>
          prev.map((item) =>
            item.cateringId === res.data.catering.cateringId ? res.data.catering : item
          )
        );
        setShowUpdateForm(null);
      } else {
        res = await API.post("api/caterings", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setCaterings((prev) => [...prev, res.data]);
        setShowAddForm(false);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to submit catering data. Please try again.");
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
        <h1 className="text-slate-500 text-3xl font-semibold">Catering Management</h1>
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
          <table className="min-w-full bg-white table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 w-1/6 text-start">ID</th>
                <th className="py-3 px-6 w-2/6 text-start">Catering Set</th>
                <th className="py-3 px-6 w-2/6 text-start">Price</th>
                <th className="py-3 px-6 w-1/6 text-end">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {caterings.map((item) => (
                <tr key={item.cateringId} className="hover:bg-gray-50">
                  <td className="py-4 px-6 ">{item.cateringId}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-900">{item.cateringSet}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">${parseFloat(item.price).toFixed(2)}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div className="flex justify-end relative">
                      <button
                        className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-500 text-white rounded hover:bg-green-200"
                        onClick={() => document.getElementById(`catering-menu-${item.cateringId}`).classList.toggle("hidden")}
                      >
                        Actions ▾
                      </button>
                      <div
                        id={`catering-menu-${item.cateringId}`}
                        className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg hidden z-10"
                      >
                        <button
                          onClick={() => {
                            setSelectedCatering(item);
                            document.getElementById(`catering-menu-${item.cateringId}`).classList.add("hidden");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setShowUpdateForm(item);
                            document.getElementById(`catering-menu-${item.cateringId}`).classList.add("hidden");
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => {
                            handleDelete(item.cateringId);
                            document.getElementById(`catering-menu-${item.cateringId}`).classList.add("hidden");
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

      )}

      {(showAddForm || selectedCatering || showUpdateForm) && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-opacity-70">
          <div className="bg-white rounded-lg p-6 w-full max-w-xl mx-4 border border-gray-300 shadow-lg">
            {(showAddForm || showUpdateForm) && (
              <>
                <h2 className=" text-slate-500  text-xl font-extrabold font-['Inter'] underline pb-4 justify-center text-center">
                  {showAddForm ? "Add Catering" : "Update Catering"}
                </h2>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <input
                    name="cateringSet"
                    placeholder="Catering Set"
                    defaultValue={showUpdateForm?.cateringSet || ""}
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                    required
                  />
                  <input
                    name="price"
                    type="number"
                    placeholder="Price"
                    defaultValue={showUpdateForm?.price || ""}
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                    required
                  />
                  <input
                    name="image"
                    type="file"
                    onChange={handleImageChange}
                    className="w-full p-2.5 bg-white rounded-[20px] border border-slate-500"
                  />
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => {
                      setShowAddForm(false);
                      setShowUpdateForm(null);
                      setImage(null);
                    }} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-slate-600 text-white rounded">
                      {showAddForm ? "Confirm" : "Update"}
                    </button>
                  </div>
                </form>
              </>
            )}

            {selectedCatering && (
              <div className="flex flex-col md:flex-row gap-10 items-center">
                {selectedCatering.imageUrl && (
                  <img
                    src={`http://localhost:4000${selectedCatering.imageUrl}`}
                    alt="Preview"
                    className="w-full md:w-64 h-auto rounded border border-slate-100 shadow-lg"
                  />
                )}
                <div className="flex flex-col gap-2">
                  <h2 className=" text-slate-500 text-xl font-extrabold font-['Inter'] underline">Catering Details</h2>
                  <p><strong className="text-slate-700 font-normal font-['Inter']">ID:</strong> {selectedCatering.cateringId}</p>
                  <p><strong className="text-slate-700 font-normal font-['Inter']">Set:</strong> {selectedCatering.cateringSet}</p>
                  <p><strong className="text-slate-700 font-normal font-['Inter']">Price:</strong> ${selectedCatering.price}</p>
                  <button onClick={() => setSelectedCatering(null)} className="mt-6 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Close</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
