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
import VoteStatus from "./components/VoteStatus";
import VerifyVoter from "./components/VerifyVoter";

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

  const { isAdmin, hasVoted, votedFor } = useVoter(admin as string);

  const votingActions = useVotingActions(refreshData);

  return (
    <div className="flex flex-col w-full min-h-screen p-6 bg-gray-100">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="w-full p-8 text-center bg-white rounded-lg shadow-xl">
        <h1 className="mb-1 text-4xl font-bold text-center">{topic}</h1>
        <div className="mb-4 text-gray-400">DecentraVote by Muhammad Shafly Hamzah</div>
        <div className="flex items-center justify-center w-full">
          <ConnectButton showBalance={false} />
        </div>
        <VerifyVoter></VerifyVoter>
        <div className="flex justify-between w-full gap-x-4">
          <div className="flex-1">
            <div className="max-w-3xl p-6 mx-auto my-8 bg-white border border-blue-100 shadow-md rounded-xl">
              <VoteStatus proposals={proposals} />
              {isConnected && votingActions.proof.length > 0 && (
                <div className="gap-8 mt-8 lg:grid-cols-2">
                  <div className="">
                    {isAdmin && <AdminControls votingActive={votingActive} {...votingActions} />}
                    <ProposalList
                      proposals={proposals}
                      hasVoted={hasVoted}
                      votingActive={votingActive}
                      votedFor={votedFor}
                      handleVote={votingActions.handleVote}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <VotingInfo
              topic={topic}
              isTopicLoading={isTopicLoading}
              votingStats={votingStats}
              winnerName={winnerName}
              votingActive={votingActive}
              votingTime={timeLeft}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
