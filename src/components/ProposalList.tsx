interface Proposal {
  name: string;
  voteCount: number;
}

interface ProposalListProps {
  proposals: Proposal[];
  isRegistered: boolean;
  hasVoted: boolean;
  votingActive: boolean;
  votedFor: number;
  handleVote: (index: number) => void;
}

export default function ProposalList({
  proposals,
  isRegistered,
  hasVoted,
  votingActive,
  votedFor,
  handleVote,
}: ProposalListProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-4 text-xl font-semibold">Proposals</h2>
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
                      onClick={() => handleVote(index)}
                      disabled={false}
                      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
                    >
                      Vote
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
  );
}
