'use client';

import { useMemo } from 'react';
import { useCompanies } from '@/hooks/useCompanies';
import { useCampaigns } from '@/hooks/useCampaigns';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: companies, isLoading: companiesLoading } = useCompanies();
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();

  const stats = useMemo(() => {
    if (!companies || !campaigns) return null;
    return {
      totalCompanies: companies.length,
      activeCompanies: companies.filter((c) => c.status === 'active').length,
      leads: companies.filter((c) => c.status === 'lead').length,
      inactive: companies.filter((c) => c.status === 'inactive').length,
      totalCampaigns: campaigns.length,
      draftCampaigns: campaigns.filter((c) => c.status === 'draft').length,
      sentCampaigns: campaigns.filter((c) => c.status === 'sent').length,
    };
  }, [companies, campaigns]);

  if (companiesLoading || campaignsLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-700 rounded animate-pulse w-48" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-700 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-gray-400 text-sm">Total Companies</p>
          <p className="text-3xl font-bold text-white mt-2">{stats?.totalCompanies}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-gray-400 text-sm">Active Companies</p>
          <p className="text-3xl font-bold text-green-400 mt-2">{stats?.activeCompanies}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-gray-400 text-sm">Leads</p>
          <p className="text-3xl font-bold text-yellow-400 mt-2">{stats?.leads}</p>
        </div>
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <p className="text-gray-400 text-sm">Campaigns</p>
          <p className="text-3xl font-bold text-blue-400 mt-2">{stats?.totalCampaigns}</p>
        </div>
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-6">
        {/* Recent Companies */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Recent Companies</h2>
            <Link href="/dashboard/companies" className="text-blue-400 text-sm hover:text-blue-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {companies?.slice(0, 5).map((company) => (
              <div key={company.id} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                <div>
                  <p className="text-white font-medium">{company.name}</p>
                  <p className="text-gray-500 text-sm">{company.industry}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs border ${
                  company.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  company.status === 'lead' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                  'bg-gray-500/20 text-gray-400 border-gray-500/30'
                }`}>
                  {company.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campaigns Overview */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Campaigns</h2>
            <Link href="/dashboard/campaigns" className="text-blue-400 text-sm hover:text-blue-300">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {campaigns?.map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                <div>
                  <p className="text-white font-medium">{campaign.name}</p>
                  <p className="text-gray-500 text-sm">{campaign.subject}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs border ${
                  campaign.status === 'sent' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                  campaign.status === 'draft' ? 'bg-gray-500/20 text-gray-400 border-gray-500/30' :
                  'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {campaign.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
