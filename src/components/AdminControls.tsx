import { useState } from "react";
import { toast } from "react-toastify";

import { Card } from "./Card";

interface AdminControlsProps {
  votingActive: boolean;
  newProposalName: string;
  setNewProposalName: (name: string) => void;
  writeLoading: boolean;
  handleAddProposal: () => void;
  handleFinalizeVoting: () => void;
  handlePauseVoting: () => void;
  handleUnpauseVoting: () => void;
  handleUpdateMerkleRoot: (newRoot: string) => void;
  handleUpdateProposalName: (index: number, newName: string) => void;
  handleRemoveProposal: (index: number) => void;
}

export default function AdminControls({
  votingActive,
  newProposalName,
  setNewProposalName,
  writeLoading,
  handleAddProposal,
  handleFinalizeVoting,
  handlePauseVoting,
  handleUnpauseVoting,
  handleUpdateMerkleRoot,
  handleUpdateProposalName,
  handleRemoveProposal,
}: AdminControlsProps) {
  // Local states for additional admin actions
  const [updateMerkleRootInput, setUpdateMerkleRootInput] = useState("");
  const [updateProposalIndex, setUpdateProposalIndex] = useState("");
  const [updateProposalNewName, setUpdateProposalNewName] = useState("");
  const [removeProposalIndex, setRemoveProposalIndex] = useState("");

  const onUpdateMerkleRoot = () => {
    handleUpdateMerkleRoot(updateMerkleRootInput);
    setUpdateMerkleRootInput("");
  };

  const onUpdateProposalName = () => {
    const index = parseInt(updateProposalIndex, 10);
    if (isNaN(index)) {
      return toast.error("Invalid proposal index");
    }
    handleUpdateProposalName(index, updateProposalNewName);
    setUpdateProposalIndex("");
    setUpdateProposalNewName("");
  };

  const onRemoveProposal = () => {
    const index = parseInt(removeProposalIndex, 10);
    if (isNaN(index)) {
      return toast.error("Invalid proposal index");
    }
    handleRemoveProposal(index);
    setRemoveProposalIndex("");
  };

  return (
    <Card>
      <h2 className="mb-4 text-xl font-semibold">Admin Controls</h2>

      {/* Add Proposal Section */}
      <div className="mb-6">
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
            disabled={writeLoading || votingActive}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {writeLoading ? "Processing..." : "Add Proposal"}
          </button>
        </div>
        {votingActive && (
          <p className="mt-1 text-sm text-red-500">Cannot add proposals after voting has started</p>
        )}
      </div>

      {/* Finalize Voting Section */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Finalize Voting</h3>
        <button
          onClick={handleFinalizeVoting}
          disabled={writeLoading}
          className="px-4 py-2 text-white bg-green-600 rounded hover:bg-green-700"
        >
          {writeLoading ? "Processing..." : "Finalize Voting"}
        </button>
      </div>

      {/* Pause/Unpause Voting Section */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Pause/Unpause Voting</h3>
        <div className="flex justify-center space-x-2">
          <button
            onClick={handlePauseVoting}
            disabled={writeLoading}
            className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          >
            {writeLoading ? "Processing..." : "Pause Voting"}
          </button>
          <button
            onClick={handleUnpauseVoting}
            disabled={writeLoading}
            className="px-4 py-2 text-white bg-yellow-600 rounded hover:bg-yellow-700"
          >
            {writeLoading ? "Processing..." : "Unpause Voting"}
          </button>
        </div>
      </div>

      {/* Update Merkle Root Section */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Update Merkle Root</h3>
        <div className="flex space-x-2">
          <input
            type="text"
            value={updateMerkleRootInput}
            onChange={(e) => setUpdateMerkleRootInput(e.target.value)}
            placeholder="New Merkle Root"
            className="flex-1 p-2 border rounded"
          />
          <button
            onClick={onUpdateMerkleRoot}
            disabled={writeLoading || votingActive}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {writeLoading ? "Processing..." : "Update Merkle Root"}
          </button>
        </div>
        {votingActive && (
          <p className="mt-1 text-sm text-red-500">
            Cannot update Merkle root after voting has started
          </p>
        )}
      </div>

      {/* Update Proposal Name Section */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Update Proposal Name</h3>
        <div className="flex mb-2 space-x-2">
          <input
            type="text"
            value={updateProposalIndex}
            onChange={(e) => setUpdateProposalIndex(e.target.value)}
            placeholder="Proposal Index"
            className="w-1/4 p-2 border rounded"
          />
          <input
            type="text"
            value={updateProposalNewName}
            onChange={(e) => setUpdateProposalNewName(e.target.value)}
            placeholder="New Proposal Name"
            className="flex-1 p-2 border rounded"
          />
        </div>
        <button
          onClick={onUpdateProposalName}
          disabled={writeLoading || votingActive}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {writeLoading ? "Processing..." : "Update Proposal Name"}
        </button>
        {votingActive && (
          <p className="mt-1 text-sm text-red-500">
            Cannot update proposal after voting has started
          </p>
        )}
      </div>

      {/* Remove Proposal Section */}
      <div className="mb-6">
        <h3 className="mb-2 font-medium">Remove Proposal</h3>
        <div className="flex mb-2 space-x-2">
          <input
            type="text"
            value={removeProposalIndex}
            onChange={(e) => setRemoveProposalIndex(e.target.value)}
            placeholder="Proposal Index"
            className="flex-1 p-2 border rounded"
          />
        </div>
        <button
          onClick={onRemoveProposal}
          disabled={writeLoading || votingActive}
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          {writeLoading ? "Processing..." : "Remove Proposal"}
        </button>
        {votingActive && (
          <p className="mt-1 text-sm text-red-500">
            Cannot remove proposal after voting has started
          </p>
        )}
      </div>
    </Card>
  );
}
