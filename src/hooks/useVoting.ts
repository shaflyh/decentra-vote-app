import { useState, useEffect } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { decodeBytes32String } from "ethers";

import { Proposal, TimeLeft, VotingStats } from "../types/proposal";
import { DecentraVoteABI, CONTRACT_ADDRESS } from "../config/constants";

export function useVoting() {
  const [_refreshKey, setRefreshKey] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ start: "", end: "" });

  // Contract reads
  const {
    data: topicData,
    isLoading: isTopicLoading,
    error: topicError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "topic",
  });

  const { data: admin } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "admin",
  });

  const { data: proposalData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "getAllProposals",
  });

  const { data: votingStats } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "getVotingStats",
  }) as { data: VotingStats };

  const { data: winnerNameData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "winnerName",
  });

  const { data: votingActiveData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "isVotingActive",
  });

  const { data: timeUntilVotingStarts } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "getTimeUntilVotingStarts",
  });

  const { data: timeUntilVotingEnds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "getTimeUntilVotingEnds",
  });

  const votingActive = Boolean(votingActiveData);

  // Watch for events to trigger refreshes
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    eventName: "VoterRegistered",
    onLogs: () => setRefreshKey((prev) => prev + 1),
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    eventName: "VoteCasted",
    onLogs: () => setRefreshKey((prev) => prev + 1),
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    eventName: "ProposalCreated",
    onLogs: () => setRefreshKey((prev) => prev + 1),
  });

  // Process proposal data when it changes
  useEffect(() => {
    if (proposalData) {
      try {
        const [names, voteCounts] = proposalData as [string[], bigint[]];

        const processedProposals = names.map((name, index) => ({
          name: decodeBytes32String(name),
          voteCount: Number(voteCounts[index]),
        }));

        setProposals(processedProposals);
      } catch (error) {
        console.error("Error processing proposal data:", error);
        setProposals([]);
      }
    }
  }, [proposalData]);

  // Update time left
  useEffect(() => {
    if (timeUntilVotingStarts && timeUntilVotingEnds) {
      const formatTime = (seconds: bigint) => {
        if (seconds <= 0n) return "now";
        const days = Number(seconds / 86400n);
        const hours = Number((seconds % 86400n) / 3600n);
        const minutes = Number((seconds % 3600n) / 60n);
        return `${days}d ${hours}h ${minutes}m`;
      };

      setTimeLeft({
        start: formatTime(timeUntilVotingStarts as bigint),
        end: formatTime(timeUntilVotingEnds as bigint),
      });
    }
  }, [timeUntilVotingStarts, timeUntilVotingEnds]);

  return {
    topic: topicData ? decodeBytes32String(topicData as string) : "",
    isTopicLoading,
    topicError,
    admin,
    proposals,
    votingStats,
    winnerName: winnerNameData ? decodeBytes32String(winnerNameData as string) : "",
    votingActive,
    timeLeft,
    refreshData: () => setRefreshKey((prev) => prev + 1),
  };
}
