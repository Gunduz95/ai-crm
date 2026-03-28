'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { useCompanies, useDeleteCompany } from '@/hooks/useCompanies';
import { useDebounce } from '@/hooks/useDebounce';
import { Company } from '@/types';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  lead: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function CompaniesPage() {
  const { data: companies, isLoading, error } = useCompanies();
  const deleteCompany = useDeleteCompany();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const searchRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(search, 300);
  // Keyboard shortcut: Cmd+K focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get unique industries for filter dropdown
  const industries = useMemo(() => {
    if (!companies) return [];
    const unique = [...new Set(companies.map((c) => c.industry).filter(Boolean))];
    return unique.sort();
  }, [companies]);

  const filteredCompanies = useMemo(() => {
    if (!companies) return [];
    return companies.filter((company) => {
      const matchesSearch =
        company.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        company.email.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
      const matchesIndustry = industryFilter === 'all' || company.industry === industryFilter;
      return matchesSearch && matchesStatus && matchesIndustry;
    });
  }, [companies, debouncedSearch, statusFilter, industryFilter]);

  // Delete handler
  const handleDelete = useCallback(
    (company: Company) => {
      if (confirm(`Delete ${company.name}?`)) {
        deleteCompany.mutate(company.id, {
          onSuccess: () => toast.success(`${company.name} deleted`),
          onError: () => toast.error('Failed to delete company'),
        });
      }
    },
    [deleteCompany]
  );
    // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-700 rounded animate-pulse w-48" />
        <div className="h-12 bg-gray-700 rounded animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-400">Failed to load companies. Make sure the backend is running.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Companies</h1>
          <p className="text-gray-400 text-sm mt-1">
            {filteredCompanies.length} of {companies?.length || 0} companies
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <input
            ref={searchRef}
            type="text"
            placeholder="Search companies... (Cmd+K)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-3 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="lead">Lead</option>
          <option value="inactive">Inactive</option>
        </select>

        <select value={industryFilter} onChange={(e) => setIndustryFilter(e.target.value)} className="px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="all">All Industries</option>
          {industries.map((industry) => (
            <option key={industry} value={industry}>{industry}</option>
          ))}
        </select>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Company</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Industry</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Employees</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">Status</th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCompanies.map((company) => (
              <tr key={company.id} className="border-b border-gray-700/50 hover:bg-white/5 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white font-medium">{company.name}</p>
                  {company.website && <p className="text-gray-500 text-sm">{company.website}</p>}
                </td>
                <td className="px-6 py-4 text-gray-300">{company.industry}</td>
                <td className="px-6 py-4 text-gray-300">{company.email}</td>
                <td className="px-6 py-4 text-gray-300">{company.employees_count.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[company.status]}`}>
                    {company.status.charAt(0).toUpperCase() + company.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(company)} className="text-gray-500 hover:text-red-400 transition-colors text-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredCompanies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No companies found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

