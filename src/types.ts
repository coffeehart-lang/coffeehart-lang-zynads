export type AdPlatform = 'Meta (FB/IG)' | 'Google Ads' | 'TikTok Ads' | 'LinkedIn Ads' | 'Display Network';

export type CampaignStatus = 'Active' | 'Paused' | 'Scheduled' | 'Completed';

export type CampaignObjective = 'Conversions' | 'Lead Generation' | 'Brand Awareness' | 'Website Traffic' | 'App Installs';

export interface AdCampaign {
  id: string;
  name: string;
  platform: AdPlatform;
  status: CampaignStatus;
  objective: CampaignObjective;
  dailyBudget: number;
  totalSpent: number;
  impressions: number;
  clicks: number;
  ctr: number; // e.g. 2.85 (%)
  conversions: number;
  cpc: number; // Cost Per Click ($)
  roas: number; // Return on Ad Spend (e.g. 4.2x)
  startDate: string;
  targetAudience: string;
  headlines: string[];
  adCopy: string;
}

export interface AdCreativeAsset {
  id: string;
  campaignId: string;
  title: string;
  headline: string;
  bodyText: string;
  ctaText: string;
  format: 'Single Image' | 'Carousel' | 'Short Video' | 'Search Text';
  status: 'Active' | 'Draft' | 'Archived';
  ctr: number;
  conversions: number;
}

export interface AudienceSegment {
  id: string;
  name: string;
  location: string;
  ageRange: string;
  interests: string[];
  estimatedReach: number;
  matchRate: string;
}

export interface PerformanceDay {
  date: string;
  impressions: number;
  clicks: number;
  spend: number;
  conversions: number;
  revenue: number;
}
