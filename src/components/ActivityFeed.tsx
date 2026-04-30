"use client";

import React, { useEffect, useState } from "react";
import { getDonations, getAllCampaigns } from "@/services/stellar";
import { shortenAddress, formatXLM } from "@/lib/utils";
import { Activity, ArrowUpRight, Loader2, Clock } from "lucide-react";

interface DonationActivity {
  address: string;
  amount: number;
  campaignId: number;
}

const ActivityFeed = () => {
  const [activities, setActivities] = useState<DonationActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      // 1. Get all campaigns to find all IDs
      const campaignRes = await getAllCampaigns();
      let campaignIds = [0, 1, 2]; // Default hardcoded
      if (campaignRes.success && Array.isArray(campaignRes.data)) {
        const dynamicIds = (campaignRes.data as any[]).map(c => c.id);
        campaignIds = Array.from(new Set([...campaignIds, ...dynamicIds]));
      }

      let allActivities: DonationActivity[] = [];

      await Promise.all(
        campaignIds.map(async (id) => {
          const res = await getDonations(id);
          if (res.success && res.data) {
            res.data.forEach((donation: any) => {
              let addr, amt;
              if (Array.isArray(donation)) {
                [addr, amt] = donation;
              } else {
                addr = donation.donor || donation.address;
                amt = donation.amount;
              }
              
              allActivities.push({
                address: addr,
                amount: Number(amt),
                campaignId: id
              });
            });
          }
        })
      );

      // Since we don't have timestamps, we just take the last few from each campaign
      // and show them. In a real app, we'd sort by block time.
      setActivities(allActivities.slice(-6).reverse());
    } catch (err) {
      console.error("Failed to fetch activity feed", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 5000); // Refresh every 5s as requested
    return () => clearInterval(interval);
  }, []);

  const getCampaignName = (id: number) => {
    const names: Record<number, string> = {
      0: "Open Source Fund",
      1: "Student Support",
      2: "Disaster Relief"
    };
    return names[id] || `Campaign #${id}`;
  };

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-[2rem] p-8 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-500/10 rounded-2xl">
          <Activity className="w-6 h-6 text-blue-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Recent Activity</h3>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Live Updates</p>
        </div>
      </div>

      {loading && activities.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : activities.length > 0 ? (
        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="relative pl-8 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-px before:bg-zinc-200 dark:before:bg-zinc-800 last:before:hidden">
              <div className="absolute left-[-4px] top-2 w-2 h-2 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-zinc-900 dark:text-white">{shortenAddress(activity.address)}</span>
                  <span className="text-xs text-zinc-500 font-medium">donated</span>
                  <span className="text-sm font-black text-green-600">{formatXLM(activity.amount)} XLM</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                  <ArrowUpRight className="w-3 h-3" />
                  <span>To {getCampaignName(activity.campaignId)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
          <p className="text-sm text-zinc-500 font-bold">Waiting for donations...</p>
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
