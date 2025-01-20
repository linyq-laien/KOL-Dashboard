export type Gender = 'MALE' | 'FEMALE';

export type SendStatus = 'SENT' | 'PENDING' | 'FAILED';

export type KOLLevel = 'MEGA' | 'MACRO' | 'MID' | 'MICRO' | 'NANO';

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
  level: KOLLevel;
  sendStatus: SendStatus;
  sendDate?: Date;
  exportDate?: Date;
  keywordsAI?: string[];
  mostUsedHashtags?: string[];
}

export interface CollaborationRecord {
  id: string;
  date: Date;
  type: string;
  status: string;
  notes?: string;
}

export interface KOL {
  id: string;
  kolId: string;
  name: string;
  email: string;
  gender: Gender;
  bio: string;
  language: string;
  location: string;
  source: string;
  filter: string;
  tag: string;
  accountLink: string;
  slug: string;
  creatorId: string;
  metrics: KOLMetrics;
  operational: KOLOperationalData;
  collaborations: CollaborationRecord[];
}