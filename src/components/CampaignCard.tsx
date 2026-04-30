"use client";

import React, { useState } from "react";
import { donate } from "@/services/stellar";
import { useWallet } from "@/context/WalletProvider";
import { 
  Heart, 
  Target, 
  TrendingUp, 
  User as UserIcon, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface Campaign {
  id: number;
  owner: string;
  title: string;
  goal: bigint | number;
  raised: bigint | number;
}

interface CampaignCardProps {
  campaign: Campaign;
  onDonated?: () => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, onDonated }) => {
  const { address, isConnected } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Convert BigInt to Number for calculations
  const goal = Number(campaign.goal);
  const raised = Number(campaign.raised);
  const progress = Math.min(Math.round((raised / goal) * 100), 100);

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setStatus({ type: "error", msg: "Please connect your wallet first" });
      return;
    }

    const donationAmount = parseFloat(amount);
    if (isNaN(donationAmount) || donationAmount <= 0) {
      setStatus({ type: "error", msg: "Enter a valid amount" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await donate(address!, campaign.id, donationAmount);
      if (res.success) {
        setStatus({ type: "success", msg: "Donation successful! Tx: " + res.txHash?.slice(0, 8) + "..." });
        setAmount("");
        if (onDonated) onDonated();
      } else {
        setStatus({ type: "error", msg: res.error || "Donation failed" });
      }
    } catch (err: any) {
      setStatus({ type: "error", msg: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-[2rem] p-6 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 flex flex-col h-full">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-blue-600/10 rounded-2xl">
          <Heart className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform" />
        </div>
        <div className="px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
          ID #{campaign.id}
        </div>
      </div>

      <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2 leading-tight group-hover:text-blue-600 transition-colors">
        {campaign.title}
      </h3>

      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6 font-medium">
        <UserIcon className="w-3 h-3" />
        <span className="truncate max-w-[150px]">{campaign.owner}</span>
      </div>

      {/* Progress Section */}
      <div className="space-y-4 mb-8 flex-1">
        <div className="flex justify-between text-sm items-end">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Raised</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-zinc-900 dark:text-white">{raised}</span>
              <span className="text-[10px] font-bold text-zinc-500">XLM</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Goal</span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-lg font-bold text-zinc-700 dark:text-zinc-300">{goal}</span>
              <span className="text-[10px] font-bold text-zinc-500">XLM</span>
            </div>
          </div>
        </div>

        <div className="relative h-3 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
          <span className="text-blue-600">{progress}% Complete</span>
          <span className="text-zinc-400">{goal - raised > 0 ? `${goal - raised} to go` : "Fully Funded!"}</span>
        </div>
      </div>

      {/* Donation Form */}
      <form onSubmit={handleDonate} className="space-y-3 pt-6 border-t border-white/10">
        <div className="relative">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount to donate..."
            className="w-full bg-white/50 dark:bg-black/20 border border-white/20 dark:border-zinc-800/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold pr-12"
            disabled={loading}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400">XLM</span>
        </div>

        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-xl shadow-black/10"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <TrendingUp className="w-4 h-4" />
              Support Campaign
            </>
          )}
        </button>

        {status && (
          <div className={`p-3 rounded-xl flex items-center gap-2 text-[10px] font-bold animate-in fade-in slide-in-from-top-1 ${
            status.type === "success" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
          }`}>
            {status.type === "success" ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
            {status.msg}
          </div>
        )}
      </form>
    </div>
  );
};

export default CampaignCard;
