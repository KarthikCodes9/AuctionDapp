import { ethers } from "ethers";
import React, { useState } from "react";

const RevealBid = ({ state }) => {
  const [revealedValue, setRevealedValue] = useState(""); // State to manage revealed value

  const revealBid = async (event) => {
    event.preventDefault();

    const { contract } = state;

    // Perform the revealBid transaction
    const transaction = await contract.revealBid(revealedValue);

    await transaction.wait();

    alert("Bid revealed successfully");
    setRevealedValue(""); // Clear the revealed value after successful reveal
  };

  return (
    <div className="center">
      <h3>Reveal Bid</h3>
      <form onSubmit={revealBid}>
        <div className="inputbox">
          <input
            type="text"
            required="required"
            id="revealedValue"
            value={revealedValue}
            onChange={(e) => setRevealedValue(e.target.value)}
          />
          <span>Revealed Value</span>
        </div>
        <div className="inputbox">
          <input type="submit" value="Reveal Bid" disabled={!state.contract} />
        </div>
      </form>
    </div>
  );
};

export default RevealBid;
