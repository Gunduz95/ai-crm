import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { CampaignDetail } from '@/types';

export function useCampaignDetail(id: string) {
  const [campaign, setCampaign] = useState<CampaignDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/campaigns/${id}/`);
      setCampaign(response.data);
    } catch (err) {
      setError('Failed to fetch campaign');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaign();
  }, [id]);

  const addRecipient = async (companyId: number) => {
    try {
      await api.post(`/campaigns/${id}/add_recipient/`, { company_id: companyId });
      await fetchCampaign();
      return { success: true };
    } catch (err) {
      const axiosError = err as { response?: { data?: { error?: string } } };
      const message = axiosError.response?.data?.error || 'Failed to add recipient';
      return { success: false, error: message };
    }
  };

  const sendCampaign = async () => {
    try {
      await api.post(`/campaigns/${id}/send_campaign/`);
      await fetchCampaign();
    } catch (err) {
      setError('Failed to send campaign');
    }
  };

  return { campaign, loading, error, addRecipient, sendCampaign };
}


