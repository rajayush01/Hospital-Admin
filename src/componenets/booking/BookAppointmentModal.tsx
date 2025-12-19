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
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const [form, setForm] = useState({
    departmentId: "",
    doctorId: "",
    patientName: "",
    guardianName: "",
    phone: "",
    date: dayjs().format("YYYY-MM-DD"),
    slot: null as any,
  });

  async function loadDepartments() {
    try {
      setLoading(true);
      const res = await backendApi.getDepartments();
      setDepartments(res);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load departments', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function loadDoctors() {
    if (!form.departmentId) return;
    try {
      setLoading(true);
      const res = await backendApi.getDoctorsByDepartment(form.departmentId);
      setDoctors(res);
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load doctors', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function loadSlots() {
    if (!form.doctorId || !form.date) return;

    try {
      setLoading(true);
      const res = await backendApi.getDoctorSlots(form.doctorId, form.date);
      setSlots(res.availableSlots || []);
      setNextAvailableDate(res.nextAvailableDate || null);

      if (res.availableSlots.length === 0 && res.nextAvailableDate) {
        setForm((f) => ({
          ...f,
          date: res.nextAvailableDate,
          slot: null,
        }));
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to load slots', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  async function book() {
    if (!form.slot) {
      setSnackbar({ open: true, message: 'Please select a time slot', severity: 'error' });
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

      setSnackbar({ open: true, message: 'Appointment booked successfully!', severity: 'success' });
      onBooked();
      onClose();
      
      // Reset form
      setForm({
        departmentId: "",
        doctorId: "",
        patientName: "",
        guardianName: "",
        phone: "",
        date: dayjs().format("YYYY-MM-DD"),
        slot: null,
      });
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to book appointment', severity: 'error' });
    } finally {
      setBookingLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      loadDepartments();
    }
  }, [open]);

  useEffect(() => {
    loadDoctors();
  }, [form.departmentId]);

  useEffect(() => {
    loadSlots();
  }, [form.doctorId, form.date]);

  return (
    <>
      <Dialog open={open} onClose={!bookingLoading ? onClose : undefined} fullWidth maxWidth="sm">
        <DialogTitle
          sx={{
            fontWeight: 800,
            fontSize: 22,
            pb: 1,
          }}
        >
          Book Appointment
          <Typography variant="body2" color="text.secondary">
            Select department, doctor, and available time slot
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ pt: 3 }}>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}
          
          {!loading && (
            <Stack spacing={3}>
              <Box>
                <Typography fontWeight={600} mb={0.5}>
                  Department
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={form.departmentId}
                  onChange={(e) =>
                    setForm({ ...form, departmentId: e.target.value, doctorId: "", slot: null })
                  }
                  disabled={bookingLoading}
                >
                  {departments.map((d) => (
                    <MenuItem key={d._id} value={d._id}>
                      {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box>
                <Typography fontWeight={600} mb={0.5}>
                  Doctor
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={form.doctorId}
                  onChange={(e) =>
                    setForm({ ...form, doctorId: e.target.value, slot: null })
                  }
                  disabled={!form.departmentId || bookingLoading}
                >
                  {doctors.map((d) => (
                    <MenuItem key={d._id} value={d._id}>
                      Dr. {d.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box>
                <Typography fontWeight={600} mb={0.5}>
                  Appointment Date
                </Typography>
                <TextField
                  type="date"
                  fullWidth
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value, slot: null })
                  }
                  InputLabelProps={{ shrink: true }}
                  disabled={!form.doctorId || bookingLoading}
                />
              </Box>

              <Box>
                <Typography fontWeight={600} mb={0.5}>
                  Available Time Slots
                </Typography>
                <TextField
                  select
                  fullWidth
                  value={form.slot ? JSON.stringify(form.slot) : ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      slot: JSON.parse(e.target.value),
                    })
                  }
                  disabled={!form.date || bookingLoading}
                >
                  {slots.length === 0 && (
                    <MenuItem disabled>
                      No slots available for this date
                    </MenuItem>
                  )}

                  {slots.map((s, i) => (
                    <MenuItem key={i} value={JSON.stringify(s)}>
                      {s.start} — {s.end}
                    </MenuItem>
                  ))}
                </TextField>

                {slots.length === 0 && nextAvailableDate && (
                  <Typography
                    variant="caption"
                    color="primary"
                    sx={{ mt: 0.5, display: "block" }}
                  >
                    No slots today • Next available on{" "}
                    <b>{nextAvailableDate}</b>
                  </Typography>
                )}
              </Box>

              <Divider />

              <Typography fontWeight={700}>
                Patient Details
              </Typography>

              <Box>
                <Typography fontWeight={600} mb={0.5}>
                  Patient Name
                </Typography>
                <TextField
                  fullWidth
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                  disabled={bookingLoading}
                />
              </Box>

              <Box>
                <Typography fontWeight={600} mb={0.5}>
                  Guardian Name
                </Typography>
                <TextField
                  fullWidth
                  value={form.guardianName}
                  onChange={(e) =>
                    setForm({ ...form, guardianName: e.target.value })
                  }
                  disabled={bookingLoading}
                />
              </Box>

              <Box>
                <Typography fontWeight={600} mb={0.5}>
                  Phone Number
                </Typography>
                <TextField
                  fullWidth
                  value={form.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setForm({ ...form, phone: value });
                    }
                  }}
                  inputProps={{
                    maxLength: 10,
                    inputMode: "numeric",
                    pattern: "[0-9]*",
                  }}
                  error={form.phone.length > 0 && form.phone.length < 10}
                  helperText={
                    form.phone.length > 0 && form.phone.length < 10
                      ? "Phone number must be 10 digits"
                      : ""
                  }
                  disabled={bookingLoading}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={bookingLoading}>Cancel</Button>

          <Button
            variant="contained"
            onClick={book}
            disabled={!form.slot || !form.patientName || bookingLoading}
            sx={{
              borderRadius: 3,
              px: 4,
              background: "linear-gradient(135deg,#2f6cff,#5a8cff)",
            }}
          >
            {bookingLoading ? <CircularProgress size={20} color="inherit" /> : 'Book Appointment'}
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