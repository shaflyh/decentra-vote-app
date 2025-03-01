import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
  useTransaction,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { encodeBytes32String, decodeBytes32String } from "ethers";
import { toast, ToastContainer } from "react-toastify";

import contract from "./contract/DecentraVote.json";
import "react-toastify/dist/ReactToastify.css";

const DecentraVoteABI = contract.abi;
const CONTRACT_ADDRESS = "0x4748a49AEaFCe1c5Ead917C4b2979B048FAE8E38";
// Define types for better TypeScript support
type VoterInfo = [boolean, boolean, bigint] & {
  isRegistered: boolean;
  hasVoted: boolean;
  voteIndex: bigint;
};

type VotingStats = [bigint, bigint, boolean] & {
  totalVotes: bigint;
  registeredVoters: bigint;
  votingActive: boolean;
};

type Proposal = {
  name: string;
  voteCount: number;
};

export default function App() {
  const { address, isConnected } = useAccount();

  // State for UI
  const [newVoterAddress, setNewVoterAddress] = useState("");
  const [newProposalName, setNewProposalName] = useState("");
  const [selectedProposal, setSelectedProposal] = useState(0);
  const [timeLeft, setTimeLeft] = useState<{ start: string; end: string }>({ start: "", end: "" });
  const [_refreshKey, setRefreshKey] = useState(0);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  // Contract write state
  const { writeContract, isPending: writeLoading, data: writeData } = useWriteContract();

  // Transaction state
  const { isSuccess: txSuccess } = useTransaction({
    hash: writeData,
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

  // Debugging logs
  console.log("✅ Fetching topic...");
  console.log("📌 topicData:", topicData);
  console.log("⚠️ topicError:", topicError);

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

  const { data: voterInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "getVoterInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: VoterInfo };

  const { data: votingActiveData } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "isVotingActive",
  });

  const votingActive = Boolean(votingActiveData);

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

  // Handle success effects
  useEffect(() => {
    if (txSuccess) {
      toast.success("Transaction successful!");
      setNewVoterAddress("");
      setNewProposalName("");
      setRefreshKey((prev) => prev + 1);
    }
  }, [txSuccess]);

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
  const handleVote = () => {
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: DecentraVoteABI,
      functionName: "castVote",
      args: [BigInt(selectedProposal)],
    });
  };

  const isAdmin = address && admin && address.toLowerCase() === (admin as string).toLowerCase();
  const isRegistered = voterInfo ? voterInfo[0] : false;
  const hasVoted = voterInfo ? voterInfo[1] : false;
  const votedFor = hasVoted && voterInfo ? Number(voterInfo[2]) : -1;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="max-w-4xl p-6 mx-auto bg-white rounded-lg shadow">
        <h1 className="mb-6 text-3xl font-bold text-center text-indigo-700">DecentraVote</h1>

        <div className="flex justify-end mb-6">
          <ConnectButton />
        </div>

        {isConnected ? (
          <>
            <div className="p-4 mb-8 rounded-lg bg-gray-50">
              <h2 className="mb-2 text-xl font-semibold text-indigo-600">Voting Information</h2>
              <p className="mb-1">
                <span className="font-medium">Topic:</span>{" "}
                {isTopicLoading
                  ? "Loading..."
                  : decodeBytes32String(topicData as string) || "Error fetching topic"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Status:</span> {votingActive ? "Active" : "Inactive"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Start:</span>{" "}
                {timeLeft.start === "now" ? "Started" : `Starts in ${timeLeft.start}`}
              </p>
              <p className="mb-1">
                <span className="font-medium">End:</span>{" "}
                {timeLeft.end === "now" ? "Ended" : `Ends in ${timeLeft.end}`}
              </p>
              <p className="mb-1">
                <span className="font-medium">Registered Voters:</span>{" "}
                {votingStats ? votingStats[1].toString() : "0"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Total Votes Cast:</span>{" "}
                {votingStats ? votingStats[0].toString() : "0"}
              </p>
              {(winnerNameData as string) && Number(votingStats?.[0] || 0) > 0 && (
                <p className="mb-1">
                  <span className="font-medium">Current Winner:</span>{" "}
                  {decodeBytes32String(winnerNameData as string)}
                </p>
              )}
            </div>

            {isAdmin && (
              <div className="p-4 mb-8 border border-indigo-200 rounded-lg bg-indigo-50">
                <h2 className="mb-4 text-xl font-semibold text-indigo-700">Admin Controls</h2>

                <div className="mb-4">
                  <h3 className="mb-2 font-medium">Register Voter</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newVoterAddress}
                      onChange={(e) => setNewVoterAddress(e.target.value)}
                      placeholder="Voter Address (0x...)"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={handleRegisterVoter}
                      disabled={writeLoading}
                      className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
                    >
                      {writeLoading ? "Registering..." : "Register"}
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 font-medium">Add Proposal</h3>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newProposalName}
                      onChange={(e) => setNewProposalName(e.target.value)}
                      placeholder="Proposal Name"
                      className="flex-1 p-2 border rounded"
                    />
                    <button
                      onClick={handleAddProposal}
                      disabled={writeLoading || Boolean(votingActive)}
                      className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
                    >
                      {writeLoading ? "Adding..." : "Add Proposal"}
                    </button>
                  </div>
                  {Boolean(votingActive) && (
                    <p className="mt-1 text-sm text-red-500">
                      Cannot add proposals after voting has started
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-indigo-600">Proposals</h2>
              {proposals && proposals.length > 0 ? (
                <div className="grid gap-4">
                  {proposals.map((proposal, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg ${
                        votedFor === index ? "border-green-500 bg-green-50" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{proposal.name}</h3>
                          <p>Votes: {proposal.voteCount}</p>
                        </div>
                        <div>
                          {isRegistered && !hasVoted && votingActive && (
                            <button
                              onClick={() => {
                                setSelectedProposal(index);
                                handleVote();
                              }}
                              disabled={writeLoading}
                              className="px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 disabled:bg-indigo-300"
                            >
                              {writeLoading ? "Voting..." : "Vote"}
                            </button>
                          )}
                          {votedFor === index && (
                            <span className="inline-block px-2 py-1 text-sm text-white bg-green-500 rounded">
                              Your Vote
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No proposals available</p>
              )}
            </div>

            <div className="p-4 mb-4 rounded-lg bg-gray-50">
              <h2 className="mb-2 text-xl font-semibold text-indigo-600">Your Status</h2>
              <p className="mb-1">
                <span className="font-medium">Role:</span> {isAdmin ? "Admin" : "Voter"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Registration:</span>{" "}
                {isRegistered ? "Registered" : "Not Registered"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Voting Status:</span>{" "}
                {hasVoted ? "Voted" : "Not Voted"}
              </p>
              {hasVoted && votedFor >= 0 && proposals && proposals[votedFor] && (
                <p className="mb-1">
                  <span className="font-medium">Voted For:</span> {proposals[votedFor].name}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="py-10 text-center">
            <p className="mb-4 text-lg">
              Please connect your wallet to interact with the DecentraVote contract
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
