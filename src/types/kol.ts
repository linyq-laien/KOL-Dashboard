export type Gender = 'MALE' | 'FEMALE' | 'LGBT';

export type SendStatus = 
  | 'Round No.1' 
  | 'Round No.2'
  | 'Round No.3'
  | 'Round No.4'
  | 'Round No.5'
  | 'Round No.6'
  | 'Round No.7'
  | 'Round No.8'
  | 'Round No.9'
  | 'Round No.10'
  | 'Round No.11'
  | 'Round No.12'
  | 'Round No.13'
  | 'Round No.14'
  | 'Round No.15'
  | 'Round No.16'
  | 'Round No.17'
  | 'Round No.18'
  | 'Round No.19'
  | 'Round No.20';

export type KOLLevel = 'Mid 50k-500k' | 'Micro 10k-50k' | 'Nano 1-10k';

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