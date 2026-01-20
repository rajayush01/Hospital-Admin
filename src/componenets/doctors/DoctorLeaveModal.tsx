import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { backendApi } from "../../api/backendApi";

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export default function DoctorLeaveModal({
  open,
  onClose,
  doctor,
  onSaved,
}: any) {
  const [leaveDays, setLeaveDays] = useState<string[]>([]);

  // 🔁 Sync state when doctor changes
  useEffect(() => {
    if (doctor?.leaveDays) {
      setLeaveDays(doctor.leaveDays);
    } else {
      setLeaveDays([]);
    }
  }, [doctor]);

  const toggleDay = (day: string) => {
    setLeaveDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day]
    );
  };

  const save = async () => {
    if (!doctor?._id) return;

    await backendApi.updateDoctorLeave(doctor._id, leaveDays);
    onSaved();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Manage Leave – Dr. {doctor?.name || ""}
      </DialogTitle>

      <DialogContent>
        <FormGroup>
          {DAYS.map((day) => (
            <FormControlLabel
              key={day}
              control={
                <Checkbox
                  checked={leaveDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
              }
              label={day.charAt(0).toUpperCase() + day.slice(1)}
            />
          ))}
        </FormGroup>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={save}
          disabled={!doctor}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
