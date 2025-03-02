interface Proposal {
  name: string;
}

interface UserStatusProps {
  isAdmin: boolean | "" | undefined;
  isRegistered: boolean;
  hasVoted: boolean;
  votedFor: number;
  proposals: Proposal[];
}

export default function UserStatus({
  isAdmin,
  isRegistered,
  hasVoted,
  votedFor,
  proposals,
}: UserStatusProps) {
  return (
    <div className="p-4 mb-4 rounded-lg bg-gray-50">
      <h2 className="mb-2 text-xl font-semibold">Your Status</h2>
      <p className="mb-1">
        <span className="font-medium">Role:</span> {isAdmin ? "Admin" : "Voter"}
      </p>
      <p className="mb-1">
        <span className="font-medium">Registration:</span>{" "}
        {isRegistered ? "Registered" : "Not Registered"}
      </p>
      <p className="mb-1">
        <span className="font-medium">Voting Status:</span> {hasVoted ? "Voted" : "Not Voted"}
      </p>
      {hasVoted && votedFor >= 0 && proposals && proposals[votedFor] && (
        <p className="mb-1">
          <span className="font-medium">Voted For:</span> {proposals[votedFor].name}
        </p>
      )}
    </div>
  );
}
