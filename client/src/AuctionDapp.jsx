import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./abi/Auction_Contract.json";
import "./AuctionDapp.css";

const { ethereum } = window;

const AuctionDapp = () => {
  const [bidAmount, setBidAmount] = useState("");
  const [revealedValue, setRevealedValue] = useState("");
  const [winnerAddress, setWinnerAddress] = useState("");
  const [winningBid, setWinningBid] = useState("");
  const [reservePrice, setReservePrice] = useState("");
  const [bidders, setBidders] = useState([]);

  const contractAddress = "0xC738a7FAAD844fDB2C410fC25515F25236331cea";
  const contractAbi = abi.abi;
  let auctionContract;
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please install MetaMask.");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      //setCurrentAccount(accounts[0]);
      //window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };
  if (ethereum) {
    connectWallet();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    auctionContract = new ethers.Contract(contractAddress, contractAbi, signer);
  } else alert("Please intsall metamask!");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reserve = await auctionContract.reservePrice();
        setReservePrice(ethers.utils.formatEther(reserve));
        const winner = await auctionContract.winningBidderAddress();
        const bid = await auctionContract.winningBid();
        setWinnerAddress(winner);
        setWinningBid(ethers.utils.formatEther(bid));

        // Fetch all bidders and their respective bids
        //     const bidCount = await auctionContract.bidsLength();
        //     const bids = [];
        //     for (let i = 0; i < bidCount; i++) {
        //       const bidInfo = await auctionContract.bids(i);
        //       bids.push({
        //         bidder: bidInfo.bidder,
        //         bidAmount: ethers.utils.formatEther(bidInfo.revealedValue),
        //       });
        //     }
            // setBidders(bids);
          } catch (error) {
            console.error("Error fetching data:", error.message);
          }
        };

    fetchData();
  }, []);
  function stringToBytes32(str) {
    // Ensure the string is 32 bytes by padding with zeros
    const paddedStr = ethers.utils.formatBytes32String(str);

    return paddedStr;
}

  const commitBid = async () => {
    try {
      // Ensure bidAmount is a non-empty string representing a valid number
    //   if (!bidAmount || isNaN(parseFloat(bidAmount))) {
    //     alert("Please enter a valid bid amount.");
    //     return;
    //   }
  console.log(typeof(bidAmount));
      // Check if bid amount is greater than the current reserve price
      if (parseFloat(bidAmount) > parseFloat(reservePrice)) {
        const transaction = await auctionContract.commitBid(stringToBytes32(bidAmount));
        await transaction.wait();
        alert("Bid committed successfully");
        setBidAmount("");
      } else {
        alert("Bid amount must be greater than the reserve price");
      }
    } catch (error) {
      console.error("Error committing bid:", error.message);
    }
  };

  const revealBid = async () => {
    try {
      const transaction = await auctionContract.revealBid(revealedValue);
      await transaction.wait();
      alert("Bid revealed successfully");
      setRevealedValue("");
    } catch (error) {
      console.error("Error revealing bid:", error.message);
    }
  };

  const endAuction = async () => {
    try {
      const transaction = await auctionContract.endAuction();
      await transaction.wait();
      alert("Auction ended successfully");
    } catch (error) {
      console.error("Error ending auction:", error.message);
    }
  };

  const withdraw = async () => {
    try {
      const transaction = await auctionContract.withdraw();
      await transaction.wait();
      alert("Withdrawal successful");
    } catch (error) {
      console.error("Error withdrawing funds:", error.message);
    }
  };

  return (
    <div className="container">
      <h1>Auction Dapp</h1>

      <div>
        <h2>Reserve Price: {reservePrice} ETH</h2>
      </div>

      <div>
        <h2>Commit Bid</h2>
        <input
          type="text"
          placeholder="Bid Amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
        />
        <button onClick={commitBid}>Commit Bid</button>
      </div>

      <div>
        <h2>Reveal Bid</h2>
        <input
          type="text"
          placeholder="Revealed Value"
          value={revealedValue}
          onChange={(e) => setRevealedValue(e.target.value)}
        />
        <button onClick={revealBid}>Reveal Bid</button>
      </div>

      <div>
        <h2>End Auction</h2>
        <button onClick={endAuction}>End Auction</button>
      </div>

      <div>
        <h2>Withdraw Funds</h2>
        <button onClick={withdraw}>Withdraw Funds</button>
      </div>

      <div>
        <h2>Bidders Information</h2>
        <ul>
          {bidders.map((bidder, index) => (
            <li key={index}>
              Bidder Address: {bidder.bidder}, Bid Amount: {bidder.bidAmount}{" "}
              ETH
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Winner Information</h2>
        {winnerAddress && winningBid && (
          <p>
            Winner Address: {winnerAddress} <br />
            Winning Bid: {winningBid} ETH
          </p>
        )}
      </div>
    </div>
  );
};

export default AuctionDapp;
