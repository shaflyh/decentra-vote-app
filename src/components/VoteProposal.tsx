import { useState } from "react";

interface Proposal {
  name: string;
  voteCount: number;
}

interface ProposalListProps {
  proposals: Proposal[];
  hasVoted: boolean;
  votedFor: number;
  handleVote: (index: number) => void;
}

export default function VoteProposal({
  proposals,
  hasVoted,
  votedFor,
  handleVote,
}: ProposalListProps) {
  // Track the user’s current selection
  const [selectedCandidateIndex, setSelectedCandidateIndex] = useState<number | null>(null);

  // Helper to determine the card style
  function getCardClasses(index: number) {
    // If the user has voted, highlight the card they voted for in green
    if (hasVoted && votedFor === index) {
      return "border-green-500 bg-green-50 cursor-default";
    }
    // If the user hasn’t voted yet, highlight the currently selected card in blue
    if (!hasVoted && selectedCandidateIndex === index) {
      return "border-blue-500 bg-blue-50";
    }
    // Default card style
    return "border-gray-200";
  }

  // Determine if the card is clickable
  function isCardClickable() {
    return !hasVoted;
  }

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold ">Candidate</h2>

      {proposals && proposals.length > 0 ? (
        <div className="grid gap-4">
          {proposals.map((proposal, index) => (
            <div
              key={index}
              onClick={() => {
                // Only allow selection if voting is active and user hasn’t voted yet
                if (isCardClickable()) {
                  setSelectedCandidateIndex(index);
                }
              }}
              className={`p-4 border rounded-lg transition-shadow ${
                isCardClickable() ? "cursor-pointer hover:shadow-md" : ""
              } ${getCardClasses(index)}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{proposal.name}</h3>
                </div>

                {/* Show “Your Vote” if the user has already voted for this candidate */}
                {hasVoted && votedFor === index && (
                  <span className="inline-block px-2 py-1 text-sm text-white bg-green-500 rounded">
                    Your Vote
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No proposals available</p>
      )}

      {/* Single Vote Button at the bottom */}
      {!hasVoted && (
        <button
          className="px-6 py-2 mt-6 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed"
          onClick={() => {
            if (selectedCandidateIndex !== null) {
              handleVote(selectedCandidateIndex);
            }
          }}
          disabled={selectedCandidateIndex === null}
        >
          Cast Vote
        </button>
      )}
    </div>
  );
}
