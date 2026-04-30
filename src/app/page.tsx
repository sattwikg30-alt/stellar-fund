"use client";

import React from "react";
import WalletConnect from "@/components/WalletConnect";
import ContractInfo from "@/components/ContractInfo";
import CreateCampaign from "@/components/CreateCampaign";
import CampaignList from "@/components/CampaignList";
import { Sparkles, Globe, Shield, Zap } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] dark:bg-black selection:bg-blue-600/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-[80] w-full border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/70 dark:bg-black/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-600/20 group-hover:rotate-6 transition-transform">
              S
            </div>
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
              Stellar<span className="text-blue-600">Fund</span>
            </span>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              {["Explore", "How it Works", "Governance"].map((item) => (
                <a key={item} href="#" className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  {item}
                </a>
              ))}
            </div>
            <WalletConnect />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-32 relative z-10">
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 rounded-full text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-4">
            <Sparkles className="w-3 h-3" />
            Empowering Visionaries
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-zinc-900 dark:text-white leading-[0.9]">
            Fund the <span className="text-blue-600">Future</span> on Stellar.
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 font-medium max-w-2xl mx-auto leading-relaxed">
            A decentralized crowdfunding platform built on Soroban. Transparent, secure, and globally accessible fundraising for everyone.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-32">
          {[
            { icon: <Globe className="w-6 h-6" />, title: "Global Scale", desc: "Access funding from anywhere in the world instantly." },
            { icon: <Shield className="w-6 h-6" />, title: "Soroban Secure", desc: "Smart contracts ensure your funds are always protected." },
            { icon: <Zap className="w-6 h-6" />, title: "Lightning Fast", desc: "Donations arrive in seconds with minimal fees." }
          ].map((feature, i) => (
            <div key={i} className="p-8 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-white/20 dark:border-zinc-800/50 rounded-[2.5rem] group hover:bg-white/60 transition-all duration-500">
              <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-black text-zinc-900 dark:text-white mb-2">{feature.title}</h3>
              <p className="text-zinc-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Create */}
          <div className="lg:col-span-4 sticky top-28 h-fit">
            <CreateCampaign onCreated={() => window.dispatchEvent(new Event("refreshCampaigns"))} />
            <div className="mt-8 p-6 bg-indigo-600 rounded-[2.5rem] text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
              <div className="relative z-10">
                <h4 className="font-black text-lg mb-2">Need Help?</h4>
                <p className="text-sm text-white/80 font-medium leading-relaxed">Our developer guide covers everything from wallet setup to contract interaction.</p>
                <button className="mt-4 px-6 py-2 bg-white text-indigo-600 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform">
                  View Guide
                </button>
              </div>
              <Zap className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 rotate-12" />
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-8">
            <CampaignList />
          </div>
        </div>
      </div>

      <ContractInfo />

      {/* Footer */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-black py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex items-center gap-2 grayscale opacity-50">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded flex items-center justify-center text-white dark:text-zinc-950 font-black text-sm">
              S
            </div>
            <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-white">
              StellarFund
            </span>
          </div>
          
          <div className="flex gap-12">
            {[
              { label: "Platform", links: ["Explore", "Security", "Fees"] },
              { label: "Community", links: ["Twitter", "Discord", "Forum"] }
            ].map((col, i) => (
              <div key={i} className="space-y-4">
                <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">{col.label}</h5>
                <ul className="space-y-2">
                  {col.links.map(link => (
                    <li key={link}><a href="#" className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors">{link}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-zinc-100 dark:border-zinc-900 text-center text-[10px] font-black text-zinc-400 uppercase tracking-widest">
          &copy; 2026 StellarFund Protocol. All rights reserved. Built on Soroban.
        </div>
      </footer>
    </main>
  );
}
