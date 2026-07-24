
import { useNavigate, Link, useLocation } from "react-router-dom";
import { isAuthenticated, logout } from "../utils/auth";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = token ? JSON.parse(atob(token.split(".")[1])) : null;


  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Navigation items
  const navItems = [
    { id: 1, name: 'Dashboard', path: '/dashboard', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
      </svg>
    )},
    { id: 2, name: 'Users', path: '/users', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
      </svg>
    )},
    { id: 3, name: 'Catering', path: '/catering', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-.35-.029-.693-.084-1.03A5 5 0 0010 11z" clipRule="evenodd" />
      </svg>
    )},
    { id: 4, name: 'Venues', path: '/venues', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
      </svg>
    )},
    { id: 5, name: 'Event Booking', path: '/event-booking', icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
      </svg>
    )},
  ];

  // Check if a nav item is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
     <>
  {/* Sidebar */}
  <div className="h-screen w-64 bg-gradient-to-b from-slate-500 to-slate-500 text-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static">
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center p-6 border-b border-slate-500">
        <div className="w-36 h-14 left-[66px] top-[14px] absolute justify-center text-white text-3xl font-normal font-['Righteous'] leading-10">
          EventNA
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-4">
          {navItems.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-md text-sm font-medium transition-all duration-300 ${
                isActive(item.path)
                  ? 'bg-white text-slate-500 font-bold shadow-md'
                  : 'text-gray-200 hover:bg-white hover:text-slate-500'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-white">
        <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium outline-2 outline-offset-[-2px] outline-white text-white bg-slate-500 hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  </div>

    </>
);
}