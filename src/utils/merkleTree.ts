import { StandardMerkleTree } from "@openzeppelin/merkle-tree";

/**
 * Verify if an address is part of the Merkle tree using OpenZeppelin's StandardMerkleTree.
 * @param {string} merkleRoot - The Merkle root from your JSON data.
 * @param {string} address - The user's address.
 * @param {string[]} proof - The Merkle proof for the address.
 * @returns {boolean} - True if the proof is valid, false otherwise.
 */
export function verifyProof(merkleRoot: string, address: string, proof: string[]): boolean {
  console.log("Merkle Proof: " + proof);
  return StandardMerkleTree.verify(merkleRoot, ["address"], [address], proof);
}
