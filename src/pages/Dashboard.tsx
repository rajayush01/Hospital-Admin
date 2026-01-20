import { useEffect, useState } from "react";
import { backendApi } from "../api/backendApi";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Stack,
  Button,
  Avatar,
} from "@mui/material";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import BookAppointmentModal from "../componenets/booking/BookAppointmentModal";
import DoctorLeaveModal from "../componenets/doctors/DoctorLeaveModal";

// Icons
import { FaPerson } from "react-icons/fa6";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { MdEventAvailable } from "react-icons/md";

// Assets
import logo1 from "../assets/images/logo-removebg-preview.png";

const MotionCard = motion(Card);

export default function Dashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [openBooking, setOpenBooking] = useState(false);

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [openLeaveModal, setOpenLeaveModal] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");

  // ==============================
  // LOAD DATA
  // ==============================
  async function loadData() {
    try {
      const docs = await backendApi.getDoctors();
      setDoctors(Array.isArray(docs) ? docs : []);

      const allAppointments = await backendApi.getAppointments();
      const list = Array.isArray(allAppointments) ? allAppointments : [];

      const todays = list.filter(
        (a: any) => dayjs(a.date).format("YYYY-MM-DD") === today
      );

      setAppointmentsToday(todays.length);
    } catch (err) {
      console.error("Dashboard load error:", err);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <Stack
      spacing={5}
      sx={{
        p: { xs: 2, md: 4 },
        maxWidth: 1500,
        mx: "auto",
      }}
    >
      {/* ================= HERO ================= */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          borderRadius: 5,
          background: "linear-gradient(135deg,#f5f9ff,#eaf2ff)",
          boxShadow: "0 20px 50px rgba(47,108,255,0.12)",
          p: 4,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={3}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <img src={logo1} alt="JK Hospital Logo" width={78} />
            <Box>
              <Typography variant="h4" fontWeight={800} color="#0a3cff">
                JK Hospital
              </Typography>
              <Typography color="text.secondary">
                Patient Appointment Management System
              </Typography>
            </Box>
          </Stack>

          <Button
            variant="contained"
            size="large"
            startIcon={<CalendarMonthIcon />}
            onClick={() => setOpenBooking(true)}
            sx={{
              borderRadius: 4,
              px: 4,
              py: 1.4,
              background: "linear-gradient(135deg,#2f6cff,#5a8cff)",
            }}
          >
            Book Appointment
          </Button>
        </Stack>
      </MotionCard>

      {/* ================= METRICS ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        {/* TOTAL DOCTORS */}
        <MotionCard sx={{ borderRadius: 5, p: 3, background: "#2f6cff", color: "#fff" }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <FaPerson size={42} />
            <Box>
              <Typography>Total Doctors</Typography>
              <Typography variant="h3">{doctors.length}</Typography>
            </Box>
          </Stack>
        </MotionCard>

        {/* TODAY'S APPOINTMENTS */}
        <MotionCard sx={{ borderRadius: 5, p: 3, background: "#1565c0", color: "#fff" }}>
          <Stack direction="row" spacing={3} alignItems="center">
            <MdEventAvailable size={42} />
            <Box>
              <Typography>Today's Appointments</Typography>
              <Typography variant="h3">{appointmentsToday}</Typography>
              <Typography variant="caption">{today}</Typography>
            </Box>
          </Stack>
        </MotionCard>
      </Box>

      {/* ================= DOCTORS ================= */}
      <Box>
        <Typography variant="h5" fontWeight={800} mb={2}>
          Doctor Schedules
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2,1fr)",
              lg: "repeat(3,1fr)",
            },
            gap: 4,
          }}
        >
          {doctors.map((doc: any) => (
            <MotionCard key={doc._id} sx={{ borderRadius: 5, p: 2 }}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar>{doc.name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography fontWeight={700}>Dr. {doc.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doc.departmentId?.name || "No Department"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  {/* ===== LEAVE STATUS ===== */}
                  <Box>
                    {doc.leaveDays?.length > 0 ? (
                      <Typography color="error" fontWeight={600}>
                        On Leave: {doc.leaveDays.join(", ")}
                      </Typography>
                    ) : (
                      <Typography color="success.main" fontWeight={600}>
                        Available All Days
                      </Typography>
                    )}

                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setSelectedDoctor(doc);
                        setOpenLeaveModal(true);
                      }}
                    >
                      Manage Leave
                    </Button>
                  </Box>

                  <Divider />

                  {/* ===== SCHEDULE ===== */}
                  {Object.entries(doc.schedule || {}).map(
                    ([day, slots]: any) => (
                      <Box key={day}>
                        <Typography fontWeight={700} sx={{ textTransform: "capitalize" }}>
                          {day}
                        </Typography>

                        {slots.length === 0 ? (
                          <Typography variant="caption">
                            No slots available
                          </Typography>
                        ) : (
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            {slots.map((s: any, i: number) => (
                              <Box key={i} sx={{ px: 1.5, py: 0.5, borderRadius: 999, bgcolor: "#e3f2fd" }}>
                                {s.start} – {s.end}
                              </Box>
                            ))}
                          </Stack>
                        )}
                      </Box>
                    )
                  )}
                </Stack>
              </CardContent>
            </MotionCard>
          ))}
        </Box>
      </Box>

      {/* ================= MODALS ================= */}
      <BookAppointmentModal
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        onBooked={loadData}
      />

      <DoctorLeaveModal
        open={openLeaveModal}
        onClose={() => setOpenLeaveModal(false)}
        doctor={selectedDoctor}
        onSaved={loadData}
      />
    </Stack>
  );
}
