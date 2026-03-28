export interface Company {
  id: number;
  name: string;
  industry: string;
  website: string;
  email: string;
  phone: string;
  address: string;
  employees_count: number;
  status: 'lead' | 'active' | 'inactive';
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  subject: string;
  template: string;
  status: 'draft' | 'scheduled' | 'sent';
  scheduled_date: string | null;
  created_at: string;
}

export interface CampaignRecipient {
  id: number;
  campaign: number;
  company: number;
  company_name: string;
  sent: boolean;
  sent_at: string | null;
}

export interface CampaignDetail extends Campaign {
  recipients: CampaignRecipient[];
}
