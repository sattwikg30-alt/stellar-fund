"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletProvider";
import { shortenAddress, formatXLM } from "@/lib/utils";
import Donate from "./Donate";
import { 
  Heart, 
  Target, 
  TrendingUp, 
  User as UserIcon, 
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
  const { isConnected } = useWallet();
  const [optimisticRaised, setOptimisticRaised] = useState<number | null>(null);

  // Convert BigInt/String to Number for calculations
  const goal = Number(campaign.goal || 0);
  const rawRaised = campaign.raised !== undefined ? campaign.raised : (campaign as any).total;
  const baseRaised = Number(rawRaised || 0);
  
  // Use optimistic value if available, otherwise use base
  const raised = optimisticRaised !== null ? optimisticRaised : baseRaised;
  const progress = goal > 0 ? Math.min(Math.round((raised / goal) * 100), 100) : 0;

  // Reset optimistic raised when the campaign prop updates from the blockchain
  React.useEffect(() => {
    setOptimisticRaised(null);
  }, [campaign.raised, (campaign as any).total]);

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
        <span className="truncate max-w-[150px]">{shortenAddress(campaign.owner)}</span>
      </div>

      {/* Progress Section */}
      <div className="space-y-4 mb-8 flex-1">
        <div className="flex justify-between text-sm items-end">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Raised</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-zinc-900 dark:text-white">{formatXLM(raised)}</span>
              <span className="text-[10px] font-bold text-zinc-500">XLM</span>
            </div>
          </div>
          <div className="text-right space-y-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-zinc-400">Goal</span>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-lg font-bold text-zinc-700 dark:text-zinc-300">{formatXLM(goal)}</span>
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
          <span className="text-zinc-400">{goal - raised > 0 ? `${formatXLM(goal - raised)} to go` : "Fully Funded!"}</span>
        </div>
      </div>

      {/* Donation Section */}
      <Donate 
        campaignId={campaign.id} 
        campaignTitle={campaign.title} 
        raised={raised}
        goal={goal}
        onSuccess={() => {
          setOptimisticRaised(raised + Number((document.querySelector(`input[name="donate-amount-${campaign.id}"]`) as HTMLInputElement)?.value || 0));
          if (onDonated) onDonated();
        }} 
      />
    </div>
  );
};

export default CampaignCard;
