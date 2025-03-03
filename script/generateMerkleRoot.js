#!/usr/bin/env node
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync"; // Use the correct import
import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { isAddress } from "ethers";
import { writeFileSync } from "fs";

// Configure file paths
const DEFAULT_INPUT_PATH = "./voters.csv";
const DEFAULT_OUTPUT_PATH = "./src/config/merkle-data.json";

// Parse command line arguments
const args = process.argv.slice(2);
const inputPath = args[0] || DEFAULT_INPUT_PATH;
const outputPath = args[1] || DEFAULT_OUTPUT_PATH;

console.log(`Generating Merkle tree from ${inputPath}...`);

try {
  // Read and parse the CSV file
  const fileContent = readFileSync(inputPath, "utf8");

  // Parse CSV assuming addresses are in the first column
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  });

  // Extract addresses from the parsed records
  const addresses = records.map((record) => {
    // Use the first column or a column named "address" if it exists
    const address = record.address || record[Object.keys(record)[0]];
    const trimmedAddress = address.trim();

    // Validate address format
    if (!isAddress(trimmedAddress)) {
      throw new Error(`Invalid Ethereum address: ${trimmedAddress}`);
    }

    return trimmedAddress;
  });

  // Create leaves as [address] arrays for each address
  const values = addresses.map((addr) => [addr]);

  // Create the StandardMerkleTree
  const tree = StandardMerkleTree.of(values, ["address"]);

  // Build proofs map for each address
  const proofMap = {};
  for (const [i, v] of tree.entries()) {
    const address = v[0];
    proofMap[address.toLowerCase()] = tree.getProof(i);
  }

  // Prepare output data
  const outputData = {
    root: tree.root,
    addresses: addresses.map((addr) => addr.toLowerCase()),
    totalAddresses: addresses.length,
    proofs: proofMap,
  };

  // Save the output
  writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

  console.log(`Merkle root: ${tree.root}`);
  console.log(`Total addresses: ${addresses.length}`);

  console.log("\nDeployment instructions:");
  console.log("------------------------");
  console.log(`Use this Merkle root when deploying your contract:`);
  console.log(tree.root);

  // Dump tree structure to a dump file (helpful for debugging)
  const dumpPath = outputPath.replace(".json", "-dump.json");
  const dumpData = JSON.stringify(tree.dump(), null, 2);
  writeFileSync(dumpPath, dumpData);
  console.log(`\nMerkle tree structure dumped to ${dumpPath}`);
} catch (error) {
  console.error("Error generating Merkle tree:", error.message);
  process.exit(1);
}
