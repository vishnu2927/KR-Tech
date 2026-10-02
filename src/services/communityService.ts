import { api } from './api';

export interface Author {
  userId?: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'mentor' | 'admin';
  badge?: string;
  isMentor?: boolean;
}

export interface CodeSnippet {
  language: string;
  code: string;
}

export interface PostItem {
  _id: string;
  title: string;
  content: string;
  category: 'general' | 'dsa' | 'certifications' | 'webdev' | 'tech' | 'ai' | 'mentor_qa' | 'announcement';
  author: Author;
  tags: string[];
  codeSnippet?: CodeSnippet;
  upvotes?: string[];
  upvotesCount: number;
  commentsCount: number;
  viewsCount: number;
  isPinned?: boolean;
  isResolved?: boolean;
  isAnnouncement?: boolean;
  company?: string;
  dsaDifficulty?: 'Easy' | 'Medium' | 'Hard' | '';
  createdAt: string;
}

export interface CommentItem {
  _id: string;
  post: string;
  author: Author;
  content: string;
  codeSnippet?: CodeSnippet;
  upvotes?: string[];
  upvotesCount: number;
  isAcceptedAnswer?: boolean;
  createdAt: string;
}

export interface RoomItem {
  _id?: string;
  roomId: string;
  name: string;
  description: string;
  category: 'batch' | 'dsa' | 'skills' | 'tech' | 'general';
  icon: string;
  memberCount: number;
  activeUsersCount: number;
  lastMessage?: {
    text: string;
    senderName: string;
    timestamp: string;
  };
}

export interface MessageItem {
  _id: string;
  room: string;
  sender: Author;
  content: string;
  codeSnippet?: CodeSnippet;
  attachments?: { type: string; url: string; name: string }[];
  reactions?: { emoji: string; count: number; users: string[] }[];
  createdAt: string;
}

export interface BadgeItem {
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  category: 'dsa' | 'community' | 'learning' | 'skills';
  xp: number;
  criteria?: string;
}

export interface StudentReputation {
  reputationPoints: number;
  rank: number;
  totalBadgesEarned: number;
  currentTier: string;
  nextTierXp: number;
  recentAchievements: { name: string; date: string; icon: string }[];
}

export interface LeaderboardItem {
  rank: number;
  name: string;
  email: string;
  xp: number;
  badgesCount: number;
  solutionsCount: number;
  avatar: string;
  tier: string;
}

export const communityService = {
  // Feed & Posts
  async getFeed(params?: {
    category?: string;
    tag?: string;
    search?: string;
    sort?: 'trending' | 'latest' | 'top';
    page?: number;
    limit?: number;
  }): Promise<{
    posts: PostItem[];
    total: number;
    trendingTags: { name: string; count: number }[];
    totalPages: number;
  }> {
    try {
      const res = await api.get('/community/feed', { params });
      return res.data;
    } catch {
      // Fallback
      return {
        posts: [],
        total: 0,
        trendingTags: [],
        totalPages: 1,
      };
    }
  },

  async createPost(postData: Partial<PostItem>): Promise<{ success: boolean; post: PostItem }> {
    const res = await api.post('/community/post', postData);
    return res.data;
  },

  async getPostById(id: string): Promise<{ post: PostItem; comments: CommentItem[] }> {
    const res = await api.get(`/community/post/${id}`);
    return res.data;
  },

  async addComment(commentData: {
    postId: string;
    content: string;
    codeSnippet?: CodeSnippet;
  }): Promise<{ comment: CommentItem; commentsCount: number }> {
    const res = await api.post('/community/comment', commentData);
    return res.data;
  },

  async toggleLike(postId: string, userEmail?: string): Promise<{ isLiked: boolean; upvotesCount: number }> {
    const res = await api.post(`/community/like/${postId}`, { userEmail });
    return res.data;
  },

  async toggleSavePost(postId: string, studentEmail?: string): Promise<{ saved: boolean; message: string }> {
    const res = await api.post(`/community/save/${postId}`, { studentEmail });
    return res.data;
  },

  async getSavedPosts(studentEmail?: string): Promise<{ posts: PostItem[] }> {
    const res = await api.get('/community/saved', { params: { studentEmail } });
    return res.data;
  },

  // Rooms & Chat
  async getRooms(): Promise<RoomItem[]> {
    try {
      const res = await api.get('/community/rooms');
      return res.data.rooms || [];
    } catch {
      return [];
    }
  },

  async getRoomMessages(roomId: string): Promise<MessageItem[]> {
    try {
      const res = await api.get(`/chat/rooms/${roomId}/messages`);
      return res.data.messages || [];
    } catch {
      return [];
    }
  },

  async sendMessage(data: {
    room: string;
    content: string;
    codeSnippet?: CodeSnippet;
  }): Promise<{ chatMessage: MessageItem }> {
    const res = await api.post('/chat/message', data);
    return res.data;
  },

  // Badges & Reputation
  async getBadges(): Promise<{
    badges: BadgeItem[];
    studentReputation: StudentReputation;
  }> {
    try {
      const res = await api.get('/community/badges');
      return res.data;
    } catch {
      return {
        badges: [],
        studentReputation: {
          reputationPoints: 2450,
          rank: 4,
          totalBadgesEarned: 6,
          currentTier: 'Gold Contributor',
          nextTierXp: 3000,
          recentAchievements: [],
        },
      };
    }
  },

  async getLeaderboard(): Promise<LeaderboardItem[]> {
    try {
      const res = await api.get('/community/leaderboard');
      return res.data.leaderboard || [];
    } catch {
      return [];
    }
  },
};
