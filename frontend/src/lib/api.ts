export type Report = {
  report_id: number;
  location: string;
  crime_type: string;
  description: string;
  title: string;
  status: string;
  user_id: number;
  created_at?: string; 
};

export const api = {
  listReports: async (status: string): Promise<Report[]> => {
    const res = await fetch(`http://localhost:3001/api/reports?status=${status}`);
    return res.json();
  },
};

export const submitReport = async (data: {
  user_id: number;
  location_id: number;
  title: string;
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
  return res.json();
};
