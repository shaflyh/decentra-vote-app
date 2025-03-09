import { MerkleData } from "../types/proposal";

import contract from "./DecentraVote.json";
import merkleData from "./merkle-data.json";

export const DecentraVoteABI = contract.abi;
export const CONTRACT_ADDRESS = "0x6b67F54EFE9a9F4B996aA69FD6417E086Af702d7";

export const TotalAddress = merkleData.totalAddresses;

export const data: MerkleData = merkleData;
export const merkleDataRoot = merkleData.root;
export const merkleDataProofs = data.proofs;
