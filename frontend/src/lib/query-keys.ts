export const queryKeys = {
  rooms: {
    all: ["rooms"] as const,
    detail: (id: number) => ["rooms", id] as const,
  },
  sessions: {
    all: ["sessions"] as const,
    detail: (id: number) => ["sessions", id] as const,
  },
  bookings: {
    all: ["bookings"] as const,
    mine: ["bookings", "mine"] as const,
  },
  users: {
    all: ["users"] as const,
    byRole: (role?: "admin" | "user") => ["users", role ?? "all"] as const,
  },
  settings: ["settings"] as const,
  databaseStats: ["database-stats"] as const,
  activities: ["admin-activity"] as const,
  reports: {
    summary: (month: string) => ["reports", "summary", month] as const,
  },
  availability: {
    all: ["availability"] as const,
    room: (roomId: number, date: string, sessionId: number) =>
      ["availability", roomId, date, sessionId] as const,
    daily: (roomId: number, date: string) =>
      ["availability", "daily", roomId, date] as const,
  },
};