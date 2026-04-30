"use client";

import React, { useState } from "react";
import { createCampaign } from "@/services/stellar";
import { useWallet } from "@/context/WalletProvider";
import { 
  Rocket, 
  Plus, 
  Target, 
  Type, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface CreateCampaignProps {
  onCreated?: () => void;
}

const CreateCampaign: React.FC<CreateCampaignProps> = ({ onCreated }) => {
  const { address, isConnected } = useWallet();
  const [title, setTitle] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setStatus({ type: "error", msg: "Please connect your wallet first" });
      return;
    }

    if (!title || !goal) {
      setStatus({ type: "error", msg: "Please fill all fields" });
      return;
    }

    const goalNum = parseFloat(goal);
    if (isNaN(goalNum) || goalNum <= 0) {
      setStatus({ type: "error", msg: "Enter a valid goal" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await createCampaign(address!, title, goalNum);
      if (res.success) {
        setStatus({ type: "success", msg: "Campaign launched successfully!" });
        setTitle("");
        setGoal("");
        if (onCreated) onCreated();
      } else {
        setStatus({ type: "error", msg: res.error || "Failed to create campaign" });
      }
    } catch (err: any) {
      setStatus({ type: "error", msg: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-[2.5rem] p-8 shadow-2xl shadow-blue-600/5">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
          <Rocket className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Launch Campaign</h2>
          <p className="text-sm text-zinc-500 font-medium tracking-tight">Start your journey on Stellar</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative group">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block ml-1">Campaign Title</label>
            <div className="relative">
              <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Save the Oceans..."
                className="w-full bg-white/50 dark:bg-black/20 border border-white/20 dark:border-zinc-800/50 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold"
                disabled={loading}
              />
            </div>
          </div>

          <div className="relative group">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-2 block ml-1">Funding Goal (XLM)</label>
            <div className="relative">
              <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 group-focus-within:text-blue-600 transition-colors" />
              <input
                type="number"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="Ex: 5000"
                className="w-full bg-white/50 dark:bg-black/20 border border-white/20 dark:border-zinc-800/50 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold"
                disabled={loading}
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !isConnected}
          className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-[1.5rem] font-black transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 text-lg"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              Launch on Mainnet
            </>
          )}
        </button>

        {status && (
          <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
            status.type === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
          }`}>
            {status.type === "success" ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {status.msg}
          </div>
        )}

        {!isConnected && (
          <p className="text-center text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            Please connect wallet to launch
          </p>
        )}
      </form>
    </div>
  );
};

export default CreateCampaign;
