
export default function EventRow({ event, onView, onUpdate, onDelete }) {
  const toggleMenu = () => {
    const menu = document.getElementById(`event-menu-${event.eventId}`);
    if (menu) menu.classList.toggle("hidden");
  };

  const closeMenu = () => {
    const menu = document.getElementById(`event-menu-${event.eventId}`);
    if (menu) menu.classList.add("hidden");
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6 text-sm text-gray-500">{event.eventId}</td>
      <td className="py-4 px-6 text-sm font-medium text-gray-900">{event.name}</td>
      <td className="py-4 px-6 text-sm text-gray-700">
        {new Date(event.startDate).toLocaleDateString()}
      </td>
      <td className="py-4 px-6 text-sm text-gray-700">
        {new Date(event.endDate).toLocaleDateString()}
      </td>
      <td className="py-4 px-6 text-sm text-gray-700">
        ${parseFloat(event.budget).toFixed(2)}
      </td>
      <td className="py-4 px-6 text-sm capitalize text-gray-700">{event.status}</td>
      <td className="py-4 px-6 text-sm text-gray-600">
        <div className="flex justify-end relative">
          <button
            className="inline-flex items-center px-3 py-1 text-sm font-medium bg-green-500 text-white rounded hover:bg-slate-400"
            onClick={toggleMenu}
          >
            Actions ▾
          </button>
          <div
            id={`event-menu-${event.eventId}`}
            className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow-lg hidden z-10"
          >
            <button
              onClick={() => {
                onView(event);
                closeMenu();
              
              }}
              className="block w-full text-left px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
            >
              View
            </button>
            <button
              onClick={() => {
                onUpdate(event);
                closeMenu();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-amber-600 hover:bg-amber-50"
            >
              Update
            </button>
            <button
              onClick={() => {
                onDelete(event.eventId);
                closeMenu();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}
