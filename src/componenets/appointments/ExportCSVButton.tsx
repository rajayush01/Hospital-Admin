import type { Appointment } from "../../types";
import { exportToCSV } from "../../utils/csvExporter";
import { Button } from "@mui/material";

export default function ExportCSVButton({ data }: { data: Appointment[] }) {
  return (
    <Button
      variant="contained"
      onClick={() => exportToCSV(data, "appointments.csv")}
      sx={{
        borderRadius: 3,
        px: 3,
        background: "linear-gradient(135deg,#2f6cff,#5a8cff)",
      }}
    >
      Export CSV
    </Button>
  );
}
