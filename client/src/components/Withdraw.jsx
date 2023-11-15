import { ethers } from "ethers";
import React from "react";


const Withdraw = ({ state }) => {
  const withdraw = async (event) => {
    event.preventDefault();

    const { contract } = state;

    // Perform the withdraw transaction
    const transaction = await contract.withdraw();

    await transaction.wait();

    alert("Withdrawal successful");
  };

  return (
    <div className="center">
      <h3>Withdraw Funds</h3>
      <form onSubmit={withdraw}>
        <div className="inputbox">
          <input
            type="submit"
            value="Withdraw Funds"
            disabled={!state.contract}
          />
        </div>
      </form>
    </div>
  );
};

export default Withdraw;
