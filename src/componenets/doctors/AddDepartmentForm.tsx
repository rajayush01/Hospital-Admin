import { useState } from "react";
import { backendApi } from "../../api/backendApi";
import { Button, Stack, TextField, Typography, CircularProgress } from "@mui/material";
import CustomSnackbar from "../CustomSnackbar";

export default function AddDepartmentForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  async function create() {
    if (!name.trim()) {
      setSnackbar({ open: true, message: 'Please enter a department name', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      await backendApi.createDepartment(name);
      setName("");
      setSnackbar({ open: true, message: 'Department created successfully!', severity: 'success' });
      onCreated();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to create department', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack spacing={2}>
        <Typography fontWeight={600}>Department Name</Typography>

        <TextField
          placeholder="e.g. Cardiology"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          disabled={loading}
        />

        <Button
          variant="contained"
          onClick={create}
          disabled={loading}
          sx={{
            alignSelf: "flex-start",
            px: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg,#2f6cff,#5a8cff)",
          }}
        >
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Add Department'}
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