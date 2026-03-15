import apiClient from "./apiClient";

function mapAnnouncement(row) {
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    date: row.announce_date || row.date,
    priority: row.priority || "normal",
    createdAt: row.created_at ? new Date(row.created_at).getTime() : Date.now(),
  };
}

export async function getAnnouncements() {
  const response = await apiClient.get("/announcements");
  const rows = response.data?.data || [];
  return rows.map(mapAnnouncement);
}

export async function createAnnouncement(payload) {
  const response = await apiClient.post("/announcements", payload);
  return mapAnnouncement(response.data?.data || {});
}

export async function updateAnnouncement(announcementId, payload) {
  const response = await apiClient.put(`/announcements/${announcementId}`, payload);
  return mapAnnouncement(response.data?.data || {});
}

export async function removeAnnouncement(announcementId) {
  await apiClient.delete(`/announcements/${announcementId}`);
}
