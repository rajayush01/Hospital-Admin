import { useEffect, useState } from "react";
import { Stack, Box, Typography, Card } from "@mui/material";
import AppointmentFilters from "../componenets/appointments/AppointmentFilters";
import type { FilterType } from "../componenets/appointments/AppointmentFilters";
import AppointmentTable from "../componenets/appointments/AppointmentTable";
import ExportCSVButton from "../componenets/appointments/ExportCSVButton";
import { backendApi } from "../api/backendApi";
import type { Appointment } from "../types";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Filter & Sort state
  const [filter, setFilter] = useState<FilterType>("today");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [customRange, setCustomRange] = useState<{
    from: string;
    to: string;
  } | null>(null);

  // ==========================
  // FETCH APPOINTMENTS
  // ==========================
  async function fetchAppointments() {
    try {
      setLoading(true);
      const res = await backendApi.getAppointments();
      setAppointments(res);
    } catch (err) {
      console.error("❌ Failed to fetch appointments:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  // ==========================
  // FILTER + SORT LOGIC
  // ==========================
  const filteredAppointments = appointments
    .filter((a) => {
      const apptDate = new Date(a.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (filter === "all") return true;

      if (filter === "today") {
        return apptDate.toDateString() === today.toDateString();
      }

      if (filter === "week") {
        const weekEnd = new Date(today);
        weekEnd.setDate(today.getDate() + 7);
        return apptDate >= today && apptDate <= weekEnd;
      }

      if (filter === "month") {
        return (
          apptDate.getMonth() === today.getMonth() &&
          apptDate.getFullYear() === today.getFullYear()
        );
      }

      if (filter === "custom" && customRange) {
        const from = new Date(customRange.from);
        const to = new Date(customRange.to);
        to.setHours(23, 59, 59, 999);
        return apptDate >= from && apptDate <= to;
      }

      return true;
    })
    .sort((a, b) => {
      const d1 = new Date(a.date).getTime();
      const d2 = new Date(b.date).getTime();
      return sortOrder === "asc" ? d1 - d2 : d2 - d1;
    });

  // ==========================
  // RENDER
  // ==========================
  return (
    <Stack spacing={4}>
      {/* ================= HEADER ================= */}
      <Box>
        <Typography variant="h4" fontWeight={800}>
          Appointments
        </Typography>
        <Typography variant="body2" color="text.secondary">
          View, filter, and manage all patient appointments
        </Typography>
      </Box>

      {/* ================= FILTERS + EXPORT ================= */}
      <MotionCard
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{
          borderRadius: 4,
          p: 2,
          background: "linear-gradient(180deg,#ffffff,#f6f9ff)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <AppointmentFilters
            current={filter}
            onChange={setFilter}
            sortOrder={sortOrder}
            onSortChange={setSortOrder}
            onCustomChange={(from, to) =>
              setCustomRange({ from, to })
            }
          />

          <ExportCSVButton data={filteredAppointments} />
        </Stack>
      </MotionCard>

      {/* ================= TABLE ================= */}
      <MotionCard
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        sx={{
          borderRadius: 4,
          background: "#ffffff",
          boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
        }}
      >
        <AppointmentTable
          data={filteredAppointments}
          loading={loading}
          onUpdated={fetchAppointments}
        />
      </MotionCard>
    </Stack>
  );
}
