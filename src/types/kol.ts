export type Gender = 'MALE' | 'FEMALE';

export type SendStatus = 'PENDING' | 'SENT' | 'FAILED';

export type KOLLevel = 'NANO' | 'MICRO' | 'MID' | 'MACRO' | 'MEGA';

export type CollaborationType = 'LIVESTREAM' | 'SHORT_VIDEO' | 'POST';

export interface KOLBasicInfo {
  id: string;
  name: string;
  email: string;
  bio?: string;
  gender: Gender;
  language: string;
  location: string;
  source: string;
  tags?: string[];
  accountLink: string;
  creatorId: string;
}

export interface KOLMetrics {
  followersK: number;
  likesK: number;
  meanViewsK: number;
  medianViewsK: number;
  engagementRate: number;
  averageViewsK: number;
  averageLikesK: number;
  averageCommentsK: number;
}

export interface KOLOperationalData {
  sendStatus: SendStatus;
  sendDate?: Date;
  exportDate?: Date;
  level: KOLLevel;
  keywordsAI?: string[];
  mostUsedHashtags?: string[];
}

export interface CollaborationRecord {
  id: string;
  brand: string;
  type: CollaborationType;
  date: Date;
  cost: number;
  performance: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    roi?: number;
  };
  notes?: string;
}

export interface KOL extends KOLBasicInfo {
  metrics: KOLMetrics;
  operational: KOLOperationalData;
  collaborations: CollaborationRecord[];
}