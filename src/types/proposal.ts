export type Proposal = {
  name: string;
  voteCount: number;
};

export type VotingStats = [bigint, bigint, boolean] & {
  totalVotes: bigint;
  registeredVoters: bigint;
  votingActive: boolean;
};

export type VotingTime = {
  start: string;
  end: string;
  untilStart: string;
  untilEnd: string;
};

export type VoterInfo = [boolean, bigint] & {
  hasVoted: boolean;
  voteIndex: bigint;
};
