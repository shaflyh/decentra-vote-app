import { useState, useEffect } from "react";
import { useWriteContract, useTransaction, useAccount } from "wagmi";
import { encodeBytes32String } from "ethers";
import { toast } from "react-toastify";

import { DecentraVoteABI, CONTRACT_ADDRESS, merkleDataProofs } from "../config/constants";

export function useVotingActions(onSuccess: () => void) {
  const { address } = useAccount();

  const [newProposalName, setNewProposalName] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(0);

  const lowerCaseAddress = address?.toLowerCase();
  const voterMerkleproof: string[] = merkleDataProofs[lowerCaseAddress || ""] ?? [];

  // Contract write state
  const { writeContract, isPending: writeLoading, data: writeData } = useWriteContract();
  // Transaction state
  const { isSuccess: txSuccess } = useTransaction({ hash: writeData });

  useEffect(() => {
    if (txSuccess) {
      toast.success("Transaction successful!");
      setNewProposalName("");
      onSuccess();
    }
  }, [txSuccess, onSuccess]);

  const handleVote = (proposalIndex: number) => {
    console.log("Send the vote");
    setSelectedProposal(proposalIndex);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "castVote",
      args: [BigInt(proposalIndex), voterMerkleproof],
    });
  };

  // --- Admin Actions ---
  const handleAddProposal = () => {
    if (!newProposalName) return toast.error("Please enter a proposal name");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "addProposal",
      args: [encodeBytes32String(newProposalName)],
    });
  };

  const handleFinalizeVoting = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "finalizeVoting",
      args: [],
    });
  };

  const handlePauseVoting = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "pause",
      args: [],
    });
  };

  const handleUnpauseVoting = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "unpause",
      args: [],
    });
  };

  const handleUpdateMerkleRoot = (newRoot: string) => {
    if (!newRoot) return toast.error("Please enter a new Merkle root");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "updateMerkleRoot",
      args: [encodeBytes32String(newRoot)],
    });
  };

  const handleUpdateProposalName = (index: number, newName: string) => {
    if (!newName) return toast.error("Please enter a new proposal name");
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "updateProposalName",
      args: [index, encodeBytes32String(newName)],
    });
  };

  const handleRemoveProposal = (index: number) => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "removeProposal",
      args: [index],
    });
  };

  return {
    newProposalName,
    setNewProposalName,
    selectedProposal,
    writeLoading,
    handleAddProposal,
    handleVote,
    voterMerkleproof,
    handleFinalizeVoting,
    handlePauseVoting,
    handleUnpauseVoting,
    handleUpdateMerkleRoot,
    handleUpdateProposalName,
    handleRemoveProposal,
  };
}
