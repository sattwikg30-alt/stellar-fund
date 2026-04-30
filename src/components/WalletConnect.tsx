"use client";

import React, { useState } from "react";
import { useWallet } from "@/context/WalletProvider";
import { shortenAddress, WalletType } from "@/lib/wallet";
import { Wallet, LogOut, Loader2, AlertCircle, ChevronRight, X, User, Clock, Copy, Check } from "lucide-react";

const WalletConnect = () => {
  const { address, isConnected, isConnecting, connect, disconnect, error, walletType } = useWallet();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const wallets = [
    { id: WalletType.FREIGHTER, name: "Freighter", icon: "🚀", desc: "Recommended Wallet" },
    { id: WalletType.ALBEDO, name: "Albedo", icon: "🌐", desc: "No Extension Needed" },
    { id: WalletType.XBULL, name: "xBull", icon: "🐂", desc: "Advanced Features" },
  ];

  const handleConnect = async (type: string) => {
    await connect(type);
  };

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  React.useEffect(() => {
    if (isConnected && !error) {
      setIsPanelOpen(false);
    }
  }, [isConnected, error]);

  return (
    <>
      <div className="flex items-center gap-3">
        {!isConnected ? (
          <button
            onClick={() => setIsPanelOpen(true)}
            disabled={isConnecting}
            className="group relative flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all duration-300 shadow-lg active:scale-95 disabled:opacity-50 overflow-hidden"
          >
            {isConnecting && <Loader2 className="w-5 h-5 animate-spin" />}
            {!isConnecting && <Wallet className="w-5 h-5" />}
            <span>{isConnecting ? "Connecting..." : "Connect Wallet"}</span>
          </button>
        ) : (
          <button
            onClick={() => setIsPanelOpen(true)}
            className="flex items-center gap-2 p-1 pl-4 pr-1 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-xl hover:bg-white/60 transition-all"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-1" />
            <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-300">
              {shortenAddress(address!)}
            </span>
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-zinc-950 font-bold ml-2">
              <User className="w-4 h-4" />
            </div>
          </button>
        )}
      </div>

      {/* Glass Slide-over Panel */}
      <div 
        className={`fixed inset-0 z-[100] transition-opacity duration-500 ${isPanelOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsPanelOpen(false)} />
        
        <div 
          className={`absolute top-0 right-0 h-[100dvh] w-full max-w-sm bg-white/70 dark:bg-zinc-950/70 backdrop-blur-2xl border-l border-white/20 dark:border-zinc-800/50 shadow-2xl transition-transform duration-500 ease-out flex flex-col ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Header */}
          <div className="p-8 pb-4 flex justify-between items-center shrink-0">
            <div>
              <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">
                {isConnected ? "Account" : "Connect"}
              </h2>
              <p className="text-sm text-zinc-500 font-medium tracking-tight">
                {isConnected ? "Manage your connection" : "Select your Stellar gateway"}
              </p>
            </div>
            <button 
              onClick={() => setIsPanelOpen(false)} 
              disabled={isConnecting}
              className="p-2 hover:bg-black/5 rounded-xl transition-colors disabled:opacity-30"
            >
              <X className="w-6 h-6 text-zinc-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar pb-12 relative">
            {/* Loading Overlay */}
            {isConnecting && (
              <div className="absolute inset-0 z-20 bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                <div className="relative mb-6">
                  <div className="w-20 h-20 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
                  <Clock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">Connecting...</h3>
                <p className="text-sm text-zinc-500 mb-8 max-w-[200px]">Please check your wallet extension to approve the connection.</p>
                <div className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] animate-pulse">Waiting for response</div>
              </div>
            )}

            {!isConnected ? (
              wallets.map((wallet) => (
                <button
                  key={wallet.id}
                  onClick={() => handleConnect(wallet.id)}
                  disabled={isConnecting}
                  className="w-full group flex items-center justify-between p-4 rounded-2xl border border-white/40 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 hover:bg-blue-600 transition-all duration-300 hover:shadow-lg disabled:opacity-50"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center text-2xl bg-white/80 dark:bg-zinc-800/80 rounded-xl group-hover:scale-110 transition-transform">
                      {wallet.icon}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-zinc-900 dark:text-white group-hover:text-white">{wallet.name}</div>
                      <div className="text-[10px] text-zinc-500 group-hover:text-blue-100 font-medium tracking-wide">{wallet.desc}</div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-300 group-hover:text-white transition-all" />
                </button>
              ))
            ) : (
              <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-6 bg-white/50 dark:bg-zinc-900/50 rounded-3xl border border-white/20 dark:border-zinc-800/50 text-center shadow-sm relative group/card overflow-hidden">
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    {copied && (
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
                        Address Copied
                      </span>
                    )}
                    <button 
                      onClick={copyAddress}
                      className="p-2 bg-white dark:bg-zinc-800 rounded-xl border border-black/5 dark:border-white/10 hover:bg-zinc-100 transition-all shadow-sm"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-zinc-400" />}
                    </button>
                  </div>

                  <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 text-3xl font-black shadow-xl shadow-blue-600/20">
                    {walletType === WalletType.FREIGHTER ? "🚀" : walletType === WalletType.ALBEDO ? "🌐" : "🐂"}
                  </div>
                  <h4 className="text-lg font-black text-zinc-900 dark:text-white capitalize leading-tight">
                    {walletType} connected
                  </h4>
                  <p className="text-[10px] font-mono text-zinc-500 break-all mt-4 bg-black/5 dark:bg-white/5 p-3 rounded-xl leading-relaxed select-all">
                    {address}
                  </p>
                </div>

                <button
                  onClick={disconnect}
                  className="w-full flex items-center justify-center gap-3 p-5 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black transition-all shadow-xl shadow-red-600/20 active:scale-[0.98]"
                >
                  <LogOut className="w-5 h-5" />
                  Disconnect Session
                </button>
              </div>
            )}
            
            {error && !isConnecting && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400 font-medium leading-relaxed">
                  {error}
                </p>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-white/20 dark:border-zinc-800/50 text-center shrink-0">
            <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-black">
              Safe & Secure <br/> <span className="text-blue-500">Stellar Ecosystem</span>
            </p>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
      `}</style>
    </>
  );
};

export default WalletConnect;
