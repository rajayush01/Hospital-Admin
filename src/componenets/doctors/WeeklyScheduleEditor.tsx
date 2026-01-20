import { useEffect, useState } from "react";
import {
  Stack,
  Chip,
  Box,
  Typography,
  Divider,
  Button,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { motion } from "framer-motion";
import SlotEditor from "./SlotEditor";
import { backendApi } from "../../api/backendApi";
import CustomSnackbar from "../CustomSnackbar";

const days = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
];

const defaultSchedule = {
  monday: [],
  tuesday: [],
  wednesday: [],
  thursday: [],
  friday: [],
  saturday: [],
  sunday: [],
};

export default function WeeklyScheduleEditor({ doctor, onUpdated }: any) {
  const [schedule, setSchedule] = useState({
    ...defaultSchedule,
    ...doctor.schedule,
  });

  const [activeDay, setActiveDay] = useState("monday");
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // 🔁 Copy states
  const [copyFromDay, setCopyFromDay] = useState<string>("monday");
  const [copyToDays, setCopyToDays] = useState<string[]>([]);

  useEffect(() => {
    setSchedule({
      ...defaultSchedule,
      ...doctor.schedule,
    });
    setActiveDay("monday");
    setCopyFromDay("monday");
    setCopyToDays([]);
  }, [doctor]);

  async function save() {
    try {
      setLoading(true);
      await backendApi.updateDoctorSchedule(doctor._id, schedule);
      setSnackbar({
        open: true,
        message: "Schedule updated successfully!",
        severity: "success",
      });
      onUpdated();
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to update schedule",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  function applyCopySchedule() {
    const sourceSlots = schedule[copyFromDay] ?? [];

    const updatedSchedule = { ...schedule };

    copyToDays.forEach((day) => {
      updatedSchedule[day] = JSON.parse(JSON.stringify(sourceSlots));
    });

    setSchedule(updatedSchedule);
    setCopyToDays([]);
  }

  return (
    <>
      <Stack spacing={3}>
        {/* DAY SELECTOR */}
        <Box display="flex" gap={1} justifyContent="space-between" flexWrap="wrap">
          {days.map((d) => (
            <motion.div
              key={d.key}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Chip
                label={d.label}
                onClick={() => setActiveDay(d.key)}
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  fontWeight: 700,
                  cursor: "pointer",
                  background:
                    activeDay === d.key
                      ? "linear-gradient(135deg,#2f6cff,#5a8cff)"
                      : "#e0e7ff",
                  color: activeDay === d.key ? "#fff" : "#1e3a8a",
                  transition: "all 0.2s ease",
                }}
              />
            </motion.div>
          ))}
        </Box>

        {/* SLOT EDITOR */}
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Typography
            variant="h6"
            fontWeight={700}
            mb={1}
            sx={{ textTransform: "capitalize" }}
          >
            {activeDay}
          </Typography>

          <SlotEditor
            slots={schedule[activeDay] ?? []}
            onChange={(newSlots) =>
              setSchedule({ ...schedule, [activeDay]: newSlots })
            }
          />
        </motion.div>

        {/* COPY FROM / TO */}
        <Box
          p={2}
          border="1px solid #e5e7eb"
          borderRadius={3}
          bgcolor="#f8fafc"
        >
          <Typography fontWeight={600} mb={2}>
            Copy Schedule
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            {/* COPY FROM */}
            <FormControl fullWidth size="small">
              <InputLabel>Copy from</InputLabel>
              <Select
                value={copyFromDay}
                label="Copy from"
                onChange={(e) => setCopyFromDay(e.target.value)}
              >
                {days.map((d) => (
                  <MenuItem key={d.key} value={d.key}>
                    {d.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* COPY TO */}
            <Box display="flex" gap={1} flexWrap="wrap">
              {days
                .filter((d) => d.key !== copyFromDay)
                .map((d) => {
                  const selected = copyToDays.includes(d.key);
                  return (
                    <Chip
                      key={d.key}
                      label={d.label}
                      clickable
                      color={selected ? "primary" : "default"}
                      onClick={() =>
                        setCopyToDays((prev) =>
                          selected
                            ? prev.filter((x) => x !== d.key)
                            : [...prev, d.key]
                        )
                      }
                    />
                  );
                })}
            </Box>
          </Stack>

          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            disabled={copyToDays.length === 0}
            onClick={applyCopySchedule}
          >
            Apply Copy
          </Button>
        </Box>

        <Divider />

        {/* SAVE */}
        <Button
          variant="contained"
          onClick={save}
          disabled={loading}
          sx={{
            alignSelf: "flex-start",
            px: 4,
            borderRadius: 3,
            background: "linear-gradient(135deg,#2f6cff,#5a8cff)",
          }}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Save Weekly Schedule"
          )}
        </Button>
      </Stack>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
}
