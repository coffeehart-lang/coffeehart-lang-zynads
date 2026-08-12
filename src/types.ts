export type AdPlatform = 'Meta (FB/IG)' | 'Google Ads' | 'TikTok Ads' | 'LinkedIn Ads' | 'Display Network';

export type CampaignStatus = 'Active' | 'Paused' | 'Scheduled' | 'Completed';

export type CampaignObjective = 'Conversions' | 'Lead Generation' | 'Brand Awareness' | 'Website Traffic' | 'App Installs';

export interface CampaignAudioSettings {
  gainLevel: number; // e.g. 1.25 (gain boost factor)
  sampleRate: number; // e.g. 48000 or 44100 Hz
  highPassCutoff?: number; // High-pass filter frequency in Hz (e.g. 85)
  presenceBoostDb?: number; // Vocal presence boost in dB (e.g. 3.5)
  deHarshGainDb?: number; // High-frequency anti-robotic cut in dB (e.g. -3.0)
  targetPeakDb?: number; // Normalized peak target (e.g. 0.95)
  noiseSuppression?: boolean; // Noise suppression state
  echoCancellation?: boolean; // Echo cancellation state
}

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
  audioSettings?: CampaignAudioSettings;
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
