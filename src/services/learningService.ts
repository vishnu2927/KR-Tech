import api from "./api";

// ── Portfolio Types ──
export interface PortfolioProject {
  title: string;
  description: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  thumbnail?: string;
}

export interface PortfolioData {
  _id?: string;
  headline: string;
  bio: string;
  skills: string[];
  projects: PortfolioProject[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
  };
}

// ── Leaderboard Types ──
export interface LeaderboardEntry {
  _id: string;
  name: string;
  avatar?: string;
  xp: number;
  rank: number;
  streak: number;
  domain?: string;
  badge?: string;
}

export interface LeaderboardResponse {
  entries: LeaderboardEntry[];
  totalParticipants: number;
  timeframe: string;
}

// ── Learning Service ──
export const learningService = {
  // Portfolio
  getMyPortfolio: async (): Promise<PortfolioData> => {
    const { data } = await api.get("/api/portfolio/me");
    return data.portfolio || data;
  },

  savePortfolio: async (portfolio: PortfolioData): Promise<PortfolioData> => {
    const { data } = await api.put("/api/portfolio", portfolio);
    return data.portfolio || data;
  },

  // Leaderboard
  getLeaderboard: async (params: {
    timeframe?: string;
    domain?: string;
  }): Promise<LeaderboardResponse> => {
    const { data } = await api.get("/api/leaderboard", { params });
    return data;
  },

  getMyRank: async (): Promise<LeaderboardEntry> => {
    const { data } = await api.get("/api/leaderboard/me");
    return data;
  },
};

export default learningService;
