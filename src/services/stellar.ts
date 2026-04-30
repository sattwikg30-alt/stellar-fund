import { 
  rpc, 
  Networks, 
  TransactionBuilder, 
  Contract, 
  scValToNative, 
  nativeToScVal,
  Account,
  Address
} from "@stellar/stellar-sdk";
import { CONTRACT_ID } from "@/lib/contract";
import { StellarWalletsKit } from "@creit.tech/stellar-wallets-kit";

// Testnet Configuration
const RPC_URL = "https://soroban-testnet.stellar.org";
const NETWORK_PASSPHRASE = Networks.TESTNET;
const server = new rpc.Server(RPC_URL);

/**
 * Interface for standard service responses
 */
export interface StellarResponse<T = unknown> {
  success: boolean;
  data?: T;
  txHash?: string;
  error?: string;
}

/**
 * Helper to check if an account exists and is funded
 */
const ensureAccountFunded = async (address: string) => {
  try {
    return await server.getAccount(address);
  } catch (err: any) {
    if (err.status === 404 || (err.response && err.response.status === 404)) {
      throw new Error("Your account is not funded on Testnet. Please use Friendbot to get some XLM.");
    }
    throw err;
  }
};

/**
 * 1. Create a new crowdfunding campaign
 */
export const createCampaign = async (owner: string, title: string, goal: number): Promise<StellarResponse> => {
  try {
    if (goal <= 0) throw new Error("Goal must be greater than 0");

    const contract = new Contract(CONTRACT_ID);
    
    // Check if account is funded
    const account = await ensureAccountFunded(owner);
    
    // Prepare the invocation
    const operation = contract.call(
      "create_campaign",
      new Address(owner).toScVal(),
      nativeToScVal(title, { type: "string" }),
      nativeToScVal(BigInt(goal), { type: "i128" })
    );

    const tx = new TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(60) // Longer timeout for testnet
      .build();

    // Simulate to get footprint and resource usage
    const simulation = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simulation)) {
      console.error("Simulation error detail:", simulation);
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    // Assemble and sign
    const assembledTx = rpc.assembleTransaction(tx, simulation).build();
    const { signedTxXdr } = await StellarWalletsKit.signTransaction(assembledTx.toXDR());
    
    // Submit
    const result = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE));
    
    if (result.status === "PENDING") {
      return { success: true, txHash: result.hash };
    }
    
    throw new Error(`Transaction failed with status: ${result.status}`);
  } catch (err: unknown) {
    console.error("createCampaign full error:", err);
    const error = err as any;
    return { 
      success: false, 
      error: error.message || (typeof error === 'string' ? error : "Failed to create campaign. Check console.") 
    };
  }
};

/**
 * 2. Donate to a specific campaign
 */
export const donate = async (donor: string, campaignId: number, amount: number): Promise<StellarResponse> => {
  try {
    if (amount <= 0) throw new Error("Amount must be greater than 0");

    const contract = new Contract(CONTRACT_ID);
    const account = await ensureAccountFunded(donor);

    const operation = contract.call(
      "donate",
      nativeToScVal(campaignId, { type: "u32" }),
      new Address(donor).toScVal(),
      nativeToScVal(BigInt(amount), { type: "i128" })
    );

    const tx = new TransactionBuilder(account, {
      fee: "1000",
      networkPassphrase: NETWORK_PASSPHRASE,
    })
      .addOperation(operation)
      .setTimeout(60)
      .build();

    const simulation = await server.simulateTransaction(tx);
    if (rpc.Api.isSimulationError(simulation)) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    const assembledTx = rpc.assembleTransaction(tx, simulation).build();
    const { signedTxXdr } = await StellarWalletsKit.signTransaction(assembledTx.toXDR());
    
    const result = await server.sendTransaction(TransactionBuilder.fromXDR(signedTxXdr, NETWORK_PASSPHRASE));
    
    return { success: true, txHash: result.hash };
  } catch (err: unknown) {
    console.error("donate full error:", err);
    const error = err as any;
    return { success: false, error: error.message || "Failed to process donation" };
  }
};

/**
 * 3. Fetch all active campaigns
 */
export const getAllCampaigns = async (): Promise<StellarResponse<unknown[]>> => {
  try {
    const contract = new Contract(CONTRACT_ID);
    
    // Use a high-level simulation to fetch data
    const tx = new TransactionBuilder(
      new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0"), 
      { fee: "0", networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(contract.call("get_all_campaigns"))
      .setTimeout(30)
      .build();

    const simulation = await server.simulateTransaction(tx);
    
    if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
      const campaignsMap = scValToNative(simulation.result.retval);
      
      // The contract returns a Map<u32, Campaign>
      if (campaignsMap instanceof Map) {
        const campaignsArray = Array.from(campaignsMap.entries()).map(([id, campaign]) => ({
          ...(campaign as any),
          id: Number(id)
        }));
        return { success: true, data: campaignsArray };
      }
      
      return { success: true, data: Array.isArray(campaignsMap) ? campaignsMap : [] };
    }
    
    return { success: true, data: [] };
  } catch (err: unknown) {
    console.error("getAllCampaigns error:", err);
    return { success: false, error: "Failed to fetch campaigns. Make sure contract is deployed." };
  }
};

/**
 * 4. Get a single campaign by ID
 */
export const getCampaign = async (id: number): Promise<StellarResponse> => {
  try {
    const contract = new Contract(CONTRACT_ID);
    const tx = new TransactionBuilder(
      new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0"), 
      { fee: "0", networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(contract.call("get_campaign", nativeToScVal(id, { type: "u32" })))
      .setTimeout(30)
      .build();

    const simulation = await server.simulateTransaction(tx);
    
    if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
      const campaign = scValToNative(simulation.result.retval);
      if (!campaign) throw new Error("Campaign not found");
      return { success: true, data: campaign };
    }
    
    throw new Error("Campaign does not exist");
  } catch (err: unknown) {
    const error = err as any;
    return { success: false, error: error.message };
  }
};

/**
 * 5. Get all donations for a campaign
 */
export const getDonations = async (campaignId: number): Promise<StellarResponse<unknown[]>> => {
  try {
    const contract = new Contract(CONTRACT_ID);
    const tx = new TransactionBuilder(
      new Account("GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF", "0"), 
      { fee: "0", networkPassphrase: NETWORK_PASSPHRASE }
    )
      .addOperation(contract.call("get_donations", nativeToScVal(campaignId, { type: "u32" })))
      .setTimeout(30)
      .build();

    const simulation = await server.simulateTransaction(tx);
    
    if (rpc.Api.isSimulationSuccess(simulation) && simulation.result) {
      const donations = scValToNative(simulation.result.retval);
      if (donations instanceof Map) {
         return { success: true, data: Array.from(donations.entries()) };
      }
      return { success: true, data: Array.isArray(donations) ? donations : [] };
    }
    
    return { success: true, data: [] };
  } catch (err: unknown) {
    console.error("getDonations error:", err);
    return { success: false, error: "Failed to fetch donations" };
  }
};
