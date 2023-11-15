//https://eth-sepolia.g.alchemy.com/v2/Tozs2_lrKRhv7Mu17QuvY47Fzfymc_2J
require('@nomiclabs/hardhat-waffle');
module.exports = {
  solidity: '0.7.4',
  networks: {
    hardhat: {},
    sepolia: {
      url: 'https://eth-sepolia.g.alchemy.com/v2/Tozs2_lrKRhv7Mu17QuvY47Fzfymc_2J', //API of Alchemy VM
      accounts: ['dbfeb133f7c2be83686c637ac3a1ef72837f10903ccce87babb9c0de33609e0e']// metamask prvt key
    }
  }
}