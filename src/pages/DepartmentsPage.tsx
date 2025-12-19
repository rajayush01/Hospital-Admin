import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Chip,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { backendApi } from "../api/backendApi";

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

interface Doctor {
  _id: string;
  name: string;
}

interface Department {
  _id: string;
  name: string;
  doctors: Doctor[];
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadDepartments() {
    try {
      const res = await backendApi.getDepartmentsWithDoctors();
      setDepartments(res);
    } catch (err) {
      console.error("Failed to load departments", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDepartments();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 2,
        }}
      >
        <CircularProgress size={48} />
        <Typography color="text.secondary" fontWeight={500}>
          Loading departments...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        px: { xs: 2, md: 4 },
        py: 4,
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
      }}
    >
      {/* Header */}
      <MotionBox
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        mb={5}
      >
        <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              background: "linear-gradient(135deg, #1976d2 0%, #2f6cff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Departments
          </Typography>
          <Chip
            label={`${departments.length} Total`}
            sx={{
              fontWeight: 700,
              background: "linear-gradient(135deg, #1976d2, #2f6cff)",
              color: "#fff",
            }}
          />
        </Box>
        <Typography variant="body1" color="text.secondary" fontWeight={500} mt={1}>
          Browse all departments and their assigned doctors
        </Typography>
      </MotionBox>

      {/* Departments List */}
      {departments.length === 0 ? (
        <MotionPaper
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 3,
            border: "1px solid #e3e8ef",
            textAlign: "center",
            background: "linear-gradient(135deg, #f8fafc 0%, #f0f4ff 100%)",
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #e3f2fd, #f0f7ff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 3,
              border: "3px solid #fff",
              boxShadow: "0 4px 12px rgba(47, 108, 255, 0.15)",
            }}
          >
            <Typography variant="h3" fontWeight={700}>
              🏥
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight={600} color="text.secondary">
            No Departments Found
          </Typography>
        </MotionPaper>
      ) : (
        <Stack spacing={4}>
          {departments.map((dept, deptIdx) => (
            <MotionBox
              key={dept._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: deptIdx * 0.1 }}
            >
              <MotionPaper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  border: "1px solid #e3e8ef",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 8px 24px rgba(47, 108, 255, 0.12)",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                {/* Department Header */}
                <Box
                  sx={{
                    p: 3,
                    background: "linear-gradient(135deg, #f8fafc 0%, #e8f0fe 100%)",
                    borderBottom: "1px solid #e3e8ef",
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    gap={2}
                  >
                    <Box display="flex" alignItems="center" gap={1.5}>
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          background: "linear-gradient(135deg, #1976d2, #2f6cff)",
                        }}
                      />
                      <Typography variant="h5" fontWeight={800}>
                        {dept.name}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${dept.doctors.length} ${
                        dept.doctors.length === 1 ? "Doctor" : "Doctors"
                      }`}
                      size="small"
                      sx={{
                        fontWeight: 700,
                        background:
                          dept.doctors.length > 0
                            ? "linear-gradient(135deg, #1976d2, #2f6cff)"
                            : "#e0e0e0",
                        color: dept.doctors.length > 0 ? "#fff" : "#666",
                      }}
                    />
                  </Box>
                </Box>

                {/* Doctors List */}
                <Box sx={{ p: 3 }}>
                  {dept.doctors.length === 0 ? (
                    <Box
                      sx={{
                        p: 4,
                        textAlign: "center",
                        background: "#f8fafc",
                        borderRadius: 2,
                        border: "1px dashed #cbd5e1",
                      }}
                    >
                      <Typography
                        color="text.secondary"
                        fontWeight={500}
                        sx={{ fontSize: "0.95rem" }}
                      >
                        No doctors assigned to this department
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns: {
                          xs: "repeat(1, 1fr)",
                          sm: "repeat(2, 1fr)",
                          md: "repeat(3, 1fr)",
                          lg: "repeat(4, 1fr)",
                        },
                        gap: 2,
                      }}
                    >
                      {dept.doctors.map((doc, docIdx) => (
                        <MotionPaper
                          key={doc._id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.3,
                            delay: deptIdx * 0.1 + docIdx * 0.05,
                          }}
                          elevation={0}
                          sx={{
                            p: 2.5,
                            borderRadius: 2,
                            background: "linear-gradient(135deg, #fafbfc 0%, #f0f4ff 100%)",
                            border: "1px solid #e3e8ef",
                            transition: "all 0.2s ease",
                            position: "relative",
                            overflow: "hidden",
                            "&:hover": {
                              background: "linear-gradient(135deg, #e3f2fd 0%, #f0f7ff 100%)",
                              transform: "translateY(-4px)",
                              boxShadow: "0 6px 16px rgba(47, 108, 255, 0.15)",
                              border: "1px solid #2f6cff",
                            },
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              left: 0,
                              top: 0,
                              bottom: 0,
                              width: "3px",
                              background: "linear-gradient(180deg, #1976d2, #2f6cff)",
                              opacity: 0,
                              transition: "opacity 0.2s ease",
                            },
                            "&:hover::before": {
                              opacity: 1,
                            },
                          }}
                        >
                          <Typography
                            fontWeight={600}
                            sx={{
                              fontSize: "0.95rem",
                              color: "#1e293b",
                            }}
                          >
                            Dr. {doc.name}
                          </Typography>
                        </MotionPaper>
                      ))}
                    </Box>
                  )}
                </Box>
              </MotionPaper>
            </MotionBox>
          ))}
        </Stack>
      )}
    </Box>
  );
}