const ADMIN_URL = import.meta.env.VITE_ADMIN_API_URL;
const PUBLIC_URL = import.meta.env.VITE_PUBLIC_API_URL;

// Generic Request Wrapper
async function request(url: string, options: RequestInit = {}) {
  if (!url) throw new Error("❌ API URL is undefined. Check .env");
if (options.body instanceof FormData) {
    if (options.headers) {
      delete (options.headers as any)["Content-Type"];
    }
  }
  const res = await fetch(url, options);

  if (!res.ok) {
    const msg = await res.text().catch(() => "Unknown error");
    throw new Error(msg);
  }

  try {
    return await res.json();
  } catch {
    return {};
  }
}

export const backendApi = {

  // ================================
  // DEPARTMENTS (ADMIN)
  // ================================
  getDepartments() {
    return request(`${ADMIN_URL}/departments`);
  },

  createDepartment(name: string) {
    return request(`${ADMIN_URL}/departments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
  },

  // ================================
  // DOCTORS (ADMIN)
  // ================================
  getDoctors() {
    return request(`${ADMIN_URL}/doctors`);
  },

  createDoctor(payload: FormData) {
    return request(`${ADMIN_URL}/doctors`, {
      method: "POST",
      body: payload,
    });
  },

  updateDoctor(id: string, payload: FormData) {
  return request(`${ADMIN_URL}/doctors/${id}`, {
    method: "PUT",
    body: payload,
  });
},


updateDoctorSchedule(id: string, schedule: any) {
  return request(`${ADMIN_URL}/doctors/${id}/schedule`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schedule),
  });
}
,

updateDoctorLeave(id: string, leaveDays: string[]) {
  return request(`${ADMIN_URL}/doctors/${id}/leave`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leaveDays }),
  });
},


  // ================================
  // PATIENTS (ADMIN)
  // ================================
  getPatients() {
    return request(`${ADMIN_URL}/patients`);
  },

  createPatient(payload: any) {
    return request(`${ADMIN_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  // ================================
  // APPOINTMENTS (ADMIN)
  // ================================
  getAppointments() {
    return request(`${ADMIN_URL}/appointments`);
  },

  updateAppointment(id: string, payload: any) {
    return request(`${ADMIN_URL}/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },

  deleteAppointment(id: string) {
    return request(`${ADMIN_URL}/appointments/${id}`, {
      method: "DELETE",
    });
  },

  // ================================
  // PUBLIC BOOKING (FOR USERS)
  // ================================
  getPublicDepartments() {
    return request(`${PUBLIC_URL}/departments`);
  },

  getDoctorsByDepartment(departmentId: string) {
    // NEW ROUTE
    return request(`${PUBLIC_URL}/departments/${departmentId}/doctors`);
  },

  getDepartmentsWithDoctors() {
  return request(`${ADMIN_URL}/departments-with-doctors`);
}
,

 getDoctorSlots(doctorId: string, date: string) {
  return request(
    `${PUBLIC_URL}/slots?doctorId=${doctorId}&date=${encodeURIComponent(date)}`
  );
},

  bookAppointment(payload: any) {
    // NEW ROUTE
    return request(`${PUBLIC_URL}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  },
};
