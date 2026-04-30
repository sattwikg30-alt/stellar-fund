import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { FreighterModule } from "@creit.tech/stellar-wallets-kit/modules/freighter";
import { AlbedoModule } from "@creit.tech/stellar-wallets-kit/modules/albedo";
import { xBullModule } from "@creit.tech/stellar-wallets-kit/modules/xbull";

/**
 * Supported wallet types
 */
export enum WalletType {
  FREIGHTER = "freighter",
  ALBEDO = "albedo",
  XBULL = "xbull",
}

/**
 * Initialize the Stellar Wallets Kit
 */
if (typeof window !== "undefined") {
  StellarWalletsKit.init({
    network: Networks.TESTNET,
    modules: [
      new FreighterModule(),
      new AlbedoModule(),
      new xBullModule(),
    ],
  });
}

/**
 * Connects to a wallet using the Kit
 */
export const connectWallet = async (type: string): Promise<string> => {
  try {
    StellarWalletsKit.setWallet(type);
    const { address } = await StellarWalletsKit.fetchAddress();
    return address;
  } catch (err: any) {
    console.error("connectWallet error:", err);
    // Standardize error message
    if (err.message) throw err;
    if (err.code === -1) throw new Error("Connection rejected by user");
    throw new Error("Failed to connect wallet. Please check if the extension is installed and unlocked.");
  }
};
