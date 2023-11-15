import { ethers } from "ethers";
import React, { useState } from "react";

const CommitBid = ({ state }) => {
  const [bidAmount, setBidAmount] = useState(""); // State to manage bid amount

  const commitBid = async (event) => {
    event.preventDefault();

    const { contract } = state;
    const commitment = ethers.utils.keccak256(bidAmount);

    // Perform the commitBid transaction
    const transaction = await contract.commitBid(commitment, {
      value: ethers.utils.parseEther(bidAmount),
    });

    await transaction.wait();

    alert("Bid committed successfully");
    setBidAmount("0.01"); // Clear the bid amount after successful bid
  };

  return (
    <div className="center">
      <h2>Commit Bid</h2>
      <form onSubmit={commitBid}>
        <div className="inputbox">
          <input
            type="text"
            required="required"
            id="bidAmount"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
          />
          <span>Bid Amount (ETH)</span>
        </div>
        <div className="inputbox">
          <input type="submit" value="Commit Bid" disabled={!state.contract} />
        </div>
      </form>
    </div>
  );
};

export default CommitBid;
