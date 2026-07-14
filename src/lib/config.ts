export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:4010",
  },
  site: {
    name: "lite.linux",
    url: import.meta.env.VITE_SITE_URL || "http://localhost:4012",
  },
};
