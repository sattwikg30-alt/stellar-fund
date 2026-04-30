"use client";

import React from "react";
import WalletConnect from "@/components/WalletConnect";
import ContractInfo from "@/components/ContractInfo";
import CampaignList from "@/components/CampaignList";
import Leaderboard from "@/components/Leaderboard";
import ActivityFeed from "@/components/ActivityFeed";
import TransactionHistory from "@/components/TransactionHistory";
import { Sparkles, Globe, Shield, Zap, TrendingUp, Users, History } from "lucide-react";

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
              {["Explore", "Leaderboard", "Activity"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-bold text-zinc-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
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

        {/* Campaign Section */}
        <section id="explore" className="mb-32">
          <CampaignList />
        </section>

        {/* Stats & Activity Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-32">
          <section id="leaderboard">
            <Leaderboard />
          </section>
          <section id="activity">
            <ActivityFeed />
          </section>
        </div>

        {/* Transaction History Section */}
        <section id="history" className="mb-32">
          <TransactionHistory />
        </section>

        {/* Call to Action */}
        <div className="p-12 bg-blue-600 rounded-[3rem] text-white text-center relative overflow-hidden shadow-2xl shadow-blue-600/20">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-4xl font-black tracking-tight">Ready to start your own project?</h2>
            <p className="text-white/80 font-medium">Join hundreds of visionaries raising funds for the next big thing on Stellar.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-8 py-4 bg-white text-blue-600 rounded-2xl font-black hover:scale-105 transition-transform shadow-xl">
                Get Started
              </button>
              <button className="px-8 py-4 bg-blue-700 text-white rounded-2xl font-black hover:scale-105 transition-transform border border-white/10">
                Learn More
              </button>
            </div>
          </div>
          <Sparkles className="absolute -top-12 -left-12 w-64 h-64 text-white/10 rotate-12" />
          <Globe className="absolute -bottom-12 -right-12 w-64 h-64 text-white/10 -rotate-12" />
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
