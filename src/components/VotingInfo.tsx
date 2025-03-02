import { VotingStats } from "../hooks/useVoting";

interface VotingInfoProps {
  topic: string;
  isTopicLoading: boolean;
  votingStats: VotingStats;
  winnerName: string | null;
  votingActive: boolean;
  timeLeft: { start: string; end: string };
}

export default function VotingInfo({
  topic,
  isTopicLoading,
  votingStats,
  winnerName,
  votingActive,
  timeLeft,
}: VotingInfoProps) {
  return (
    <div className="p-4 mb-8 rounded-lg bg-gray-50">
      <h2 className="mb-2 text-xl font-semibold text-indigo-600">Voting Information</h2>
      <p className="mb-1">
        <span className="font-medium">Topic:</span>{" "}
        {isTopicLoading ? "Loading..." : topic || "Error fetching topic"}
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
      {winnerName && Number(votingStats?.[0] || 0) > 0 && (
        <p className="mb-1">
          <span className="font-medium">Current Winner:</span> {winnerName}
        </p>
      )}
    </div>
  );
}
