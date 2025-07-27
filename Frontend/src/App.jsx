import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/login";
import Navbar from "./components/NavBar";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthContext"; 
import ProtectedRoute from "./components/ProtectedRoute";
import Event from "./pages/Event";
import Venue from "./pages/Venue";
import Catering from "./pages/Catering";
import User from "./pages/User";
import './index.css'
import DashboardLayout from "./components/DashBoardLayout";

function AppRoutes() {
  return (
    <>
     <Routes>
      <Route path="/" element={<Login />} />

      <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      }
  />

      <Route
        path="/event-booking"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Event />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/venues"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Venue />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/catering"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Catering />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <User />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
    </>
  )
}

export default function App(){
  return (  
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
