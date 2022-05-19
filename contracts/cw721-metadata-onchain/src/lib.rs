use cosmwasm_std::Empty;
use cosmwasm_std::StdResult;
use cosmwasm_std::{to_binary, Uint128};
pub use cw721_base::{ContractError, InstantiateMsg, MintMsg, MinterResponse, QueryMsg};
use cw_storage_plus::U32Key;
use cw_storage_plus::{Item, Map};
use schemars::JsonSchema;
use serde::{Deserialize, Serialize};

//key->NFT number, value->collateral in uusd
pub const COLLATERALS: Map<U32Key, Uint128> = Map::new("collaterals");
pub const BOND_COUNT: Item<u32> = Item::new("bond_counter");

#[derive(Serialize, Deserialize, Clone, PartialEq, JsonSchema, Debug, Default)]
pub struct Trait {
    pub display_type: Option<String>,
    pub trait_type: String,
    pub value: String,
}

// see: https://docs.opensea.io/docs/metadata-standards
#[derive(Serialize, Deserialize, Clone, PartialEq, JsonSchema, Debug, Default)]
pub struct Metadata {
    pub image: Option<String>,
    pub image_data: Option<String>,
    pub external_url: Option<String>,
    pub description: Option<String>,
    pub name: Option<String>,
    pub attributes: Option<Vec<Trait>>,
    pub background_color: Option<String>,
    pub animation_url: Option<String>,
    pub youtube_url: Option<String>,
}

pub type Extension = Option<Metadata>;

pub type Cw721MetadataContract<'a> = cw721_base::Cw721Contract<'a, Extension, Empty>;
pub type ExecuteMsg = cw721_base::ExecuteMsg<Extension>;

#[cfg(not(feature = "library"))]
pub mod entry {
    use super::*;

    use cosmwasm_std::entry_point;
    use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};

    // This is a simple type to let us handle empty extensions

    // This makes a conscious choice on the various generics used by the contract
    #[entry_point]
    pub fn instantiate(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: InstantiateMsg,
    ) -> StdResult<Response> {
        //initialize the bond count
        BOND_COUNT.save(deps.storage, &0);
        Cw721MetadataContract::default().instantiate(deps, env, info, msg)
    }

    #[entry_point]
    pub fn execute(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        msg: ExecuteMsg,
    ) -> Result<Response, ContractError> {
        match msg {
            ExecuteMsg::Mint(msg) => {
                let uusd_received: Uint128 = info
                    .funds
                    .iter()
                    .find(|c| c.denom == String::from("uusd"))
                    .map(|c| Uint128::from(c.amount))
                    .unwrap_or_else(Uint128::zero);

                let mut count = 0;
                BOND_COUNT.update(deps.storage, |mut counter| -> Result<_, ContractError> {
                    counter = counter + 1;
                    count = counter;
                    Ok(counter)
                })?;
                COLLATERALS.save(deps.storage, U32Key::from(count), &uusd_received);
                Cw721MetadataContract::default().execute(
                    deps,
                    env,
                    info,
                    cw721_base::ExecuteMsg::Mint(msg),
                )
            }
            ExecuteMsg::Mint(msg) => {
                let uusd_received: Uint128 = info
                    .funds
                    .iter()
                    .find(|c| c.denom == String::from("uusd"))
                    .map(|c| Uint128::from(c.amount))
                    .unwrap_or_else(Uint128::zero);

                let mut count = 0;
                BOND_COUNT.update(deps.storage, |mut counter| -> Result<_, ContractError> {
                    counter = counter + 1;
                    count = counter;
                    Ok(counter)
                })?;
                COLLATERALS.save(deps.storage, U32Key::from(count), &uusd_received);
                Cw721MetadataContract::default().execute(
                    deps,
                    env,
                    info,
                    cw721_base::ExecuteMsg::Mint(msg),
                )
            }
            _ => Cw721MetadataContract::default().execute(deps, env, info, msg),
        }
    }

    #[entry_point]
    pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
        match msg {
            QueryMsg::OwnerOf {
                token_id,
                include_expired,
            } => {
                let amount = COLLATERALS
                    .load(deps.storage, U32Key::from(token_id.parse::<u32>().unwrap()))?;
                to_binary(&ok(amount)?)
            }
            _ => Cw721MetadataContract::default().query(deps, env, msg),
        }
    }
}

fn ok(amount: Uint128) -> StdResult<CollateralAmountResponse> {
    Ok(CollateralAmountResponse {
        collateral_amount: amount,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    use cosmwasm_std::testing::{mock_dependencies, mock_env, mock_info};
    use cw721::Cw721Query;

    const CREATOR: &str = "creator";

    #[test]
    fn use_metadata_extension() {
        let mut deps = mock_dependencies(&[]);
        let contract = Cw721MetadataContract::default();

        let info = mock_info(CREATOR, &[]);
        let init_msg = InstantiateMsg {
            name: "SpaceShips".to_string(),
            symbol: "SPACE".to_string(),
            minter: CREATOR.to_string(),
        };
        contract
            .instantiate(deps.as_mut(), mock_env(), info.clone(), init_msg)
            .unwrap();

        let token_id = "Enterprise";
        let mint_msg = MintMsg {
            token_id: token_id.to_string(),
            owner: "john".to_string(),
            token_uri: Some("https://starships.example.com/Starship/Enterprise.json".into()),
            extension: Some(Metadata {
                description: Some("Spaceship with Warp Drive".into()),
                name: Some("Starship USS Enterprise".to_string()),
                ..Metadata::default()
            }),
        };
        let exec_msg = ExecuteMsg::Mint(mint_msg.clone());
        contract
            .execute(deps.as_mut(), mock_env(), info, exec_msg)
            .unwrap();

        let res = contract.nft_info(deps.as_ref(), token_id.into()).unwrap();
        assert_eq!(res.token_uri, mint_msg.token_uri);
        assert_eq!(res.extension, mint_msg.extension);
    }
}

//-------------------------------------------------

#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
pub struct CollateralAmountResponse {
    pub collateral_amount: Uint128,
}
