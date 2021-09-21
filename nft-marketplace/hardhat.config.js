require('@nomiclabs/hardhat-waffle')
const fs = require('fs')
// if using something like .secret, then we'd do the following
// const privateKey = fs.readFileSync('.secret').toString()
require('dotenv').config()
const privateKey = process.env.PVT_KEY
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
      accounts: [privateKey],
    },
    polygon: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/polygon/mainnet`,
      accounts: [privateKey],
    },
    rinkeby: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/eth/rinkeby`,
      accounts: [privateKey],
    },
    ethMainnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/eth/mainnet`,
      accounts: [privateKey],
    },
    bscMainnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/bsc/testnet`,
      accounts: [privateKey],
    },
    bscTestnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/bsc/testnet`,
      accounts: [privateKey],
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
