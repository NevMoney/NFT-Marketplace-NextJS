const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('NFTMarket', function () {
  it('Should create and execute market sales', async function () {
    const Market = await ethers.getContractFactory('NFTMarket')
    const market = await Greeter.deploy()
    await market.deployed()
    const marketAddress = market.marketAddress

    const NFT = await ethers.getContractFactory('NFT')
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftAddress = nft.address

    let listingPrice = await market.getListingPrice()
    listingPrice = listingPrice.toString()

    const auctionPrice = ethers.utils.parseUnits('100', 'ether')
    await nft.createToken('https://www.mytokenlocation.com')
    await nft.createToken('https://www.mytokenlocation2.com')

    await market.createMarketItem(nftAddress, 1, auctionPrice, {
      value: listingPrice,
    })
    await market.createMarketItem(nftAddress, 2, auctionPrice, {
      value: listingPrice,
    })

    const [_, buyerAddress] = await ethers.getSigners()

    await market
      .connect(buyerAddress)
      .createMarketSale(nftAddress, 1, { value: auctionPrice })

    const items = await market.getMarketItems()
    console.log('items', items)
  })
})
