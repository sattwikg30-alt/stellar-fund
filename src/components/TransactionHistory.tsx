"use client";

import React, { useEffect, useState } from "react";
import { shortenAddress, formatXLM } from "@/lib/utils";
import { History, ExternalLink, Receipt, Clock, Copy, Check } from "lucide-react";

interface Transaction {
  id: string;
  campaignId: number;
  campaignTitle?: string;
  amount: number;
  donor: string;
  hash: string;
  timestamp: number;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyHash = (hash: string, txId: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedId(txId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  useEffect(() => {
    const loadTransactions = () => {
      const stored = localStorage.getItem("stellar_donations");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setTransactions(parsed.sort((a: any, b: any) => b.timestamp - a.timestamp));
        } catch (e) {
          console.error("Failed to parse transactions", e);
        }
      }
    };

    loadTransactions();
    window.addEventListener("newDonation", loadTransactions);
    return () => window.removeEventListener("newDonation", loadTransactions);
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
    <div className="bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-[2rem] p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-purple-500/10 rounded-2xl">
          <History className="w-6 h-6 text-purple-500" />
        </div>
        <div>
          <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Your Contributions</h3>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Transaction History</p>
        </div>
      </div>

      {transactions.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border-b border-white/10">
                <th className="pb-4 font-black">Campaign</th>
                <th className="pb-4 font-black">Amount</th>
                <th className="pb-4 font-black">Hash</th>
                <th className="pb-4 font-black text-right">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-white/5 transition-colors">
                  <td className="py-4">
                    <p className="text-sm font-black text-zinc-900 dark:text-white">
                      {tx.campaignTitle || getCampaignName(tx.campaignId)}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-bold">ID #{tx.campaignId}</p>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-black text-blue-600">+{formatXLM(tx.amount)} XLM</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-md">
                        {tx.hash.slice(0, 10)}...
                      </span>
                      <button 
                        onClick={() => copyHash(tx.hash, tx.id)}
                        className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-md transition-colors"
                      >
                        {copiedId === tx.id ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3 text-zinc-400" />}
                      </button>
                    </div>
                  </td>
                  <td className="py-4 text-right">
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex p-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl text-zinc-400 hover:text-blue-600 hover:bg-blue-600/10 transition-all"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900/20 rounded-[2rem] border border-dashed border-zinc-200 dark:border-zinc-800">
          <Receipt className="w-12 h-12 text-zinc-200 dark:text-zinc-800 mx-auto mb-4" />
          <p className="text-sm text-zinc-500 font-bold">No local transactions found.</p>
          <p className="text-[10px] text-zinc-400 font-medium mt-1 uppercase tracking-widest">Make a donation to see it here</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
