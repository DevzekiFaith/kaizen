export interface Rating {
  userId: string;
  userName: string;
  timestamp: number;
  inclusionRating: number;
  productivityRating: number;
  comment?: string;
}

export interface CommunityStats {
  averageInclusion: number;
  averageProductivity: number;
  totalRatings: number;
  lastUpdated: number;
}

export interface UserProfile {
  userId: string;
  displayName: string;
  photoURL?: string;
  bio?: string;
  joinedAt: number;
  lastActive: number;
  inclusionScore?: number;
  productivityScore?: number;
}