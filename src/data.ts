import { AdCampaign, AdCreativeAsset, AudienceSegment, PerformanceDay } from './types';

export const INITIAL_CAMPAIGNS: AdCampaign[] = [
  {
    id: 'camp-101',
    name: 'Summer SaaS Retargeting & Direct Sales',
    platform: 'Meta (FB/IG)',
    status: 'Active',
    objective: 'Conversions',
    dailyBudget: 250,
    totalSpent: 4850,
    impressions: 184200,
    clicks: 6240,
    ctr: 3.38,
    conversions: 312,
    cpc: 0.77,
    roas: 4.85,
    startDate: '2026-07-01',
    targetAudience: 'Tech Founders & Marketing Directors (US, CA, UK)',
    headlines: ['Scale Your Ad ROI by 4x', 'Stop Wasting Ad Spend Today', 'The Smarter Way to Run Campaigns'],
    adCopy: 'Unlock maximum return on ad spend with automated audience optimization and instant creative insights. Start your 14-day trial now!'
  },
  {
    id: 'camp-102',
    name: 'High-Intent Search Keyword Dominance',
    platform: 'Google Ads',
    status: 'Active',
    objective: 'Lead Generation',
    dailyBudget: 400,
    totalSpent: 9200,
    impressions: 95400,
    clicks: 8110,
    ctr: 8.50,
    conversions: 540,
    cpc: 1.13,
    roas: 3.90,
    startDate: '2026-06-15',
    targetAudience: 'Users searching "best ad campaign platform" & "b2b ad manager"',
    headlines: ['Top-Rated Ad Campaign Software', 'Manage Meta & Google Ads in 1 Hub', 'Boost Conversions Effortlessly'],
    adCopy: 'Drive qualified leads directly into your pipeline with high-converting search ad placements. Get a customized demo today.'
  },
  {
    id: 'camp-103',
    name: 'Gen-Z & Millennial Viral Discovery',
    platform: 'TikTok Ads',
    status: 'Active',
    objective: 'Brand Awareness',
    dailyBudget: 150,
    totalSpent: 2100,
    impressions: 340000,
    clicks: 9520,
    ctr: 2.80,
    conversions: 185,
    cpc: 0.22,
    roas: 2.75,
    startDate: '2026-07-10',
    targetAudience: 'Ages 18-34, Interested in E-commerce, Marketing, Productivity',
    headlines: ['Why Marketers Are Switching Fast', 'This Tool Changed Our Ad Strategy'],
    adCopy: 'See how top growth brands scale from 0 to 10k daily impressions without breaking the bank. Watch how it works!'
  },
  {
    id: 'camp-104',
    name: 'Enterprise Decision Maker Outreach',
    platform: 'LinkedIn Ads',
    status: 'Paused',
    objective: 'Lead Generation',
    dailyBudget: 300,
    totalSpent: 3600,
    impressions: 42000,
    clicks: 1260,
    ctr: 3.00,
    conversions: 78,
    cpc: 2.85,
    roas: 5.20,
    startDate: '2026-05-01',
    targetAudience: 'VP Marketing, CMOs, Growth Leads at companies 50-500 employees',
    headlines: ['B2B Ad Attribution Made Simple', 'Executive ROI Benchmark Report 2026'],
    adCopy: 'Download the 2026 B2B Performance Marketing Playbook. Proven strategies for hyper-scaling enterprise pipelines.'
  },
  {
    id: 'camp-105',
    name: 'Retargeting Website Visitors & Cart Abandoners',
    platform: 'Display Network',
    status: 'Scheduled',
    objective: 'Conversions',
    dailyBudget: 100,
    totalSpent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0.00,
    conversions: 0,
    cpc: 0.00,
    roas: 0.00,
    startDate: '2026-08-01',
    targetAudience: '30-day website visitors who visited pricing page',
    headlines: ['Come Back & Claim 20% Off', 'Your Campaign Draft is Waiting'],
    adCopy: 'Finish setting up your ad strategy. Lock in exclusive launch pricing before offer ends!'
  }
];

export const INITIAL_CREATIVES: AdCreativeAsset[] = [
  {
    id: 'asset-1',
    campaignId: 'camp-101',
    title: 'High-Contrast Dashboard Hero',
    headline: 'Scale Your Ad ROI by 4x',
    bodyText: 'Unlock maximum return on ad spend with automated audience optimization.',
    ctaText: 'Claim Free Trial',
    format: 'Single Image',
    status: 'Active',
    ctr: 3.65,
    conversions: 184
  },
  {
    id: 'asset-2',
    campaignId: 'camp-101',
    title: 'Feature Carousel - Multichannel Sync',
    headline: 'Meta + Google + TikTok in 1 View',
    bodyText: 'Stop switching tabs. Monitor and adjust all your ad spend in a unified dashboard.',
    ctaText: 'Learn More',
    format: 'Carousel',
    status: 'Active',
    ctr: 3.10,
    conversions: 128
  },
  {
    id: 'asset-3',
    campaignId: 'camp-102',
    title: 'Search Text Ad #1 - High Intent',
    headline: 'Top-Rated Ad Campaign Manager',
    bodyText: 'Automate bid optimization, track real-time ROAS, and eliminate wasted ad dollars.',
    ctaText: 'Request Demo',
    format: 'Search Text',
    status: 'Active',
    ctr: 8.85,
    conversions: 320
  }
];

export const INITIAL_AUDIENCES: AudienceSegment[] = [
  {
    id: 'aud-1',
    name: 'Growth Marketers & Founders (Tier 1)',
    location: 'United States, Canada, United Kingdom',
    ageRange: '25 - 54',
    interests: ['Digital Marketing', 'Paid Advertising', 'SaaS Growth', 'Shopify'],
    estimatedReach: 4800000,
    matchRate: '94%'
  },
  {
    id: 'aud-2',
    name: 'E-commerce Store Owners',
    location: 'Global (English Speaking)',
    ageRange: '21 - 48',
    interests: ['WooCommerce', 'Facebook Ads Manager', 'Social Media Ads'],
    estimatedReach: 8200000,
    matchRate: '88%'
  },
  {
    id: 'aud-3',
    name: 'B2B CMOs & Marketing Executives',
    location: 'North America',
    ageRange: '30 - 60',
    interests: ['HubSpot', 'Salesforce', 'Account-Based Marketing'],
    estimatedReach: 1250000,
    matchRate: '96%'
  }
];

export const PERFORMANCE_HISTORY: PerformanceDay[] = [
  { date: 'Jul 23', impressions: 48000, clicks: 1820, spend: 1150, conversions: 88, revenue: 4920 },
  { date: 'Jul 24', impressions: 52000, clicks: 2010, spend: 1220, conversions: 96, revenue: 5410 },
  { date: 'Jul 25', impressions: 51000, clicks: 1950, spend: 1180, conversions: 92, revenue: 5100 },
  { date: 'Jul 26', impressions: 58000, clicks: 2310, spend: 1350, conversions: 114, revenue: 6480 },
  { date: 'Jul 27', impressions: 61000, clicks: 2480, spend: 1400, conversions: 125, revenue: 7100 },
  { date: 'Jul 28', impressions: 64000, clicks: 2620, spend: 1480, conversions: 138, revenue: 7850 },
  { date: 'Jul 29', impressions: 68000, clicks: 2850, spend: 1550, conversions: 152, revenue: 8640 },
];
