"use client";

import React, { useEffect, useState } from "react";
import { getDonations, getAllCampaigns } from "@/services/stellar";
import { shortenAddress, formatXLM } from "@/lib/utils";
import { Trophy, Medal, User, Loader2 } from "lucide-react";

interface Donor {
  address: string;
  amount: number;
}

const Leaderboard = () => {
  const [topDonors, setTopDonors] = useState<Donor[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllDonations = async () => {
    try {
      // 1. Get all campaigns to find all IDs
      const campaignRes = await getAllCampaigns();
      let campaignIds = [0, 1, 2]; // Default hardcoded
      if (campaignRes.success && Array.isArray(campaignRes.data)) {
        const dynamicIds = (campaignRes.data as any[]).map(c => c.id);
        campaignIds = Array.from(new Set([...campaignIds, ...dynamicIds]));
      }

      const allDonations: Record<string, number> = {};

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
              
              const amount = Number(amt);
              allDonations[addr] = (allDonations[addr] || 0) + amount;
            });
          }
        })
      );

      const sortedDonors = Object.entries(allDonations)
        .map(([address, amount]) => ({ address, amount }))
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 5);

      setTopDonors(sortedDonors);
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDonations();
    const interval = setInterval(fetchAllDonations, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-[2rem] p-8 h-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-yellow-500/10 rounded-2xl">
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Top Supporters</h3>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Hall of Fame</p>
        </div>
      </div>

      {loading && topDonors.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
        </div>
      ) : topDonors.length > 0 ? (
        <div className="space-y-4">
          {topDonors.map((donor, index) => (
            <div 
              key={donor.address}
              className="group flex items-center justify-between p-4 bg-white/50 dark:bg-black/20 rounded-2xl border border-white/10 hover:border-blue-600/30 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${
                  index === 0 ? "bg-yellow-500 text-white" :
                  index === 1 ? "bg-zinc-300 text-zinc-600" :
                  index === 2 ? "bg-orange-400 text-white" :
                  "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                }`}>
                  {index < 3 ? <Medal className="w-5 h-5" /> : index + 1}
                </div>
                <div>
                  <p className="text-sm font-black text-zinc-900 dark:text-white">{shortenAddress(donor.address)}</p>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Donor</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-blue-600">{formatXLM(donor.amount)} XLM</p>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Total Contributed</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
          <p className="text-sm text-zinc-500 font-bold">No donors yet. Be the first!</p>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
