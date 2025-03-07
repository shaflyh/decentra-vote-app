import { useAccount, useReadContract } from "wagmi";

import { DecentraVoteABI, CONTRACT_ADDRESS } from "../config/constants";
import { VoterInfo } from "../types/proposal";

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

  console.log("voterInfo");
  console.log(voterInfo);

  const isAdmin = address && admin && address.toLowerCase() === (admin as string).toLowerCase();
  const hasVoted = voterInfo ? voterInfo[0] : false;
  const votedFor = hasVoted && voterInfo ? Number(voterInfo[1]) : -1;

  return {
    address,
    isAdmin,
    hasVoted,
    votedFor,
  };
}
