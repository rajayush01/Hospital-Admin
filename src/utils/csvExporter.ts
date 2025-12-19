import type { Appointment } from "../types";

export function exportToCSV(data: Appointment[], filename: string) {
  const rows = [
    ["Patient", "Doctor", "Slot", "Guardian", "Phone", "Status", "Date"],
    ...data.map((a) => [
      a.patientId.name,
      a.doctorId.name,
      `${a.slot.start} - ${a.slot.end}`,
      a.patientId.guardianName,
      a.patientId.phone,
      a.status,
      a.date,
    ]),
  ];

  const csv = rows.map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
