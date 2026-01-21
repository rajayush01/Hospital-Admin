import { Routes, Route } from "react-router-dom";
import SidebarLayout from "./layout/SidebarLayout";

import Dashboard from "./pages/Dashboard";
import AppointmentsPage from "./pages/AppointmentsPage";
import ManageDoctorsPage from "./pages/ManageDoctorsPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import DoctorLeaves from "./pages/DoctorLeaves"; 
export default function AppRouter() {
  return (
    <Routes>
      {/* Sidebar wrapper */}
      <Route path="/" element={<SidebarLayout />}>

        {/* Homepage = Dashboard */}
        <Route index element={<Dashboard />} />

        {/* Appointments page */}
        <Route path="appointments" element={<AppointmentsPage />} />

        {/* Manage Doctors page */}
        <Route path="manage-doctors" element={<ManageDoctorsPage />} />

        {/* Departments page */}
        <Route path="departments" element={<DepartmentsPage />} />

        {/*  Doctor Leaves page */}
        <Route path="doctor-leaves" element={<DoctorLeaves />} />

        {/* Fallback */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />

      </Route>
    </Routes>
  );
}
