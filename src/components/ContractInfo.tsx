"use client";

import React, { useState } from "react";
import { CONTRACT_ID } from "@/lib/contract";
import { Terminal, Copy, Check } from "lucide-react";

const ContractInfo = () => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(CONTRACT_ID);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group fixed bottom-6 left-6 z-40">
      <div className="flex items-center gap-2 p-1.5 bg-zinc-900/10 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-full hover:bg-zinc-900/20 dark:hover:bg-white/10 transition-all duration-300">
        <div className="w-8 h-8 flex items-center justify-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 rounded-full shadow-lg">
          <Terminal className="w-4 h-4" />
        </div>
        
        <div className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out">
          <div className="px-3 flex items-center gap-3 whitespace-nowrap">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Contract ID</span>
              <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">{CONTRACT_ID.slice(0, 8)}...{CONTRACT_ID.slice(-4)}</span>
            </div>
            
            <button 
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractInfo;
