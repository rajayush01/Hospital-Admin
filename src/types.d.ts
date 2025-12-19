export interface Appointment {
  _id: string;

  doctorId: {
    _id: string;
    name: string;
  };

  patientId: {
    _id: string;
    name: string;
    guardianName: string;
    phone: string;
  };

  slot: {
    start: string;
    end: string;
  };

  status: "booked" | "cancelled" | "checked-in";
  date: string;
}
