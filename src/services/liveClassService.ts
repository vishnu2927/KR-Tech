import api from "./api";

// ─── Types ──────────────────────────────────────────────
export interface LiveSession {
  _id: string;
  title: string;
  description: string;
  course: {
    _id: string;
    title: string;
    slug?: string;
    thumbnail?: string;
    description?: string;
  } | string;
  mentor?: string;
  mentorName: string;
  scheduledAt: string;
  duration: number;
  platform: "zoom" | "google_meet" | "teams" | "custom";
  meetingLink: string;
  meetingId: string;
  meetingPassword: string;
  status: "scheduled" | "live" | "completed" | "cancelled";
  maxAttendees: number;
  topics: string[];
  tags: string[];
  thumbnail: string;
  attendeeCount: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
  attendance?: AttendanceRecord[];
  recordings?: SessionRecording[];
}

export interface AttendanceRecord {
  _id: string;
  session: LiveSession | string;
  student: {
    _id: string;
    name: string;
    email: string;
  } | string;
  joinedAt: string;
  leftAt: string | null;
  durationMinutes: number;
  status: "present" | "late" | "absent" | "excused";
  createdAt: string;
}

export interface SessionRecording {
  _id: string;
  session: LiveSession | string;
  title: string;
  description: string;
  course: {
    _id: string;
    title: string;
    slug?: string;
  } | string;
  recordingUrl: string;
  duration: number;
  fileSize: string;
  thumbnail: string;
  format: string;
  mentorNotes: string;
  attachments: { name: string; url: string; type: string }[];
  viewCount: number;
  isPublished: boolean;
  createdAt: string;
}

export interface CalendarEvent {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  startTime: string;
  endTime: string;
  course: {
    _id: string;
    title: string;
    slug?: string;
  } | string;
  liveSession?: {
    _id: string;
    status: string;
    platform: string;
    meetingLink: string;
    attendeeCount: number;
  };
  meetingLink: string;
  location: string;
  color: string;
  isRecurring: boolean;
  recurringPattern: string;
}

export interface LiveStats {
  totalSessions: number;
  scheduledSessions: number;
  liveSessions: number;
  completedSessions: number;
  cancelledSessions: number;
  totalRecordings: number;
  totalAttendance: number;
  avgAttendance: number;
  upcomingThisWeek: number;
}

export interface ScheduleSessionPayload {
  title: string;
  description?: string;
  courseId: string;
  mentorId?: string;
  mentorName?: string;
  scheduledAt: string;
  duration?: number;
  platform?: string;
  meetingLink?: string;
  meetingId?: string;
  meetingPassword?: string;
  maxAttendees?: number;
  topics?: string[];
  tags?: string[];
  thumbnail?: string;
  notes?: string;
}

// ─── API Functions ──────────────────────────────────────

// Schedule a new session (Admin)
export const scheduleSession = async (payload: ScheduleSessionPayload) => {
  const res = await api.post("/live/schedule", payload);
  return res.data;
};

// Get upcoming sessions
export const getUpcomingSessions = async (params?: {
  page?: number;
  limit?: number;
  courseId?: string;
  status?: string;
}) => {
  const res = await api.get("/live/upcoming", { params });
  return res.data;
};

// Get all sessions (Admin)
export const getAllSessions = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
  courseId?: string;
  search?: string;
}) => {
  const res = await api.get("/live/all", { params });
  return res.data;
};

// Get session details
export const getSessionById = async (id: string) => {
  const res = await api.get(`/live/session/${id}`);
  return res.data;
};

// Join a session
export const joinSession = async (sessionId: string) => {
  const res = await api.post("/live/join", { sessionId });
  return res.data;
};

// Leave a session
export const leaveSession = async (sessionId: string) => {
  const res = await api.post("/live/leave", { sessionId });
  return res.data;
};

// Get recordings
export const getRecordings = async (params?: {
  page?: number;
  limit?: number;
  courseId?: string;
  search?: string;
}) => {
  const res = await api.get("/live/recordings", { params });
  return res.data;
};

// Create recording (Admin)
export const createRecording = async (payload: {
  sessionId: string;
  title: string;
  recordingUrl: string;
  description?: string;
  courseId?: string;
  duration?: number;
  fileSize?: string;
  thumbnail?: string;
  format?: string;
  mentorNotes?: string;
  attachments?: { name: string; url: string; type: string }[];
}) => {
  const res = await api.post("/live/recordings", payload);
  return res.data;
};

// Update session (Admin)
export const updateSession = async (
  id: string,
  payload: Partial<ScheduleSessionPayload> & { status?: string }
) => {
  const res = await api.put(`/live/session/${id}`, payload);
  return res.data;
};

// Delete session (Admin)
export const deleteSession = async (id: string) => {
  const res = await api.delete(`/live/session/${id}`);
  return res.data;
};

// Calendar events
export const getCalendarEvents = async (params?: {
  month?: number;
  year?: number;
  courseId?: string;
}) => {
  const res = await api.get("/live/calendar", { params });
  return res.data;
};

// Download ICS file
export const downloadICS = async (sessionId: string) => {
  const res = await api.get(`/live/calendar/ics/${sessionId}`, {
    responseType: "blob",
  });
  const blob = new Blob([res.data], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `session_${sessionId}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// My attendance
export const getMyAttendance = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const res = await api.get("/live/my-attendance", { params });
  return res.data;
};

// Admin stats
export const getLiveStats = async () => {
  const res = await api.get("/live/stats");
  return res.data;
};
