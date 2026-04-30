#![no_std]

use soroban_sdk::{contract, contractevent, contractimpl, contracttype, symbol_short, Address, Env, Map, Symbol, String};

// --- Storage Structs ---

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Campaign {
    pub owner: Address,
    pub title: String,
    pub goal: i128,
    pub total: i128,
}

// --- Events ---

#[contractevent]
pub struct CampaignCreatedEvent {
    pub campaign_id: u32,
    pub owner: Address,
}

#[contractevent]
pub struct DonationEvent {
    pub campaign_id: u32,
    pub from: Address,
    pub amount: i128,
}

// --- Storage Keys ---

const CAMPAIGNS: Symbol = symbol_short!("CAMPAIGNS");
const DONATIONS: Symbol = symbol_short!("DONATIONS");
const COUNTER: Symbol = symbol_short!("COUNTER");

// --- Contract Implementation ---

#[contract]
pub struct Crowdfunding;

#[contractimpl]
impl Crowdfunding {
    /// Creates a new crowdfunding campaign.
    /// Strictly enforces: owner authorization, goal > 0.
    pub fn create_campaign(env: Env, owner: Address, title: String, goal: i128) -> u32 {
        owner.require_auth();

        if goal <= 0 {
            panic!("Campaign goal must be greater than 0");
        }

        // Get and increment campaign counter
        let mut counter: u32 = env.storage().instance().get(&COUNTER).unwrap_or(0);
        let campaign_id = counter;
        counter += 1;
        env.storage().instance().set(&COUNTER, &counter);

        // Initialize campaign data
        let campaign = Campaign {
            owner: owner.clone(),
            title,
            goal,
            total: 0,
        };

        // Store campaign in the map
        let mut campaigns: Map<u32, Campaign> = env.storage().instance().get(&CAMPAIGNS).unwrap_or(Map::new(&env));
        campaigns.set(campaign_id, campaign);
        env.storage().instance().set(&CAMPAIGNS, &campaigns);

        // Emit event
        CampaignCreatedEvent { campaign_id, owner }.publish(&env);

        campaign_id
    }

    /// Allows a user to donate to a specific campaign.
    /// Strictly enforces: donor authorization, amount > 0, campaign existence.
    pub fn donate(env: Env, campaign_id: u32, from: Address, amount: i128) {
        from.require_auth();

        if amount <= 0 {
            panic!("Donation amount must be greater than 0");
        }

        // 1. Update Campaign Total
        let mut campaigns: Map<u32, Campaign> = env.storage().instance().get(&CAMPAIGNS).unwrap_or(Map::new(&env));
        
        let mut campaign = match campaigns.get(campaign_id) {
            Some(campaign) => campaign,
            None => panic!("Campaign does not exist"),
        };
        
        campaign.total += amount;
        campaigns.set(campaign_id, campaign);
        env.storage().instance().set(&CAMPAIGNS, &campaigns);

        // 2. Update User Donation Map
        let mut all_donations: Map<u32, Map<Address, i128>> = 
            env.storage().instance().get(&DONATIONS).unwrap_or(Map::new(&env));
        
        let mut campaign_donations = all_donations.get(campaign_id).unwrap_or(Map::new(&env));
        let previous_donation = campaign_donations.get(from.clone()).unwrap_or(0);
        
        campaign_donations.set(from.clone(), previous_donation + amount);
        all_donations.set(campaign_id, campaign_donations);
        env.storage().instance().set(&DONATIONS, &all_donations);

        // Emit event
        DonationEvent { campaign_id, from, amount }.publish(&env);
    }

    /// Returns the data for a specific campaign.
    pub fn get_campaign(env: Env, campaign_id: u32) -> Campaign {
        let campaigns: Map<u32, Campaign> = env.storage().instance().get(&CAMPAIGNS).expect("No campaigns found");
        campaigns.get(campaign_id).expect("Campaign does not exist")
    }

    /// Returns all campaigns.
    pub fn get_all_campaigns(env: Env) -> Map<u32, Campaign> {
        env.storage().instance().get(&CAMPAIGNS).unwrap_or(Map::new(&env))
    }

    /// Returns all donations for a specific campaign.
    pub fn get_donations(env: Env, campaign_id: u32) -> Map<Address, i128> {
        let all_donations: Map<u32, Map<Address, i128>> = 
            env.storage().instance().get(&DONATIONS).unwrap_or(Map::new(&env));
        
        all_donations.get(campaign_id).unwrap_or(Map::new(&env))
    }
}