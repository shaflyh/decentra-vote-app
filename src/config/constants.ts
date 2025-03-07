import { MerkleData } from "../types/proposal";

import contract from "./DecentraVote.json";
import merkleData from "./merkle-data.json";

export const DecentraVoteABI = contract.abi;
export const CONTRACT_ADDRESS = "0x817F302F698c537fEd51DCA36D4322c5712A3482";

export const TotalAddress = merkleData.totalAddresses;

export const data: MerkleData = merkleData;
export const merkleDataRoot = merkleData.root;
export const merkleDataProofs = data.proofs;
