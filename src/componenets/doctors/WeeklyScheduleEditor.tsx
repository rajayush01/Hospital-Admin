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
  { key: "monday", label: "Mon", full: "Monday" },
  { key: "tuesday", label: "Tue", full: "Tuesday" },
  { key: "wednesday", label: "Wed", full: "Wednesday" },
  { key: "thursday", label: "Thu", full: "Thursday" },
  { key: "friday", label: "Fri", full: "Friday" },
  { key: "saturday", label: "Sat", full: "Saturday" },
  { key: "sunday", label: "Sun", full: "Sunday" },
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

  // Duplicate schedule states
  const [sourceDay, setSourceDay] = useState<string>("monday");
  const [targetDays, setTargetDays] = useState<string[]>([]);

  useEffect(() => {
    setSchedule({
      ...defaultSchedule,
      ...doctor.schedule,
    });
    setActiveDay("monday");
    setSourceDay("monday");
    setTargetDays([]);
  }, [doctor]);

  async function save() {
    try {
      setLoading(true);
      await backendApi.updateDoctorSchedule(doctor._id, schedule);
      setSnackbar({
        open: true,
        message: "Weekly schedule updated successfully",
        severity: "success",
      });
      onUpdated();
    } catch {
      setSnackbar({
        open: true,
        message: "Failed to update schedule",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  function applyDuplicateSchedule() {
    const sourceSlots = schedule[sourceDay] ?? [];
    const updated = { ...schedule };

    targetDays.forEach((day) => {
      updated[day] = JSON.parse(JSON.stringify(sourceSlots));
    });

    setSchedule(updated);
    setTargetDays([]);
  }

  const activeDayLabel = days.find((d) => d.key === activeDay)?.full;

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
                  background:
                    activeDay === d.key
                      ? "linear-gradient(135deg,#2f6cff,#5a8cff)"
                      : "#e0e7ff",
                  color: activeDay === d.key ? "#fff" : "#1e3a8a",
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
        >
          <Typography variant="h6" fontWeight={700} mb={1}>
            Editing schedule for: {activeDayLabel}
          </Typography>

          <SlotEditor
            slots={schedule[activeDay] ?? []}
            onChange={(newSlots) =>
              setSchedule({ ...schedule, [activeDay]: newSlots })
            }
          />
        </motion.div>

        {/* DUPLICATE SCHEDULE */}
        <Box
          p={2}
          border="1px solid #e5e7eb"
          borderRadius={3}
          bgcolor="#f8fafc"
        >
          <Typography fontWeight={700} mb={1}>
            Duplicate Schedule
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Copy one day’s schedule and apply it to other days
          </Typography>

          {/* SOURCE DAY */}
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Select source day</InputLabel>
            <Select
              value={sourceDay}
              label="Select source day"
              onChange={(e) => setSourceDay(e.target.value)}
            >
              {days.map((d) => (
                <MenuItem key={d.key} value={d.key}>
                  {d.full}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* TARGET DAYS */}
          <Typography fontWeight={600} mb={1}>
            Apply {days.find(d => d.key === sourceDay)?.full}'s schedule to:
          </Typography>

          <Box display="flex" gap={1} flexWrap="wrap">
            {days
              .filter((d) => d.key !== sourceDay)
              .map((d) => {
                const selected = targetDays.includes(d.key);
                return (
                  <Chip
                    key={d.key}
                    label={d.label}
                    clickable
                    color={selected ? "primary" : "default"}
                    onClick={() =>
                      setTargetDays((prev) =>
                        selected
                          ? prev.filter((x) => x !== d.key)
                          : [...prev, d.key]
                      )
                    }
                  />
                );
              })}
          </Box>

          <Button
            variant="contained"
            size="small"
            sx={{ mt: 2 }}
            disabled={targetDays.length === 0}
            onClick={applyDuplicateSchedule}
          >
            Apply to selected days
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
