import { TotalAddress } from "../config/constants";
import { VotingStats, VotingTime } from "../types/proposal";

interface VotingInfoProps {
  topic: string;
  isTopicLoading: boolean;
  votingStats: VotingStats;
  winnerName: string | null;
  votingActive: boolean;
  votingTime?: VotingTime;
}

export default function VotingInfo({
  topic,
  isTopicLoading,
  votingStats,
  winnerName,
  votingActive,
  votingTime,
}: VotingInfoProps) {
  return (
    <div className="p-4 mb-8 rounded-lg bg-gray-50">
      <h2 className="mb-2 text-xl font-semibold">Voting Information</h2>
      <p className="mb-1">
        <span className="font-medium">Topic:</span>{" "}
        {isTopicLoading ? "Loading..." : topic || "Error fetching topic"}
      </p>
      <p className="mb-1">
        <span className="font-medium">Status:</span> {votingActive ? "Active" : "Inactive"}
      </p>
      <p className="mb-1">
        <span className="font-medium">Start:</span> {votingTime?.start}
      </p>
      <p className="mb-1">
        <span className="font-medium">End:</span> {votingTime?.end}
      </p>
      <p className="mb-1">
        <span className="font-medium">Time Left:</span> {votingTime?.untilEnd}
      </p>
      {votingTime?.untilStart != "0" && (
        <p className="mb-1">
          <span className="font-medium">Time to Start:</span> {votingTime?.untilStart}
        </p>
      )}
      <p className="mb-1">
        <span className="font-medium">Registered Voters: </span>
        {TotalAddress}
      </p>
      <p className="mb-1">
        <span className="font-medium">Total Votes Cast:</span>{" "}
        {votingStats ? votingStats[0].toString() : "0"}
      </p>
      {winnerName && Number(votingStats?.[0] || 0) > 0 && (
        <p className="mb-1">
          <span className="font-medium">Current Winner:</span> {winnerName}
        </p>
      )}
    </div>
  );
}
