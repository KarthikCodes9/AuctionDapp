// SPDX-License-Identifier: MIT
pragma solidity ^0.7.4;

contract Auction_Contract {
    address public owner;
    uint public reservePrice;
    uint public revealDeadline;
    bool public auctionEnded;

    struct Bid {
        address bidder;
        uint commitment;
        uint revealedValue;
    }

    Bid[] public bids;
    address public winningBidderAddress;
    uint public winningBid;

    constructor(uint _reservePrice, uint _revealDeadline) {
        owner = msg.sender;
        reservePrice = _reservePrice;
        revealDeadline = _revealDeadline;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function.");
        _;
    }

    modifier beforeRevealDeadline() {
        require(block.timestamp < revealDeadline, "Reveal phase has ended.");
        _;
    }

    modifier afterRevealDeadline() {
        require(
            block.timestamp >= revealDeadline,
            "Reveal phase is still ongoing."
        );
        _;
    }

    modifier auctionNotEnded() {
        require(!auctionEnded, "Auction has already ended.");
        _;
    }

    function commitBid(
        uint commitment
    ) public payable auctionNotEnded beforeRevealDeadline {
        require(
            commitment > reservePrice,
            "Bid must be greater than reserve price."
        );
        bids.push(
            Bid({bidder: msg.sender, commitment: commitment, revealedValue: 0})
        );
    }

    function revealBid(uint value) public auctionNotEnded beforeRevealDeadline {
        uint commitment = value;
        for (uint i = 0; i < bids.length; i++) {
            if (
                bids[i].bidder == msg.sender && bids[i].commitment == commitment
            ) {
                require(bids[i].revealedValue == 0, "Bid already revealed.");
                bids[i].revealedValue = value;
                return;
            }
        }
        revert("No matching commitment found.");
    }

    function endAuction() public onlyOwner afterRevealDeadline {
        require(!auctionEnded, "Auction has already ended.");
        auctionEnded = true;

        // Determine the winning bid and bidder
        uint highestBid = reservePrice;
        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].revealedValue > highestBid) {
                highestBid = bids[i].revealedValue;
                winningBidderAddress = bids[i].bidder;
                winningBid = highestBid;
            }
        }

        // Refund non-winning bidders
        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].bidder != winningBidderAddress) {
                address payable nonWinningBidderAddress = payable(
                    bids[i].bidder
                );
                nonWinningBidderAddress.transfer(bids[i].revealedValue);
            }
        }
    }

    function withdraw() public afterRevealDeadline {
        require(auctionEnded, "Auction has not ended yet.");

        for (uint i = 0; i < bids.length; i++) {
            if (bids[i].bidder == msg.sender) {
                if (bids[i].bidder == winningBidderAddress) {
                    // If the bidder is the winner, only allow withdrawal of excess amount
                    uint excessAmount = bids[i].revealedValue - winningBid;
                    if (excessAmount > 0) {
                        msg.sender.transfer(excessAmount);
                    }
                } else {
                    // Refund the entire bid amount for non-winning bidders
                    msg.sender.transfer(bids[i].revealedValue);
                }
            }
        }
    }
}
