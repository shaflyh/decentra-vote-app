import { useAccount, useReadContract } from "wagmi";

import contract from "../contract/DecentraVote.json";

const DecentraVoteABI = contract.abi;
const CONTRACT_ADDRESS = "0x4748a49AEaFCe1c5Ead917C4b2979B048FAE8E38";

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
