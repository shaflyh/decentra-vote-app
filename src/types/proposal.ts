export type Proposal = {
  name: string;
  voteCount: number;
};

export type VotingStats = [bigint, bigint, boolean] & {
  totalVotes: bigint;
  registeredVoters: bigint;
  votingActive: boolean;
};

export type TimeLeft = {
  start: string;
  end: string;
};
