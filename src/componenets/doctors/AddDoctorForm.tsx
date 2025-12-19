import { useState, useEffect } from "react";
import { backendApi } from "../../api/backendApi";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import CustomSnackbar from "../CustomSnackbar";

export default function AddDoctorForm({
  onCreated,
}: {
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    backendApi.getDepartments().then(setDepartments);
  }, []);

  async function create() {
    if (!name || !departmentId) {
      setSnackbar({ open: true, message: 'Please fill all fields', severity: 'error' });
      return;
    }

    try {
      setLoading(true);
      await backendApi.createDoctor({
        name,
        departmentId,
        schedule: {
          monday: [],
          tuesday: [],
          wednesday: [],
          thursday: [],
          friday: [],
          saturday: [],
          sunday: [],
        },
      });

      setName("");
      setDepartmentId("");
      setSnackbar({ open: true, message: 'Doctor added successfully!', severity: 'success' });
      onCreated();
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to add doctor', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack spacing={2}>
        <Typography fontWeight={600}>Doctor Name</Typography>
        <TextField
          placeholder="Dr. John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          disabled={loading}
        />

        <Typography fontWeight={600}>Department</Typography>
        <FormControl fullWidth>
          <Select
            value={departmentId}
            displayEmpty
            onChange={(e) => setDepartmentId(e.target.value)}
            disabled={loading}
          >
            <MenuItem value="" disabled>
              Select department
            </MenuItem>
            {departments.map((d) => (
              <MenuItem key={d._id} value={d._id}>
                {d.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          {loading ? <CircularProgress size={20} color="inherit" /> : 'Add Doctor'}
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