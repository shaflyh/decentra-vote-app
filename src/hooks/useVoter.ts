import { useAccount, useReadContract } from "wagmi";

import { DecentraVoteABI, CONTRACT_ADDRESS } from "../config/constants";

export type VoterInfo = [boolean, boolean, bigint] & {
  isRegistered: boolean;
  hasVoted: boolean;
  voteIndex: bigint;
};

export function useVoter(admin: string | undefined) {
  const { address } = useAccount();

  const { data: voterInfo } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: DecentraVoteABI,
    functionName: "getVoterInfo",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  }) as { data: VoterInfo };

  const isAdmin = address && admin && address.toLowerCase() === (admin as string).toLowerCase();
  const isRegistered = voterInfo ? voterInfo[0] : false;
  const hasVoted = voterInfo ? voterInfo[1] : false;
  const votedFor = hasVoted && voterInfo ? Number(voterInfo[2]) : -1;

  return {
    address,
    isAdmin,
    isRegistered,
    hasVoted,
    votedFor,
  };
}
