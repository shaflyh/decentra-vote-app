import { MerkleData } from "../types/proposal";

import contract from "./DecentraVote.json";
import merkleData from "./merkle-data.json";

export const DecentraVoteABI = contract.abi;
export const CONTRACT_ADDRESS = "0x6F82c938c859137cD6442d51DA8390c40a7Ee6E1";

export const TotalAddress = merkleData.totalAddresses;

export const data: MerkleData = merkleData;
export const merkleDataRoot = merkleData.root;
export const merkleDataProofs = data.proofs;
