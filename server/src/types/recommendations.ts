export interface RecommendationPreference {
  tag: string;
  weight: number;
  updatedAt: string;
}

export interface RecommendationProfile {
  userId: number;
  preferences: RecommendationPreference[];
}
