import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useVoter } from "./hooks/useVoter";
import { useVoting } from "./hooks/useVoting";
import { useVotingActions } from "./hooks/useVotingActions";
import VotingInfo from "./components/VotingInfo";
import ProposalList from "./components/ProposalList";
import AdminControls from "./components/AdminControls";
import UserStatus from "./components/UseStatus";

export default function App() {
  const { isConnected } = useAccount();

  const {
    topic,
    isTopicLoading,
    admin,
    proposals,
    votingStats,
    winnerName,
    votingActive,
    timeLeft,
    refreshData,
  } = useVoting();

  const { isAdmin, isRegistered, hasVoted, votedFor } = useVoter(admin as string);

  const votingActions = useVotingActions(refreshData);

  return (
    <div className="flex flex-col w-full min-h-screen p-6 bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="w-full p-8 text-center bg-white rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-center">DecentraVote</h1>
        <div className="flex items-center justify-center w-full">
          <ConnectButton showBalance={false} />
        </div>
        {isConnected ? (
          <div className="grid grid-cols-1 gap-8 mt-8 lg:grid-cols-2">
            <div className="flex flex-col gap-6 p-6 rounded-lg shadow bg-gray-50">
              <VotingInfo
                topic={topic}
                isTopicLoading={isTopicLoading}
                votingStats={votingStats}
                winnerName={winnerName}
                votingActive={votingActive}
                timeLeft={timeLeft}
              />
              <UserStatus
                isAdmin={isAdmin}
                isRegistered={isRegistered}
                hasVoted={hasVoted}
                votedFor={votedFor}
                proposals={proposals}
              />
            </div>
            <div className="flex flex-col gap-6 p-6 rounded-lg shadow bg-gray-50">
              {isAdmin && <AdminControls votingActive={votingActive} {...votingActions} />}
              <ProposalList
                proposals={proposals}
                isRegistered={isRegistered}
                hasVoted={hasVoted}
                votingActive={votingActive}
                votedFor={votedFor}
                handleVote={votingActions.handleVote}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="mb-4 text-lg">
              Please connect your wallet to interact with the DecentraVote contract
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
