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
      // url: `https://speedy-nodes-nyc.moralis.io/${process.env.PROJECT_ID}/polygon/mumbai`,
      url: 'https://rpc-mumbai.maticvigil.com',
      accounts: [privateKey],
    },
    polygon: {
      url: `https://rpc-mainnet.matic.network`,
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
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
}
