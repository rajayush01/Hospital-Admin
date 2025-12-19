import type { Appointment } from "../../types";
import AppointmentActions from "./AppointmentActions";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";

export default function AppointmentTable({
  data,
  loading,
  onUpdated,
}: {
  data: Appointment[];
  loading: boolean;
  onUpdated: () => void;
}) {
  if (loading) {
    return (
      <Typography sx={{ textAlign: "center", py: 4 }}>
        Loading appointments…
      </Typography>
    );
  }

  if (!data.length) {
    return (
      <Typography sx={{ textAlign: "center", py: 4 }}>
        No appointments found.
      </Typography>
    );
  }

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table>
        <TableHead>
          <TableRow sx={{ background: "#f4f7ff" }}>
            <TableCell><b>Doctor</b></TableCell>
            <TableCell><b>Date</b></TableCell>
            <TableCell><b>Slot</b></TableCell>
            <TableCell><b>Patient</b></TableCell>
            <TableCell><b>Guardian</b></TableCell>
            <TableCell><b>Phone</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            <TableCell align="center"><b>Actions</b></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((item, index) => (
            <TableRow
              key={item._id}
              sx={{
                backgroundColor: index % 2 === 0 ? "#fff" : "#fafbff",
              }}
            >
              <TableCell>Dr. {item.doctorId?.name ?? "-"}</TableCell>
              <TableCell>
                {item.date
                  ? dayjs(item.date).format("DD MMM YYYY")
                  : "-"}
              </TableCell>
              <TableCell>
                {item.slot
                  ? `${item.slot.start} - ${item.slot.end}`
                  : "-"}
              </TableCell>
              <TableCell>{item.patientId?.name ?? "-"}</TableCell>
              <TableCell>{item.patientId?.guardianName ?? "-"}</TableCell>
              <TableCell>{item.patientId?.phone ?? "-"}</TableCell>
              <TableCell sx={{ textTransform: "capitalize" }}>
                {item.status}
              </TableCell>
              <TableCell align="center">
                <AppointmentActions
                  item={item}
                  onUpdated={onUpdated}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
