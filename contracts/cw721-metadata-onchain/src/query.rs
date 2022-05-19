use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

use cosmwasm_std::Binary;
use cw721::Expiration;


#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum QueryMsg {
    /// Return the owner of the given token, error if token does not exist
    /// Return type: OwnerOfResponse
    OwnerOf {
        token_id: String,
        /// unset or false will filter out expired approvals, you must set to true to see them
        include_expired: Option<bool>,
    },

    /// Return operator that can access all of the owner's tokens.
    /// Return type: `ApprovalResponse`
    Approval {
        token_id: String,
        spender: String,
        include_expired: Option<bool>,
    },

    /// Return approvals that a token has
    /// Return type: `ApprovalsResponse`
    Approvals {
        token_id: String,
        include_expired: Option<bool>,
    },

    /// List all operators that can access all of the owner's tokens
    /// Return type: `OperatorsResponse`
    AllOperators {
        owner: String,
        /// unset or false will filter out expired items, you must set to true to see them
        include_expired: Option<bool>,
        start_after: Option<String>,
        limit: Option<u32>,
    },
    /// Total number of tokens issued
    NumTokens {},

    /// With MetaData Extension.
    /// Returns top-level metadata about the contract: `ContractInfoResponse`
    ContractInfo {},
    /// With MetaData Extension.
    /// Returns metadata about one particular token, based on *ERC721 Metadata JSON Schema*
    /// but directly from the contract: `NftInfoResponse`
    NftInfo {
        token_id: String,
    },
    /// With MetaData Extension.
    /// Returns the result of both `NftInfo` and `OwnerOf` as one query as an optimization
    /// for clients: `AllNftInfo`
    AllNftInfo {
        token_id: String,
        /// unset or false will filter out expired approvals, you must set to true to see them
        include_expired: Option<bool>,
    },

    /// With Enumerable extension.
    /// Returns all tokens owned by the given address, [] if unset.
    /// Return type: TokensResponse.
    Tokens {
        owner: String,
        start_after: Option<String>,
        limit: Option<u32>,
    },
    /// With Enumerable extension.
    /// Requires pagination. Lists all token_ids controlled by the contract.
    /// Return type: TokensResponse.
    AllTokens {
        start_after: Option<String>,
        limit: Option<u32>,
    },

    // Return the minter
    Minter {},
}
