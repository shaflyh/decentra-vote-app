import { TotalAddress } from "../config/constants";
import { VotingStats, VotingTime } from "../types/proposal";

import { Card } from "./Card";

interface VotingInfoProps {
  topic: string;
  isTopicLoading: boolean;
  votingStats: VotingStats;
  winnerName: string | null;
  votingActive: boolean;
  votingTime?: VotingTime;
}

export default function VotingInfo({
  votingStats,
  winnerName,
  votingActive,
  votingTime,
}: VotingInfoProps) {
  return (
    <Card>
      {/* Header */}
      <div className="flex flex-col mb-6 sm:items-center sm:justify-between">
        <div>
          <h1 className="mb-1 text-2xl font-bold">Vote Information</h1>
          <div
            className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
              votingActive ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
            }`}
          >
            {votingActive ? "Active" : "Inactive"}
          </div>
        </div>
        {/* Status badge */}
      </div>

      {/* Grid layout for stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Start Time */}
        <div className="p-4 rounded-lg bg-blue-50">
          <h2 className="mb-1 font-semibold text-blue-700">Start Time</h2>
          <p className="text-gray-800">{votingTime?.start || "N/A"}</p>
        </div>

        {/* End Time */}
        <div className="p-4 rounded-lg bg-blue-50">
          <h2 className="mb-1 font-semibold text-blue-700">End Time</h2>
          <p className="text-gray-800">{votingTime?.end || "N/A"}</p>
        </div>

        {/* Time Left */}
        <div className="p-4 rounded-lg bg-blue-50">
          <h2 className="mb-1 font-semibold text-blue-700">Time Left</h2>
          <p className="text-gray-800">{votingTime?.untilEnd || "N/A"}</p>
        </div>

        {/* Time to Start (conditionally rendered) */}
        {votingTime?.untilStart !== "0" && (
          <div className="p-4 rounded-lg bg-blue-50">
            <h2 className="mb-1 font-semibold text-blue-700">Time to Start</h2>
            <p className="text-gray-800">{votingTime?.untilStart}</p>
          </div>
        )}

        {/* Registered Voters */}
        <div className="p-4 rounded-lg bg-blue-50">
          <h2 className="mb-1 font-semibold text-blue-700">Registered Voters</h2>
          <p className="text-gray-800">{TotalAddress}</p>
        </div>

        {/* Total Votes Cast */}
        <div className="p-4 rounded-lg bg-blue-50">
          <h2 className="mb-1 font-semibold text-blue-700">Total Votes Cast</h2>
          <p className="text-gray-800">{votingStats ? votingStats[0].toString() : "0"}</p>
        </div>

        {/* Current Winner (conditionally rendered) */}
        {winnerName && Number(votingStats?.[0] || 0) > 0 && (
          <div className="p-4 rounded-lg bg-blue-50 sm:col-span-2">
            <h2 className="mb-1 font-semibold text-blue-700">Current Winner</h2>
            <p className="text-gray-800">{winnerName}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
