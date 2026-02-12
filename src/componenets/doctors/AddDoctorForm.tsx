import { useState, useEffect, useRef } from "react";
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
  IconButton,
  Avatar,
  InputAdornment,
} from "@mui/material";
import CustomSnackbar from "../CustomSnackbar";
import { LuDelete } from "react-icons/lu";
import { GiPhotoCamera } from "react-icons/gi";
import CurrencyRupeeIcon from '@mui/icons-material/CurrencyRupee';

export default function AddDoctorForm({
  onCreated,
  departments: propDepartments, // ✅ Add this prop
}: {
  onCreated: () => void;
  departments?: any[]; // ✅ Add this
}) {
  const [name, setName] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [consultationFee, setConsultationFee] = useState("");
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' as 'success' | 'error' 
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // ✅ Use prop departments if available, otherwise fetch
    if (propDepartments) {
      setDepartments(propDepartments);
    } else {
      backendApi.getDepartments().then(setDepartments);
    }
  }, [propDepartments]); // ✅ Add dependency

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setSnackbar({ 
        open: true, 
        message: "Please select an image file", 
        severity: "error" 
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ 
        open: true, 
        message: "Image size should be less than 5MB", 
        severity: "error" 
      });
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setConsultationFee(value);
    }
  };

  async function create() {
    if (!name || !departmentId || !consultationFee) {
      setSnackbar({ 
        open: true, 
        message: 'Please fill all required fields', 
        severity: 'error' 
      });
      return;
    }

    const fee = parseFloat(consultationFee);
    if (isNaN(fee) || fee < 0) {
      setSnackbar({ 
        open: true, 
        message: 'Please enter a valid consultation fee', 
        severity: 'error' 
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("departmentId", departmentId);
      formData.append("consultationFee", fee.toString());
      
      if (image) {
        formData.append("image", image);
      }

      await backendApi.createDoctor(formData);

      setName("");
      setDepartmentId("");
      setConsultationFee("");
      setImage(null);
      setImagePreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setSnackbar({ 
        open: true, 
        message: 'Doctor added successfully!', 
        severity: 'success' 
      });
      onCreated();
    } catch (error) {
      setSnackbar({ 
        open: true, 
        message: 'Failed to add doctor', 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Stack spacing={2.5}>
        {/* Profile Image Upload */}
        <div>
          <Typography fontWeight={600} mb={1.5}>
            Profile Image (Optional)
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Avatar
              src={imagePreview || undefined}
              sx={{
                width: 80,
                height: 80,
                bgcolor: imagePreview ? "transparent" : "#e0e7ff",
                color: "#1e3a8a",
                fontSize: 32,
                fontWeight: 700,
                border: "3px solid #e3e8ef",
              }}
            >
              {!imagePreview && (name ? name.charAt(0).toUpperCase() : "?")}
            </Avatar>

            <Stack direction="row" spacing={1}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: "none" }}
                id="doctor-image-upload"
                disabled={loading}
              />
              <label htmlFor="doctor-image-upload">
                <Button
                  component="span"
                  variant="outlined"
                  startIcon={<GiPhotoCamera />}
                  disabled={loading}
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {imagePreview ? "Change" : "Upload"}
                </Button>
              </label>

              {imagePreview && (
                <IconButton
                  onClick={handleRemoveImage}
                  disabled={loading}
                  sx={{
                    color: "#f44336",
                    "&:hover": {
                      bgcolor: "#ffebee",
                    },
                  }}
                >
                  <LuDelete />
                </IconButton>
              )}
            </Stack>
          </Stack>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mt: 1 }}
          >
            Recommended: Square image, max 5MB
          </Typography>
        </div>

        <Typography fontWeight={600}>Doctor Name *</Typography>
        <TextField
          placeholder="Dr. John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          disabled={loading}
        />

        <Typography fontWeight={600}>Department *</Typography>
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

        <Typography fontWeight={600}>Consultation Fee *</Typography>
        <TextField
          placeholder="500"
          value={consultationFee}
          onChange={handleFeeChange}
          fullWidth
          disabled={loading}
          type="text"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <CurrencyRupeeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          helperText="Enter the consultation fee amount"
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