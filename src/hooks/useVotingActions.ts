import { useState, useEffect } from "react";
import { useWriteContract, useTransaction } from "wagmi";
import { encodeBytes32String } from "ethers";
import { toast } from "react-toastify";

import contract from "../contract/DecentraVote.json";

const DecentraVoteABI = contract.abi;
const CONTRACT_ADDRESS = "0x4748a49AEaFCe1c5Ead917C4b2979B048FAE8E38";

export function useVotingActions(onSuccess: () => void) {
  const [newVoterAddress, setNewVoterAddress] = useState("");
  const [newProposalName, setNewProposalName] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(0);

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
    setSelectedProposal(proposalIndex);
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "castVote",
      args: [BigInt(proposalIndex)],
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
  };
}
