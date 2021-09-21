require('@nomiclabs/hardhat-waffle')
const fs = require('fs')
require('dotenv').config()

task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address)
  }
})

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/polygon/mumbai`,
      accounts: [],
    },
    polygon: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/polygon/mainnet`,
      accounts: [],
    },
    rinkeby: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/eth/rinkeby`,
      accounts: [],
    },
    ethMainnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/eth/mainnet`,
      accounts: [],
    },
    bscMainnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/bsc/testnet`,
      accounts: [],
    },
    bscTestnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/bsc/testnet`,
      accounts: [],
    },
  },
  solidity: {
    version: '0.8.4',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
}
