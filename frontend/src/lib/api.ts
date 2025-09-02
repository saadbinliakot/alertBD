export type Report = {
  report_id: number;
  crime_type: string;
  description: string;
  timestamp: string;
  status: string;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
};

export const api = {
  listReports: async (status: string): Promise<Report[]> => {
    const res = await fetch(`http://localhost:3001/api/reports?status=${status}`);
    const data = await res.json();

    return data.map((r: any) => ({
      report_id: r.report_id,
      crime_type: r.crime_type,
      description: r.description,
      timestamp: r.timestamp,
      status: r.status,
      location: {
        name: r.location_name,
        latitude: Number(r.latitude),
        longitude: Number(r.longitude),
      },
    }));
  },
};

export const submitReport = async (data: {
  user_id: number;
  location_id: number;
  title?: string;
  description: string;
  crime_type_id: number;
}) => {
  const res = await fetch("http://localhost:3001/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getCrimeTypes = async (): Promise<{ crime_type_id: number; name: string }[]> => {
  const res = await fetch("http://localhost:3001/api/crime-types");
  return res.json();
};

export const listUserReports = async (userId: number): Promise<Report[]> => {
  const res = await fetch(`http://localhost:3001/api/reports?user_id=${userId}`);
  const data = await res.json();

  return data.map((r: any) => ({
    report_id: r.report_id,
    crime_type: r.crime_type,
    description: r.description,
    timestamp: r.timestamp,
    status: r.status,
    location: {
      name: r.location_name,
      latitude: Number(r.latitude),
      longitude: Number(r.longitude),
    },
  }));
};
