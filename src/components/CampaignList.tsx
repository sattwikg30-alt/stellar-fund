"use client";

import React, { useEffect, useState } from "react";
import { getAllCampaigns } from "@/services/stellar";
import CampaignCard from "./CampaignCard";
import { 
  Loader2, 
  RefreshCcw, 
  Search, 
  LayoutGrid, 
  AlertCircle 
} from "lucide-react";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllCampaigns();
      if (res.success) {
        setCampaigns(res.data || []);
      } else {
        setError(res.error || "Failed to load campaigns");
      }
    } catch (err) {
      setError("An error occurred while fetching campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, [refreshKey]);

  useEffect(() => {
    const handleRefresh = () => setRefreshKey(k => k + 1);
    window.addEventListener("refreshCampaigns", handleRefresh);
    return () => window.removeEventListener("refreshCampaigns", handleRefresh);
  }, []);

  return (
    <div className="space-y-8">
      {/* List Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
            <LayoutGrid className="w-8 h-8 text-blue-600" />
            Explore Projects
          </h2>
          <p className="text-zinc-500 font-medium tracking-tight mt-1">Discover and support groundbreaking ideas on Stellar</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/50 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold min-w-[280px]"
            />
          </div>
          <button 
            onClick={() => setRefreshKey(k => k + 1)}
            disabled={loading}
            className="p-3 bg-white/40 dark:bg-zinc-900/40 border border-white/20 dark:border-zinc-800/50 rounded-2xl hover:bg-white/60 transition-all disabled:opacity-50"
            title="Refresh"
          >
            <RefreshCcw className={`w-5 h-5 text-zinc-600 dark:text-zinc-300 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-lg animate-pulse shadow-lg shadow-blue-600/40" />
            </div>
          </div>
          <p className="text-sm font-black text-zinc-400 uppercase tracking-widest animate-pulse">Scanning Blockchain...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 bg-red-500/5 border border-red-500/10 rounded-[3rem] text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Sync Error</h3>
          <p className="text-sm text-zinc-500 max-w-sm mb-6">{error}</p>
          <button 
            onClick={() => fetchCampaigns()}
            className="px-8 py-3 bg-red-500 text-white rounded-2xl font-black shadow-lg shadow-red-500/20 hover:scale-105 transition-transform"
          >
            Retry Sync
          </button>
        </div>
      ) : Array.isArray(campaigns) && campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
          {campaigns.map((campaign, idx) => (
            <CampaignCard 
              key={campaign.id || idx} 
              campaign={campaign} 
              onDonated={() => setRefreshKey(k => k + 1)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800/50 rounded-[3rem] text-center w-full">
          <div className="w-20 h-20 bg-zinc-200/50 dark:bg-zinc-800/50 rounded-[2rem] flex items-center justify-center mb-6 mx-auto">
            <LayoutGrid className="w-10 h-10 text-zinc-400" />
          </div>
          <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">No Campaigns Found</h3>
          <p className="text-sm text-zinc-500 max-w-xs mb-8 mx-auto">Be the first one to start a movement on StellarFund!</p>
        </div>
      )}
    </div>
  );
};

export default CampaignList;
