import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { backendApi } from "../../api/backendApi";

export default function DoctorLeaveModal({
  open,
  onClose,
  doctor,
  onSaved,
}: any) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  // 🔁 Reset when modal opens/closes
  useEffect(() => {
    if (open) {
      setFromDate("");
      setToDate("");
      setReason("");
    }
  }, [open]);

  const save = async () => {
    if (!doctor?._id || !fromDate || !toDate) return;

    await backendApi.addDoctorLeave(doctor._id, {
      fromDate,
      toDate,
      reason,
    });

    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Add Leave – Dr. {doctor?.name || ""}
      </DialogTitle>

      <DialogContent sx={{ display: "flex", gap: 2, mt: 1 }}>
        <TextField
          type="date"
          label="From Date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />

        <TextField
          type="date"
          label="To Date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
        />

        <TextField
          label="Reason (optional)"
          fullWidth
          multiline
          minRows={2}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={save}
          disabled={!fromDate || !toDate}
        >
          Save Leave
        </Button>
      </DialogActions>
    </Dialog>
  );
}
