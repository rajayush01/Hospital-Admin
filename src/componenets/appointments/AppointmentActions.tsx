import { useState } from "react";
import type { Appointment } from "../../types";
import { backendApi } from "../../api/backendApi";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  CircularProgress,
  Box,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmDialog from "../ConfirmDialog";
import CustomSnackbar from "../CustomSnackbar";


type SnackbarSeverity = 'success' | 'error' | 'warning' | 'info';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: SnackbarSeverity;
}


export default function AppointmentActions({
  item,
  onUpdated,
}: {
  item: Appointment;
  onUpdated: () => void;
}) {
  const [open, setOpen] = useState(false);
 const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
const [snackbar, setSnackbar] = useState<SnackbarState>({
  open: false,
  message: '',
  severity: 'success',
});

  const [form, setForm] = useState({
    start: item.slot?.start || "",
    end: item.slot?.end || "",
    status: item.status,
  });

  function handleOpen() {
    setForm({
      start: item.slot?.start || "",
      end: item.slot?.end || "",
      status: item.status,
    });
    setOpen(true);
  }

  // function handleClose() {
  //   setOpen(false);
  // }

  async function save() {
     try {
      setLoading(true);
    await backendApi.updateAppointment(item._id, {
      slot: {
        start: form.start,
        end: form.end,
      },
      status: form.status,
    });
    setOpen(false);
      setSnackbar({ open: true, message: 'Appointment updated successfully!', severity: 'success' });
      onUpdated();
  } catch (error) {
      setSnackbar({ open: true, message: 'Failed to update appointment', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  async function remove() {
    try {
      setLoading(true);
    if (!confirm("Delete this appointment?")) return;
    await backendApi.deleteAppointment(item._id);
    setConfirmDelete(false);
      setSnackbar({ open: true, message: 'Appointment deleted successfully!', severity: 'success' });
    onUpdated();
  } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete appointment', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1} justifyContent="center">
        <IconButton size="small" color="primary" onClick={handleOpen}>
          <EditIcon />
        </IconButton>
        <IconButton size="small" color="error"  onClick={() => setConfirmDelete(true)}>
          <DeleteIcon />
        </IconButton>
      </Stack>

      <Dialog open={open} onClose={() => !loading && setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle fontWeight={700}>
          Edit Appointment
          <Typography variant="body2" color="text.secondary">
            Update slot timing or appointment status
          </Typography>
        </DialogTitle>

        <Divider />

        <DialogContent>
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
              <CircularProgress />
            </Box>
          )}
          {!loading && (
            <Stack spacing={2} mt={2}>
              <TextField
                label="Slot Start"
                value={form.start}
                onChange={(e) => setForm({ ...form, start: e.target.value })}
              />
              <TextField
                label="Slot End"
                value={form.end}
                onChange={(e) => setForm({ ...form, end: e.target.value })}
              />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <MenuItem value="booked">Booked</MenuItem>
                  <MenuItem value="checked-in">Checked-in</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={save} variant="contained" disabled={loading} sx={{ borderRadius: 3 }}>
            {loading ? <CircularProgress size={20} /> : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      {/* Delete Confirmation */}
      <ConfirmDialog
        open={confirmDelete}
        title="Delete Appointment"
        message="Are you sure you want to delete this appointment? This action cannot be undone."
        onConfirm={remove}
        onCancel={() => setConfirmDelete(false)}
        loading={loading}
      />

      {/* Snackbar */}
      <CustomSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      />
    </>
  );
}
