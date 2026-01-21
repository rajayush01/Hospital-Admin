import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Stack,
  Typography,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import { backendApi } from "../../api/backendApi";
import dayjs from "dayjs";
import CustomSnackbar from "../CustomSnackbar";

export default function BookAppointmentModal({ open, onClose, onBooked }: any) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [doctors, setDoctors] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [nextAvailableDate, setNextAvailableDate] = useState<string | null>(null);
  const [doctorOnLeave, setDoctorOnLeave] = useState(false);

  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  const [form, setForm] = useState({
    departmentId: "",
    doctorId: "",
    patientName: "",
    guardianName: "",
    phone: "",
    date: dayjs().format("YYYY-MM-DD"),
    slot: null as any,
  });

  /* ================= LOADERS ================= */

  async function loadDepartments() {
    try {
      setLoading(true);
      setDepartments(await backendApi.getDepartments());
    } catch {
      setSnackbar({ open: true, message: "Failed to load departments", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function loadDoctors() {
    if (!form.departmentId) return;
    try {
      setLoading(true);
      setDoctors(await backendApi.getDoctorsByDepartment(form.departmentId));
    } catch {
      setSnackbar({ open: true, message: "Failed to load doctors", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function loadSlots() {
    if (!form.doctorId || !form.date) return;

    try {
      setLoading(true);
      setDoctorOnLeave(false);
      setSlots([]);

      const res = await backendApi.getDoctorSlots(form.doctorId, form.date);

      if (res.message === "Doctor is on leave") {
        setDoctorOnLeave(true);
        setNextAvailableDate(res.nextAvailableDate || null);
        return;
      }

      setSlots(res.availableSlots || []);
      setNextAvailableDate(res.nextAvailableDate || null);
    } catch {
      setSnackbar({ open: true, message: "Failed to load slots", severity: "error" });
    } finally {
      setLoading(false);
    }
  }

  /* ================= BOOK ================= */

  async function book() {
    if (!form.slot) {
      setSnackbar({ open: true, message: "Please select a time slot", severity: "error" });
      return;
    }

    try {
      setBookingLoading(true);
      await backendApi.bookAppointment({
        doctorId: form.doctorId,
        date: form.date,
        slot: form.slot,
        patientName: form.patientName,
        guardianName: form.guardianName,
        phone: form.phone,
      });

      setSnackbar({ open: true, message: "Appointment booked successfully!", severity: "success" });
      onBooked();
      onClose();

      setForm({
        departmentId: "",
        doctorId: "",
        patientName: "",
        guardianName: "",
        phone: "",
        date: dayjs().format("YYYY-MM-DD"),
        slot: null,
      });
    } catch {
      setSnackbar({ open: true, message: "Failed to book appointment", severity: "error" });
    } finally {
      setBookingLoading(false);
    }
  }

  /* ================= EFFECTS ================= */

  useEffect(() => {
    if (open) loadDepartments();
  }, [open]);

  useEffect(() => {
    loadDoctors();
  }, [form.departmentId]);

  useEffect(() => {
    loadSlots();
  }, [form.doctorId, form.date]);

  /* ================= UI ================= */

  return (
    <>
      <Dialog open={open} onClose={!bookingLoading ? onClose : undefined} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={800}>
          Book Appointment
          <Typography variant="body2" color="text.secondary">
            Select department, doctor, date & time slot
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress />
            </Box>
          ) : (
            <Stack spacing={3}>
              {/* DEPARTMENT */}
              <TextField
                select
                label="Department"
                fullWidth
                value={form.departmentId}
                onChange={(e) =>
                  setForm({ ...form, departmentId: e.target.value, doctorId: "", slot: null })
                }
              >
                {departments.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    {d.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* DOCTOR */}
              <TextField
                select
                label="Doctor"
                fullWidth
                value={form.doctorId}
                onChange={(e) =>
                  setForm({ ...form, doctorId: e.target.value, slot: null })
                }
                disabled={!form.departmentId}
              >
                {doctors.map((d) => (
                  <MenuItem key={d._id} value={d._id}>
                    Dr. {d.name}
                  </MenuItem>
                ))}
              </TextField>

              {/* DATE */}
              <TextField
                type="date"
                label="Appointment Date"
                fullWidth
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value, slot: null })
                }
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: dayjs().format("YYYY-MM-DD") }}
                disabled={!form.doctorId}
              />

              {/* SLOTS */}
              <TextField
                select
                label="Available Time Slots"
                fullWidth
                value={form.slot ? JSON.stringify(form.slot) : ""}
                onChange={(e) =>
                  setForm({ ...form, slot: JSON.parse(e.target.value) })
                }
                disabled={doctorOnLeave || slots.length === 0}
              >
                {slots.map((s, i) => (
                  <MenuItem key={i} value={JSON.stringify(s)}>
                    {s.start} – {s.end}
                  </MenuItem>
                ))}
              </TextField>

              {doctorOnLeave && (
                <Typography color="error" fontWeight={600}>
                  Doctor is on leave on this date
                  {nextAvailableDate && (
                    <> • Next available on <b>{nextAvailableDate}</b></>
                  )}
                </Typography>
              )}

              <Divider />

              {/* PATIENT DETAILS */}
              <TextField
                label="Patient Name"
                fullWidth
                value={form.patientName}
                onChange={(e) => setForm({ ...form, patientName: e.target.value })}
              />

              <TextField
                label="Guardian Name"
                fullWidth
                value={form.guardianName}
                onChange={(e) => setForm({ ...form, guardianName: e.target.value })}
              />

              <TextField
                label="Phone Number"
                fullWidth
                value={form.phone}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, "");
                  if (v.length <= 10) setForm({ ...form, phone: v });
                }}
                error={form.phone.length > 0 && form.phone.length < 10}
                helperText={
                  form.phone.length > 0 && form.phone.length < 10
                    ? "Phone number must be 10 digits"
                    : ""
                }
              />
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={bookingLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={book}
            disabled={
              bookingLoading ||
              doctorOnLeave ||
              !form.slot ||
              !form.patientName
            }
          >
            {bookingLoading ? <CircularProgress size={20} /> : "Book Appointment"}
          </Button>
        </DialogActions>
      </Dialog>

      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
}
