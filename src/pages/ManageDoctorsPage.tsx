import { useEffect, useState } from "react";
import { backendApi } from "../api/backendApi";

import AddDoctorForm from "../componenets/doctors/AddDoctorForm";
import AddDepartmentForm from "../componenets/doctors/AddDepartmentForm";
import WeeklyScheduleEditor from "../componenets/doctors/WeeklyScheduleEditor";

import {
  Paper,
  Typography,
  Box,
  Stack,
  Chip,
  CircularProgress,
  Avatar,
  TextField,
} from "@mui/material";
import { motion } from "framer-motion";
import { FaPerson } from "react-icons/fa6";
import { FaHospitalAlt } from "react-icons/fa";

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

export default function ManageDoctorsPage() {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
const [departments, setDepartments] = useState<any[]>([]);

  async function loadDoctors() {
  try {
    setLoading(true);
    const [doctorsRes, departmentsRes] = await Promise.all([
      backendApi.getDoctors(),
      backendApi.getDepartments(), // ✅ Load departments too
    ]);
    
    setDoctors(doctorsRes);
    setDepartments(departmentsRes); // ✅ Set departments
    
    if (selected) {
      const updated = doctorsRes.find((d: any) => d._id === selected._id);
      if (updated) setSelected(updated);
    }
  } catch (error) {
    console.error("Failed to load data:", error);
  } finally {
    setLoading(false);
  }
}

  useEffect(() => {
    loadDoctors();
  }, []);

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.departmentId?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      sx={{
        px: { xs: 2, md: 3 },
        py: 3,
        maxWidth: 1800,
        mx: "auto",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
      }}
    >
      {/* HEADER */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        mb={4}
      >
        <Typography
          variant="h4"
          fontWeight={900}
          sx={{
            background: "linear-gradient(135deg, #1976d2 0%, #2f6cff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 1,
          }}
        >
          Manage Doctors
        </Typography>
        <Typography variant="body1" color="text.secondary" fontWeight={500}>
          Departments, doctors & weekly schedules
        </Typography>
      </MotionBox>

      {/* MAIN CONTAINER */}
      <Box
        sx={{
          display: "flex",
          gap: 2.5,
          flexWrap: "wrap",
          "@media (max-width: 1199px)": {
            flexDirection: "column",
          },
        }}
      >
        {/* LEFT COLUMN - FORMS */}
        <Box
          sx={{
            flex: "1 1 300px",
            minWidth: "280px",
            maxWidth: { lg: "25%" },
            "@media (min-width: 900px) and (max-width: 1199px)": {
              flex: "1 1 48%",
              maxWidth: "48%",
            },
            "@media (max-width: 899px)": {
              maxWidth: "100%",
            },
          }}
        >
          <Stack spacing={2.5}>
            {/* ADD DEPARTMENT */}
            <MotionPaper
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "#ffffff",
                border: "1px solid #e3e8ef",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(47, 108, 255, 0.12)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1976d2, #2f6cff)",
                  }}
                />
                <Typography variant="h6" fontWeight={700}>
                  Add Department
                </Typography>
              </Box>
              <AddDepartmentForm onCreated={loadDoctors} />
            </MotionPaper>

            {/* ADD DOCTOR */}
            <MotionPaper
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              elevation={0}
              sx={{
                p: 2.5,
                borderRadius: 3,
                background: "#ffffff",
                border: "1px solid #e3e8ef",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 8px 24px rgba(47, 108, 255, 0.12)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1976d2, #2f6cff)",
                  }}
                />
                <Typography variant="h6" fontWeight={700}>
                  Add Doctor
                </Typography>
              </Box>
              <AddDoctorForm departments={departments} onCreated={loadDoctors} />
            </MotionPaper>
          </Stack>
        </Box>

        {/* MIDDLE COLUMN - DOCTORS LIST */}
        <Box
          sx={{
            flex: "1 1 300px",
            minWidth: "280px",
            maxWidth: { lg: "25%" },
            "@media (min-width: 900px) and (max-width: 1199px)": {
              flex: "1 1 48%",
              maxWidth: "48%",
            },
            "@media (max-width: 899px)": {
              maxWidth: "100%",
            },
          }}
        >
          <MotionPaper
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "#ffffff",
              border: "1px solid #e3e8ef",
              overflow: "hidden",
              transition: "all 0.3s ease",
              height: "calc(100vh - 200px)",
              display: "flex",
              flexDirection: "column",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(47, 108, 255, 0.12)",
              },
            }}
          >
            <Box
              sx={{
                p: 2.5,
                pb: 2,
                background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fe 100%)",
                borderBottom: "1px solid #e3e8ef",
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={2}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #1976d2, #2f6cff)",
                    }}
                  />
                  <Typography variant="h6" fontWeight={700}>
                    Doctors
                  </Typography>
                </Box>
                <Chip
                  label={filteredDoctors.length}
                  size="small"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #1976d2, #2f6cff)",
                    color: "#fff",
                  }}
                />
              </Box>

              <TextField
                size="small"
                fullWidth
                placeholder="Search doctors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    background: "#fff",
                  },
                }}
              />
            </Box>

            <Box
              sx={{
                p: 2,
                flex: 1,
                overflowY: "auto",
                "&::-webkit-scrollbar": {
                  width: "6px",
                },
                "&::-webkit-scrollbar-thumb": {
                  background: "#cbd5e1",
                  borderRadius: "3px",
                },
              }}
            >
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : filteredDoctors.length === 0 ? (
                <Box
                  sx={{
                    p: 3,
                    textAlign: "center",
                    background: "#f8fafc",
                    borderRadius: 2,
                  }}
                >
                  <Typography color="text.secondary" fontWeight={500} fontSize={14}>
                    {searchQuery ? "No doctors found" : "No doctors added yet"}
                  </Typography>
                </Box>
              ) : (
                filteredDoctors.map((d: any, idx: number) => {
                  const isActive = selected?._id === d._id;

                  return (
                    <MotionBox
                      key={d._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      onClick={() => setSelected(d)}
                      sx={{
                        p: 2,
                        mb: 1.5,
                        borderRadius: 2,
                        cursor: "pointer",
                        background: isActive
                          ? "linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%)"
                          : "#fafbfc",
                        border: isActive ? "2px solid #2f6cff" : "1px solid #e3e8ef",
                        transition: "all 0.2s ease",
                        position: "relative",
                        overflow: "hidden",
                        "&:hover": {
                          background: isActive
                            ? "linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%)"
                            : "#f0f4ff",
                          transform: "translateX(4px)",
                          boxShadow: "0 4px 12px rgba(47, 108, 255, 0.15)",
                        },
                        "&::before": isActive
                          ? {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "4px",
                              background: "linear-gradient(180deg, #1976d2, #2f6cff)",
                            }
                          : {},
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: isActive ? "#2f6cff" : "#e0e7ff",
                            color: isActive ? "#fff" : "#1e3a8a",
                            width: 42,
                            height: 42,
                            fontWeight: 700,
                            fontSize: 16,
                          }}
                        >
                          {d.name?.charAt(0)}
                        </Avatar>

                        <Box flex={1} minWidth={0}>
                          <Typography
                            fontWeight={700}
                            sx={{ mb: 0.2, fontSize: 14 }}
                            noWrap
                          >
                            Dr. {d.name}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <FaHospitalAlt />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "text.secondary",
                                fontSize: "0.75rem",
                              }}
                              noWrap
                            >
                              {d.departmentId?.name || "No Department"}
                            </Typography>
                          </Box>
                        </Box>

                        {isActive && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "#2f6cff",
                              flexShrink: 0,
                              animation: "pulse 2s infinite",
                              "@keyframes pulse": {
                                "0%, 100%": { opacity: 1 },
                                "50%": { opacity: 0.5 },
                              },
                            }}
                          />
                        )}
                      </Stack>
                    </MotionBox>
                  );
                })
              )}
            </Box>
          </MotionPaper>
        </Box>

        {/* RIGHT COLUMN - WEEKLY SCHEDULE */}
        <Box
          sx={{
            flex: "2 1 600px",
            minWidth: "280px",
            "@media (max-width: 1199px)": {
              flex: "1 1 100%",
              maxWidth: "100%",
            },
          }}
        >
          <MotionPaper
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            elevation={0}
            sx={{
              borderRadius: 3,
              background: "#ffffff",
              border: "1px solid #e3e8ef",
              height: "calc(100vh - 200px)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "all 0.3s ease",
              "&:hover": {
                boxShadow: "0 8px 24px rgba(47, 108, 255, 0.12)",
              },
            }}
          >
            {!selected ? (
              <Box
                sx={{
                  p: 6,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  textAlign: "center",
                  background: "linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)",
                }}
              >
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #e3f2fd, #f0f7ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 3,
                    border: "3px solid #fff",
                    boxShadow: "0 8px 24px rgba(47, 108, 255, 0.15)",
                  }}
                >
<FaPerson />
                </Box>
                <Typography variant="h6" fontWeight={600} color="text.secondary" mb={1}>
                  No Doctor Selected
                </Typography>
                <Typography color="text.secondary" fontSize={14}>
                  Select a doctor from the list to manage their weekly schedule
                </Typography>
              </Box>
            ) : (
              <>
                <Box
                  sx={{
                    p: 2.5,
                    background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fe 100%)",
                    borderBottom: "1px solid #e3e8ef",
                  }}
                >
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: "#2f6cff",
                        width: 48,
                        height: 48,
                        fontWeight: 700,
                      }}
                    >
                      {selected.name?.charAt(0)}
                    </Avatar>
                    <Box flex={1}>
                      <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: "50%",
                            background: "linear-gradient(135deg, #1976d2, #2f6cff)",
                          }}
                        />
                        <Typography variant="h6" fontWeight={800}>
                          Weekly Schedule
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Dr. {selected.name} — {selected.departmentId?.name}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
                  <WeeklyScheduleEditor doctor={selected} onUpdated={loadDoctors} />
                </Box>
              </>
            )}
          </MotionPaper>
        </Box>
      </Box>
    </Box>
  );
}