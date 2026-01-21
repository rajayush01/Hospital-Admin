import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  CircularProgress,
} from "@mui/material";
import dayjs from "dayjs";
import { backendApi } from "../api/backendApi";

export default function DoctorLeaves() {
  const [leaves, setLeaves] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadLeaves() {
    try {
      setLoading(true);
      const res = await backendApi.getAllDoctorLeaves();
      setLeaves(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to load doctor leaves", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLeaves();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" fontWeight={800} mb={3}>
        Doctor Leave History
      </Typography>

      <Paper elevation={3} sx={{ borderRadius: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : leaves.length === 0 ? (
          <Box p={4} textAlign="center">
            <Typography>No leave records found</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead sx={{ backgroundColor: "#f5f7fb" }}>
              <TableRow>
                <TableCell><b>Doctor</b></TableCell>
                <TableCell><b>Department</b></TableCell>
                <TableCell><b>From</b></TableCell>
                <TableCell><b>To</b></TableCell>
                <TableCell><b>Reason</b></TableCell>
                <TableCell><b>Applied On</b></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {leaves.map((l, i) => (
                <TableRow key={i} hover>
                  <TableCell>Dr. {l.doctorName}</TableCell>
                  <TableCell>{l.department}</TableCell>
                  <TableCell>
                    {dayjs(l.fromDate).format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>
                    {dayjs(l.toDate).format("DD MMM YYYY")}
                  </TableCell>
                  <TableCell>{l.reason || "—"}</TableCell>
                  <TableCell>
                    {dayjs(l.createdAt).format("DD MMM YYYY")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Box>
  );
}
