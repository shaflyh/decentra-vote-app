import { Proposal } from "../types/proposal";

interface VoteStatusProps {
  proposals: Proposal[];
}

export default function VoteStatus({ proposals }: VoteStatusProps) {
  return (
    <div className="mt-8 mb-8">
      {proposals && proposals.length > 0 ? (
        <div className="grid gap-4">
          {proposals.map((proposal, index) => (
            <div key={index} className={`p-4 border rounded-lg ${"border-gray-200"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{proposal.name}</h3>
                </div>
                <p>Votes: {proposal.voteCount}</p>
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
