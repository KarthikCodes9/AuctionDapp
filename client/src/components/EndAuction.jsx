import { ethers } from "ethers";
import React from "react";
const EndAuction = ({ state }) => {
  const endAuction = async (event) => {
    event.preventDefault();

    const { contract } = state;

    // Perform the endAuction transaction
    const transaction = await contract.endAuction();

    await transaction.wait();

    alert("Auction ended successfully");
  };

  return (
    <div className="center">
      <h3>End Auction</h3>
      <form onSubmit={endAuction}>
        <div className="inputbox">
          <input type="submit" value="End Auction" disabled={!state.contract} />
        </div>
      </form>
    </div>
  );
};

export default EndAuction;
