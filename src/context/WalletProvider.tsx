"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { connectWallet } from "@/lib/wallet";

interface WalletContextType {
  address: string | null;
  walletType: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connect: (type: string) => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedAddress = localStorage.getItem("stellar_address");
    const savedType = localStorage.getItem("stellar_wallet_type");
    
    if (savedAddress && savedType) {
      setAddress(savedAddress);
      setWalletType(savedType);
    }
  }, []);

  const connect = async (type: string) => {
    setIsConnecting(true);
    setError(null);
    try {
      const connectedAddress = await connectWallet(type);
      
      if (connectedAddress) {
        setAddress(connectedAddress);
        setWalletType(type);
        localStorage.setItem("stellar_address", connectedAddress);
        localStorage.setItem("stellar_wallet_type", type);
      }
    } catch (err: any) {
      setError(err.message || "Connection failed. Please ensure the wallet is installed.");
      console.error("Wallet connection error:", err);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setWalletType(null);
    setError(null);
    localStorage.removeItem("stellar_address");
    localStorage.removeItem("stellar_wallet_type");
  };

  return (
    <WalletContext.Provider
      value={{
        address,
        walletType,
        isConnected: !!address,
        isConnecting,
        error,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
