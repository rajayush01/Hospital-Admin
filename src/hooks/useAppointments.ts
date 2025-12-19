import { useEffect, useState } from "react";
import type { Appointment } from "../types";
import { backendApi } from "../api/backendApi";

export type FilterType = "today" | "week" | "month" | "all";

export function useAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>("today");

  async function fetchAppointments() {
    try {
      console.log("🌐 Fetching appointments from BACKEND...");
      setLoading(true);

      const res = await backendApi.getAppointments();

      console.log("✅ Backend appointments:", res);
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

  // 🔹 Filter logic (client-side for now)
  const filteredAppointments = appointments.filter((a) => {
    if (filter === "all") return true;

    const today = new Date();
    const apptDate = new Date(a.date);

    if (filter === "today") {
      return apptDate.toDateString() === today.toDateString();
    }

    if (filter === "week") {
      const weekLater = new Date();
      weekLater.setDate(today.getDate() + 7);
      return apptDate >= today && apptDate <= weekLater;
    }

    if (filter === "month") {
      return (
        apptDate.getMonth() === today.getMonth() &&
        apptDate.getFullYear() === today.getFullYear()
      );
    }

    return true;
  });

  return {
    appointments: filteredAppointments,
    loading,
    filter,
    setFilter,
    refetch: fetchAppointments,
  };
}
