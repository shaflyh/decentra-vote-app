import { useState, useEffect, useRef, useCallback } from "react";
import { useReadContract, useWatchContractEvent } from "wagmi";
import { decodeBytes32String } from "ethers";

import { Proposal, VotingTime, VotingStats } from "../types/proposal";
import { DecentraVoteABI, CONTRACT_ADDRESS } from "../config/constants";
import { logContractRead, logEvent } from "../utils/logger";
import { formatTimeLeft, formatTimestampWithTimezone } from "../utils/formatter";

export function useVoting() {
  const [_refreshKey, setRefreshKey] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [timeLeft, setTimeLeft] = useState<VotingTime>();
  const logPrefix = "[useVoting]";

  // Create a ref to track first render vs subsequent renders for each contract call
  const initRenders = useRef({
    topic: true,
    admin: true,
    proposals: true,
    votingStats: true,
    winnerName: true,
    votingActive: true,
    timeUntilVoting: true,
  });

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

  useEffect(() => {
    logContractRead("topic", topicData, topicError, isTopicLoading, initRenders);
  }, [topicData, topicError, isTopicLoading]);

  const {
    data: admin,
    isLoading: isAdminLoading,
    error: adminError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "admin",
  });

  useEffect(() => {
    logContractRead("admin", admin, adminError, isAdminLoading, initRenders);
  }, [admin, adminError, isAdminLoading]);

  const {
    data: proposalData,
    isLoading: isProposalLoading,
    error: proposalError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "getAllProposals",
  });

  useEffect(() => {
    logContractRead("proposals", proposalData, proposalError, isProposalLoading, initRenders);
  }, [proposalData, proposalError, isProposalLoading]);

  const {
    data: votingStats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "getVotingStats",
  }) as {
    data: VotingStats;
    isLoading: boolean;
    error: Error | null;
  };

  useEffect(() => {
    logContractRead("votingStats", votingStats, statsError, isStatsLoading, initRenders);
  }, [votingStats, statsError, isStatsLoading]);

  const {
    data: winnerNameData,
    isLoading: isWinnerLoading,
    error: winnerError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "winnerName",
  });

  useEffect(() => {
    logContractRead("winnerName", winnerNameData, winnerError, isWinnerLoading, initRenders);
  }, [winnerNameData, winnerError, isWinnerLoading]);

  const {
    data: votingActiveData,
    isLoading: isVotingActiveLoading,
    error: votingActiveError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "isVotingActive",
  });

  useEffect(() => {
    logContractRead(
      "votingActive",
      votingActiveData,
      votingActiveError,
      isVotingActiveLoading,
      initRenders
    );
  }, [votingActiveData, votingActiveError, isVotingActiveLoading]);

  const {
    data: votingFinalizedData,
    isLoading: votingFinalizedLoading,
    error: votingFinalizedError,
  } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "votingFinalized",
  });

  useEffect(() => {
    logContractRead(
      "votingActive",
      votingFinalizedData,
      votingFinalizedError,
      votingFinalizedLoading,
      initRenders
    );
  }, [votingFinalizedData, votingFinalizedError, votingFinalizedLoading]);

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

  const { data: votingStartTime } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "votingStartTime",
  });

  const { data: votingEndTime } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "votingEndTime",
  });

  const votingActive = Boolean(votingActiveData);

  const isVotingFinalized = Boolean(votingFinalizedData);

  // Watch for events to trigger refreshes
  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    eventName: "VoteCasted",
    onLogs: (logs) => {
      logEvent("VoteCasted", logs);
      setRefreshKey((prev) => prev + 1);
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    eventName: "ProposalCreated",
    onLogs: (logs) => {
      logEvent("ProposalCreated", logs);
      setRefreshKey((prev) => prev + 1);
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    eventName: "ProposalUpdated",
    onLogs: (logs) => {
      logEvent("ProposalUpdated", logs);
      setRefreshKey((prev) => prev + 1);
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    eventName: "ProposalRemoved",
    onLogs: (logs) => {
      logEvent("ProposalRemoved", logs);
      setRefreshKey((prev) => prev + 1);
    },
  });

  useWatchContractEvent({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    eventName: "VotingFinalized",
    onLogs: (logs) => {
      logEvent("VotingFinalized", logs);
      setRefreshKey((prev) => prev + 1);
    },
  });

  // Process proposal data when it changes
  useEffect(() => {
    if (proposalData) {
      try {
        console.log(`${logPrefix} Processing proposal data...`);
        const [names, voteCounts] = proposalData as [string[], bigint[]];

        const processedProposals = names.map((name, index) => ({
          name: decodeBytes32String(name),
          voteCount: Number(voteCounts[index]),
        }));

        console.log(`${logPrefix} Processed proposals:`, processedProposals);
        setProposals(processedProposals);
      } catch (error) {
        console.error(`${logPrefix} Error processing proposal data:`, error);
        setProposals([]);
      }
    }
  }, [proposalData]);

  // Update time left
  useEffect(() => {
    console.log(`${logPrefix} Updating time left calculations...`);

    const time = {
      start: formatTimestampWithTimezone(votingStartTime as bigint),
      end: formatTimestampWithTimezone(votingEndTime as bigint),
      untilStart: formatTimeLeft(timeUntilVotingStarts as bigint),
      untilEnd: formatTimeLeft(timeUntilVotingEnds as bigint),
    };

    console.log(`${logPrefix} Time data:`, time);
    setTimeLeft(time);
  }, [timeUntilVotingStarts, timeUntilVotingEnds, votingStartTime, votingEndTime]);

  const refreshData = useCallback(() => {
    console.log(`${logPrefix} Manual refresh triggered`);
    setRefreshKey((prev) => prev + 1);
  }, []);

  console.log(`${logPrefix} Hook rendered with refreshKey:`, _refreshKey);

  return {
    topic: topicData ? decodeBytes32String(topicData as string) : "",
    isTopicLoading,
    topicError,
    admin,
    proposals,
    votingStats,
    winnerName: winnerNameData ? decodeBytes32String(winnerNameData as string) : "",
    votingActive,
    isVotingFinalized,
    timeLeft,
    refreshData,
  };
}
