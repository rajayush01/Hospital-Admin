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

// Icons
import { FaPerson } from "react-icons/fa6";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

// Assets
import logo1 from "../assets/images/logo-removebg-preview.png";
import { MdEventAvailable } from "react-icons/md";

// Motion wrapper
const MotionCard = motion(Card);

export default function Dashboard() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [appointmentsToday, setAppointmentsToday] = useState(0);
  const [openBooking, setOpenBooking] = useState(false);

  const today = dayjs().format("YYYY-MM-DD");

  async function loadData() {
    const docs = await backendApi.getDoctors();
    setDoctors(docs);

    const allAppointments = await backendApi.getAppointments();
    const todays = allAppointments.filter((a: any) =>
      dayjs(a.date).format("YYYY-MM-DD") === today
    );

    setAppointmentsToday(todays.length);
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
      {/* ================= HERO HEADER ================= */}
      <MotionCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          borderRadius: 5,
          background:
            "linear-gradient(135deg, #f5f9ff 0%, #eaf2ff 100%)",
          boxShadow: "0 20px 50px rgba(47,108,255,0.12)",
          p: 4,
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
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
              boxShadow: "0 16px 40px rgba(47,108,255,.35)",
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
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            md: "repeat(2, 1fr)",
          },
          gap: 4,
        }}
      >
        {/* TOTAL DOCTORS */}
        <MotionCard
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25 }}
          sx={{
            borderRadius: 5,
            background: "linear-gradient(135deg,#2f6cff,#6aa5ff)",
            color: "#fff",
            p: 3,
            boxShadow: "0 20px 45px rgba(47,108,255,.35)",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "18px",
                background: "rgba(255,255,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FaPerson/>
            </Box>

            {/* Text */}
            <Box>
              <Typography sx={{ opacity: 0.9, fontWeight: 500 }}>
                Total Doctors
              </Typography>
              <Typography variant="h3" fontWeight={800} lineHeight={1.1}>
                {doctors.length}
              </Typography>
            </Box>
          </Stack>
        </MotionCard>

        {/* TODAY'S APPOINTMENTS */}
        <MotionCard
          whileHover={{ y: -6 }}
          transition={{ duration: 0.25 }}
          sx={{
            borderRadius: 5,
            background: "linear-gradient(135deg,#1565c0,#42a5f5)",
            color: "#fff",
            p: 3,
            boxShadow: "0 20px 45px rgba(21,101,192,.35)",
          }}
        >
          <Stack direction="row" spacing={3} alignItems="center">
            {/* Icon */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "18px",
                background: "rgba(255,255,255,0.22)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdEventAvailable />
            </Box>

            {/* Text */}
            <Box>
              <Typography sx={{ opacity: 0.9, fontWeight: 500 }}>
                Today's Appointments
              </Typography>
              <Typography variant="h3" fontWeight={800} lineHeight={1.1}>
                {appointmentsToday}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.85 }}>
                {today}
              </Typography>
            </Box>
          </Stack>
        </MotionCard>
      </Box>

      {/* ================= DOCTOR SCHEDULES ================= */}
      <Box>
        <Typography variant="h5" fontWeight={800} mb={2}>
          Doctor Schedules
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(1, 1fr)",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 4,
          }}
        >
          {doctors.map((doc: any) => (
            <MotionCard
              key={doc._id}
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 200 }}
              sx={{
                height: "100%",
                borderRadius: 5,
                background:
                  "linear-gradient(180deg,#ffffff,#f6f9ff)",
                boxShadow: "0 16px 35px rgba(0,0,0,0.08)",
                p: 2,
              }}
            >
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "#2f6cff",
                        width: 54,
                        height: 54,
                        fontWeight: 700,
                      }}
                    >
                      {doc.name?.charAt(0)}
                    </Avatar>

                    <Box>
                      <Typography fontWeight={700}>
                        Dr. {doc.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        {doc.departmentId?.name || "No Department"}
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  {Object.entries(doc.schedule).map(
                    ([day, slots]: any) => (
                      <Box key={day}>
                        <Typography
                          fontWeight={700}
                          color="#1565c0"
                          sx={{ textTransform: "capitalize" }}
                        >
                          {day}
                        </Typography>

                        {slots.length === 0 ? (
                          <Typography variant="caption">
                            No slots available
                          </Typography>
                        ) : (
                          <Stack
                            direction="row"
                            spacing={1}
                            flexWrap="wrap"
                          >
                            {slots.map((s: any, i: number) => (
                              <Box
                                key={i}
                                sx={{
                                  px: 1.6,
                                  py: 0.6,
                                  borderRadius: 999,
                                  backgroundColor: "#e3f2fd",
                                  fontSize: 12,
                                  fontWeight: 600,
                                  color: "#0d47a1",
                                }}
                              >
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

      {/* ================= MODAL ================= */}
      <BookAppointmentModal
        open={openBooking}
        onClose={() => setOpenBooking(false)}
        onBooked={loadData}
      />
    </Stack>
  );
}