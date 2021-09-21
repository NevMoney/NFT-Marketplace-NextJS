import { ethers } from 'ethers'
import { useEffect, useState } from 'react'
import axios from 'axios'
import Web3Modal from 'web3modal'

import { nftAddress, marketAddress } from '../config'
import NFTAbi from '../artifacts/contracts/NFT.sol/NFT.json'
import MarketAbi from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function Home() {
  return (
    <div className=""}>
      <h1>Welcome to NFT Marketplace</h1>
    </div>
  )
}
