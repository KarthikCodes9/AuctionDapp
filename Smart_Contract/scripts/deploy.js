const { ethers } = require('hardhat');

// Replace with your Alchemy API URL
const alchemyUrl = 'Tozs2_lrKRhv7Mu17QuvY47Fzfymc_2J';

async function main() {
  await initHardhatProject();
  configureHardhat('Tozs2_lrKRhv7Mu17QuvY47Fzfymc_2J'); // Pass your Alchemy API URL here

  const contractAddress = await deployContract();

  console.log('Deployment completed. Contract deployed at address:', contractAddress);
}

async function initHardhatProject() {
  console.log('Initializing Hardhat project...');

  // No need to assign deployer here
}

function configureHardhat(alchemyUrl) {
  console.log('Configuring Hardhat...');
  require('@nomiclabs/hardhat-waffle');
  require('hardhat');

  module.exports = {
    solidity: '0.7.4',
    networks: {
      hardhat: {},
      alchemy: {
        url: alchemyUrl,
      },
    },
  };
}

async function deployContract() {
  console.log('Deploying the contract...');

  const AuctionContract = await ethers.getContractFactory('Auction_Contract');

  // Provide the required constructor arguments here.
  const reservePrice = 100; // Replace with your desired value
  const revealDeadline =  1700055957; // Replace with your desired timestamp

  const auctionContract = await AuctionContract.deploy(reservePrice, revealDeadline);

  await auctionContract.deployed();

  console.log('Contract deployed to address:', auctionContract.address);
  return auctionContract.address;
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
