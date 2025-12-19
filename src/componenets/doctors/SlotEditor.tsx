import { useState } from "react";
import {
  Button,
  Stack,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs, { Dayjs } from "dayjs";
import CustomSnackbar from "../CustomSnackbar";

export default function SlotEditor({
  slots,
  onChange,
}: {
  slots: any[];
  onChange: (updated: any[]) => void;
}) {
  const safeSlots = Array.isArray(slots) ? slots : [];

  const [open, setOpen] = useState(false);
  const [start, setStart] = useState<Dayjs | null>(dayjs());
  const [end, setEnd] = useState<Dayjs | null>(dayjs());
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' as 'success' | 'error' });

  function addSlot() {
    if (!start || !end) {
      setSnackbar({ open: true, message: 'Please select both start & end times', severity: 'error' });
      return;
    }
    
    if (start.isAfter(end)) {
      setSnackbar({ open: true, message: 'Start time must be earlier than end time', severity: 'error' });
      return;
    }

    onChange([
      ...safeSlots,
      { start: start.format("HH:mm"), end: end.format("HH:mm") },
    ]);

    setOpen(false);
    setStart(dayjs());
    setEnd(dayjs());
  }

  function deleteSlot(index: number) {
    onChange(safeSlots.filter((_, i) => i !== index));
  }

  return (
    <>
      <Stack spacing={1.5}>
        {safeSlots.map((slot, i) => (
          <Box
            key={i}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            px={2}
            py={1}
            borderRadius={3}
            sx={{ background: "#f4f7ff" }}
          >
            <Typography fontWeight={600}>
              {slot.start} — {slot.end}
            </Typography>
            <IconButton onClick={() => deleteSlot(i)} size="small">
              <DeleteIcon color="error" />
            </IconButton>
          </Box>
        ))}

        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{ borderRadius: 3 }}
        >
          + Add Slot
        </Button>
      </Stack>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle fontWeight={700}>Add Time Slot</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TimePicker label="Start Time" value={start} onChange={setStart} />
            <TimePicker label="End Time" value={end} onChange={setEnd} />

            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                onClick={() => setOpen(false)}
                sx={{ flex: 1, borderRadius: 3 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={addSlot}
                sx={{
                  flex: 1,
                  borderRadius: 3,
                  background: "linear-gradient(135deg,#2f6cff,#5a8cff)",
                }}
              >
                Add Slot
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
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