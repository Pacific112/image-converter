const fetchAuthParams = () => fetch("/api/uploads/auth-params");
const fetchDownloadUrl = (id: string) =>
  fetch(`/api/uploads/${id}/download-url`);

export const uploadsClient = { fetchAuthParams, fetchDownloadUrl };
