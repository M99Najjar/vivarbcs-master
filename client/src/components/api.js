import axios from "axios";

export const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_POINT,
});

const get = {
  faculties: async () => {
    return await api.get("/api/faculties");
  },
  universities: async () => {
    return await api.get("/api/universities");
  },
  subjects: {
    by: async ({ faculty, year, season }) => {
      return await api.get(
        `/api/subjects/by?faculty_id=${faculty}&year=${year}&season=${season}`
      );
    },
    img: async ({ subject_id }) => {
      return await api.get(`/api/subjects/${subject_id}/pdf`);
    },
  },
  doctors: {
    by: async ({ subject }) => {
      return await api.get(`/api/doctors/by?subject_id=${subject}`);
    },
  },
};
