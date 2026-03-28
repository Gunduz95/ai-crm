'use client';

import { useState } from 'react';
import { useCampaigns, useCreateCampaign } from '@/hooks/useCampaigns';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import Link from 'next/link';


const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  scheduled: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  sent: 'bg-green-500/20 text-green-400 border-green-500/30',
};

interface CampaignForm {
  name: string;
  subject: string;
  template: string;
}

export default function CampaignsPage() {
  const { data: campaigns, isLoading, error } = useCampaigns();
  const createCampaign = useCreateCampaign();
  const [showForm, setShowForm] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CampaignForm>();

  const onSubmit = async (data: CampaignForm) => {
    try {
      await createCampaign.mutateAsync({ ...data, status: 'draft' });
      toast.success('Campaign created!');
      reset();
      setShowForm(false);
    } catch {
      toast.error('Failed to create campaign');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-700 rounded animate-pulse w-48" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-40 bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400">Failed to load campaigns. Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-400 text-sm mt-1">{campaigns?.length || 0} campaigns</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          {showForm ? 'Cancel' : '+ New Campaign'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Create Campaign</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Campaign Name</label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Spring Promo 2026"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Subject</label>
              <input
                {...register('subject', { required: 'Subject is required' })}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g. Special offer for {company_name}"
              />
              {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Template</label>
              <textarea
                {...register('template', { required: 'Template is required' })}
                rows={5}
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hello {company_name}, ..."
              />
              {errors.template && <p className="text-red-400 text-sm mt-1">{errors.template.message}</p>}
            </div>
            <button
              type="submit"
              disabled={createCampaign.isPending}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition-colors"
            >
              {createCampaign.isPending ? 'Creating...' : 'Create Campaign'}
            </button>
          </form>
        </div>
      )}

      <div className="grid gap-4">
        {campaigns?.map((campaign) => (
          <Link href={`/dashboard/campaigns/${campaign.id}`} key={campaign.id} className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-gray-600 transition-colors block">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-white">{campaign.name}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[campaign.status]}`}>
                {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-2">Subject: {campaign.subject}</p>
            <p className="text-gray-500 text-sm">Created: {new Date(campaign.created_at).toLocaleDateString()}</p>
          </Link>
        ))}
      </div>

      {campaigns?.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No campaigns yet. Create your first one!</p>
        </div>
      )}
    </div>
  );
}
