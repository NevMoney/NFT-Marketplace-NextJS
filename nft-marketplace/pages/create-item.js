import { useState } from 'react'
import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import { useRouter } from 'next/router' //allows to route and read values from url
import { create as ipfsHttpClient } from 'ipfs-http-client'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')

import { nftaddress, nftmarketaddress } from '../config'
import NFT from '../artifacts/contracts/NFT.sol/NFT.json'
import Market from '../artifacts/contracts/NFTMarket.sol/NFTMarket.json'

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formInput, updateFormInput] = useState({
    price: '',
    name: '',
    description: '',
  })
  const router = useRouter()

  async function onChange(e) {
    e.preventDefault()
    const file = e.target.files[0]
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      })
      //   const added = new Moralis.File(data.name, data)
      //   await file.saveIPFS()
      //   const url = await client.get(added[0].hash)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      setFileUrl(url)
    } catch (error) {
      console.log(error)
    }
  }

  // allow user to create item and save to ipfs
  async function createMarket(e) {
    const { name, description, price } = formInput
    if (!name || !description || !price || !fileUrl) {
      alert('Please fill in all fields')
      return
    }
    e.preventDefault()
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    })

    try {
      const added = await client.add(data)
      const url = `https://ipfs.infura.io/ipfs/${added.path}`
      // after saved to ipfs, pass the url to save it on Polygon
      createSale(url)
    } catch (error) {
      console.log(error)
    }
  }
  // allow user to list item for sale
  async function createSale(url) {
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()

    const tokenContract = new ethers.Contract(nftaddress, NFT.abi, signer)
    let transaction = await tokenContract.createToken(url)
    let tx = await transaction.wait()

    let event = tx.events[0]
    let bigNumberTokenId = event.args[2]
    let tokenId = bigNumberTokenId.toNumber()

    const price = ethers.utils.parseUnits(formInput.price, 'ether')

    const marketContract = new ethers.Contract(
      nftmarketaddress,
      Market.abi,
      signer,
    )

    let listingPrice = await marketContract.getListingPrice()
    listingPrice = listingPrice.toString()

    transaction = await marketContract.createMarketItem(
      nftaddress,
      tokenId,
      price,
      { value: listingPrice },
    )
    tx = await transaction.wait()
    // route the user back to home page
    router.push('/')
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <input
          placeholder="Asset Price in MATIC"
          className="mt-2 border rounded p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <input type="file" name="Asset" className="my-4" onChange={onChange} />
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <button
          onClick={createMarket}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  )
}
