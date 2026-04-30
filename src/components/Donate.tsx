"use client";

import React, { useState } from "react";
import { donate } from "@/services/stellar";
import { useWallet } from "@/context/WalletProvider";
import { 
  TrendingUp, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Ban
} from "lucide-react";

interface DonateProps {
  campaignId: number;
  campaignTitle?: string;
  raised: number;
  goal: number;
  onSuccess?: () => void;
}

const Donate: React.FC<DonateProps> = ({ campaignId, campaignTitle, raised, goal, onSuccess }) => {
  const { address, isConnected } = useWallet();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string; hash?: string } | null>(null);

  const isCompleted = raised >= goal;
  const remaining = Math.max(0, goal - raised);

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

    if (donationAmount > remaining) {
      setStatus({ type: "error", msg: `Amount exceeds remaining goal (${remaining} XLM)` });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await donate(address!, campaignId, donationAmount);
      if (res.success) {
        const txHash = res.txHash || "";
        setStatus({ 
          type: "success", 
          msg: "Donation successful!", 
          hash: txHash 
        });
        
        // Save to local storage for transaction history
        const newTx = {
          id: Math.random().toString(36).substring(7),
          campaignId,
          campaignTitle: campaignTitle || `Campaign #${campaignId}`,
          amount: donationAmount,
          donor: address!,
          hash: txHash,
          timestamp: Date.now()
        };
        
        const existing = JSON.parse(localStorage.getItem("stellar_donations") || "[]");
        localStorage.setItem("stellar_donations", JSON.stringify([newTx, ...existing]));
        
        // Notify other components with a slight delay to allow blockchain sync
        setTimeout(() => {
          window.dispatchEvent(new Event("newDonation"));
          window.dispatchEvent(new Event("refreshCampaigns"));
        }, 2000);

        setAmount("");
        if (onSuccess) onSuccess();
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
    <div className="space-y-4 pt-6 border-t border-white/10 dark:border-zinc-800/50">
      {isCompleted ? (
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center justify-center gap-3">
          <Ban className="w-5 h-5 text-green-600" />
          <span className="text-sm font-black text-green-600 uppercase tracking-tight">Campaign Fully Funded!</span>
        </div>
      ) : (
        <form onSubmit={handleDonate} className="space-y-3">
          <div className="relative group">
            <input
              type="number"
              name={`donate-amount-${campaignId}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Max ${remaining} XLM...`}
              className="w-full bg-white/50 dark:bg-black/20 border border-white/20 dark:border-zinc-800/50 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all font-bold pr-12 group-hover:border-blue-600/30"
              disabled={loading}
              step="0.0000001"
              max={remaining}
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-zinc-400">XLM</span>
          </div>

          <button
            type="submit"
            disabled={loading || !isConnected}
            className="w-full py-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 shadow-xl shadow-black/10 group"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <TrendingUp className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                Donate Now
              </>
            )}
          </button>
        </form>
      )}

      {status && (
        <div className={`p-4 rounded-2xl border flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-300 ${
          status.type === "success" 
            ? "bg-green-500/5 border-green-500/20 text-green-600" 
            : "bg-red-500/5 border-red-500/20 text-red-600"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider">
              {status.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              {status.msg}
            </div>
            {status.hash && (
              <button 
                onClick={() => copyHash(status.hash!)}
                className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
                title="Copy Hash"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
              </button>
            )}
          </div>
          {status.hash && (
            <div className="flex items-center gap-2">
              <a 
                href={`https://stellar.expert/explorer/testnet/tx/${status.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] font-mono opacity-60 hover:opacity-100 transition-opacity break-all flex-1 underline underline-offset-2"
              >
                Tx: {status.hash.slice(0, 15)}...{status.hash.slice(-10)}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Donate;
