import { Card } from "./Card";

interface AdminControlsProps {
  votingActive: boolean;
  newVoterAddress: string;
  setNewVoterAddress: (address: string) => void;
  newProposalName: string;
  setNewProposalName: (name: string) => void;
  writeLoading: boolean;
  handleRegisterVoter: () => void;
  handleAddProposal: () => void;
}

export default function AdminControls({
  votingActive,
  newVoterAddress,
  setNewVoterAddress,
  newProposalName,
  setNewProposalName,
  writeLoading,
  handleRegisterVoter,
  handleAddProposal,
}: AdminControlsProps) {
  return (
    <Card>
      <h2 className="mb-4 text-xl font-semibold">Admin Controls</h2>

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
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
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
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {writeLoading ? "Adding..." : "Add Proposal"}
          </button>
        </div>
        {Boolean(votingActive) && (
          <p className="mt-1 text-sm text-red-500">Cannot add proposals after voting has started</p>
        )}
      </div>
    </Card>
  );
}
