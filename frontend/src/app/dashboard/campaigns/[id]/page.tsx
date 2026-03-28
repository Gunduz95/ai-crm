'use client';

import { useParams } from 'next/navigation';
import { useCampaignDetail } from '@/hooks/useCampaignDetail';
import { useCompanies } from '@/hooks/useCompanies';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { CampaignRecipient } from '@/types';


export default function CampaignDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { campaign, loading, error, addRecipient, sendCampaign } = useCampaignDetail(id);
  const { data: companies } = useCompanies();
  const [selectedCompany, setSelectedCompany] = useState('');

  const handleAddRecipient = async () => {
    if (!selectedCompany) return;
    const result = await addRecipient(Number(selectedCompany));
    if (result.success) {
      toast.success('Recipient added!');
    } else {
      toast.error(result.error || 'Failed to add recipient');
    }
    setSelectedCompany('');
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-700 rounded animate-pulse w-48" />
        <div className="h-32 bg-gray-700 rounded animate-pulse" />
        <div className="h-48 bg-gray-700 rounded animate-pulse" />
      </div>
    );
  }

  if (error || !campaign) {
    return <p className="text-red-400">{error || 'Campaign not found'}</p>;
  }

  return (
    <div className="space-y-6">
      {/* Campaign Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{campaign.name}</h1>
          <p className="text-gray-400 mt-1">Subject: {campaign.subject}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-sm ${
            campaign.status === 'sent' ? 'bg-green-500/20 text-green-400' :
            campaign.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' :
            'bg-yellow-500/20 text-yellow-400'
          }`}>
            {campaign.status}
          </span>
          {campaign.status === 'draft' && (
            <button
              onClick={async () => {
                await sendCampaign();
                toast.success('Campaign sent!');
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
            >
              Send Campaign
            </button>
          )}
        </div>
      </div>

      {/* Add Recipient */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add Company to Campaign</h2>
        <div className="flex gap-3">
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="flex-1 bg-gray-700 text-white border border-gray-600 rounded-lg px-4 py-2"
          >
            <option value="">Select a company...</option>
            {companies?.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddRecipient}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
          >
            Add
          </button>
        </div>
      </div>
      {/* Recipients List */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recipients ({campaign.recipients?.length || 0})
        </h2>
        {campaign.recipients?.length > 0 ? (
          <div className="space-y-2">
            {campaign.recipients.map((r: CampaignRecipient) => (
                
              <div key={r.id} className="flex items-center justify-between bg-gray-700 rounded-lg px-4 py-3">
                <span className="text-white">{r.company_name}</span>
                <span className={`text-sm ${r.sent ? 'text-green-400' : 'text-yellow-400'}`}>
                  {r.sent ? 'Sent' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No recipients yet. Add companies above.</p>
        )}
      </div>
    </div>
  );
}

