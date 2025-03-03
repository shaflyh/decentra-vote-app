import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { toast } from "react-toastify";

import merkleData from "../config/merkle-data.json";
import { verifyProof } from "../utils/merkleTree";

interface MerkleData {
  root: string;
  addresses: string[];
  totalAddresses: number;
  proofs: Record<string, string[]>;
}

const data: MerkleData = merkleData;

export default function VerifyVoter() {
  const { address, isConnected } = useAccount();
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  useEffect(() => {
    if (!isConnected || !address) {
      setIsVerified(null);
      return;
    }

    const lowerCaseAddress = address.toLowerCase();
    const proof: string[] = data.proofs[lowerCaseAddress] ?? [];

    if (proof.length > 0) {
      const isValid = verifyProof(merkleData.root, lowerCaseAddress, proof);
      setIsVerified(isValid);

      if (isValid) {
        toast.success("You're verified! You can now cast your vote.", {
          toastId: "verified",
        });
      } else {
        toast.error("Your wallet address is not eligible to vote.", {
          toastId: "not-verified",
        });
      }
    } else {
      setIsVerified(false);
      toast.error("Your address is not on the registered voter list.", { toastId: "not-in-list" });
    }
  }, [address, isConnected]);

  return (
    <div className="p-4 mt-4 mb-12 text-center bg-white rounded-lg shadow">
      {isConnected ? (
        isVerified === null ? (
          <p>🔄 Verifying your wallet...</p>
        ) : isVerified ? (
          <p className="text-green-600">
            🎉 You're verified! Select your candidate and cast your vote.
          </p>
        ) : (
          <p className="text-red-600">❌ Sorry, your wallet address is not eligible to vote.</p>
        )
      ) : (
        <>
          <h3 className="mb-2 text-xl font-semibold">Voter Authentication</h3>
          <p>🔌 Connect your wallet to check your eligibility.</p>
        </>
      )}
    </div>
  );
}
