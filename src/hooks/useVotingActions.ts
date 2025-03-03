import { useState, useEffect } from "react";
import { useWriteContract, useTransaction, useAccount } from "wagmi";
import { encodeBytes32String } from "ethers";
import { toast } from "react-toastify";

import { DecentraVoteABI, CONTRACT_ADDRESS, merkleDataProofs } from "../config/constants";

export function useVotingActions(onSuccess: () => void) {
  const { address } = useAccount();

  const [newVoterAddress, setNewVoterAddress] = useState("");
  const [newProposalName, setNewProposalName] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(0);

  const lowerCaseAddress = address?.toLowerCase();
  const proof: string[] = merkleDataProofs[lowerCaseAddress || ""] ?? [];

  // Contract write state
  const { writeContract, isPending: writeLoading, data: writeData } = useWriteContract();

  // Transaction state
  const { isSuccess: txSuccess } = useTransaction({
    hash: writeData,
  });

  // Handle success effects
  useEffect(() => {
    if (txSuccess) {
      toast.success("Transaction successful!");
      setNewVoterAddress("");
      setNewProposalName("");
      onSuccess();
    }
  }, [txSuccess, onSuccess]);

  // Handle register voter
  const handleRegisterVoter = () => {
    if (!newVoterAddress) return toast.error("Please enter a valid address");

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "registerVoter",
      args: [newVoterAddress],
    });
  };

  // Handle add proposal
  const handleAddProposal = () => {
    if (!newProposalName) return toast.error("Please enter a proposal name");

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "addProposal",
      args: [encodeBytes32String(newProposalName)],
    });
  };

  // Handle vote
  const handleVote = (proposalIndex: number) => {
    console.log("Send the vote");
    setSelectedProposal(proposalIndex);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "castVote",
      args: [BigInt(proposalIndex), proof],
    });
  };

  return {
    newVoterAddress,
    setNewVoterAddress,
    newProposalName,
    setNewProposalName,
    selectedProposal,
    writeLoading,
    handleRegisterVoter,
    handleAddProposal,
    handleVote,
    proof,
  };
}
