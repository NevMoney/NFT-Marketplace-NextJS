//SPDX-License-Identifier: Unlicense
pragma solidity 0.8.4;

import @openzeppelin/contracts/utils/Counters.sol;
import @openzeppelin/contracts/token/ERC721/ERC721.sol;
import @openzeppelin/contracts/security/ReentrancyGuard.sol;

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counter.Counter private _itemsSold;

    address payable owner;
    uint256 listingPrice = 0.025 ether;

    struct MarketItem{
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable tokenOwner;
        uint256 price;
        bool sold;
    }

    mapping(uint256 => MarketItem) private _idToMarketItem;

    event ItemCreated(uint indexed itemId, address indexed nftContract, uint256 indexed tokenId, address seller, address tokenOwner, uint256 price, bool price);

    constructor() public {
        owner = payable(msg.sender);
    }
 
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    function createMarketItem(address nftContract, uint256 tokenId, uint256 price) public payable nonReentrant {
        require(msg.value >= listingPrice, "Insufficient funds");
        require(price > 0, "Price must be greater than 0");

        _itemIds.increment();
        uint256 itemId = _itemIds.current();

        _itToMarketItem[itemId] = MarketItem(
            itemId,
            nftContract,
            tokenId,
            payable(msg.sender),
            payable(address(0)),
            price,
            false
        );

        IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

        emit ItemCreated(itemId, nftContract, tokenId, msg.sender, address(0), price, false);
    }

    function createMarketSale(address nftContract, uint256 itemId) public payable nonReentrant {
        uint price = _idToMarketItem[itemId].price;
        uint tokenId = _idToMarketItem[itemId].tokenId;
        require(msg.value >= price, "Insufficient funds");

        _idToMarketItem[itemId].seller.transfer(msg.value);

        IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
        _idToMarketItem[itemId].tokenOwner = msg.sender;
        _idToMarketItem[itemId].sold = true;

        _itemsSold.increment();
        payable(owner).transfer(listingPrice);
    }

    function getMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.current();
        uint unsoldItemCount = _items.current() - _itemsSold.current();
        uint currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for(uint i = 0; i < itemCount; i++) {
            if(_idToMarketItem[i + 1].tokenOwner == address(0)) {
                uint currentId = _idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = _idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getMyNFTs() public view returns (MarketItme[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalItemCount; i++) {
            if(_idToMarketItem[i + 1].tokenOwner == msg.sender) {
               itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i = 0; i < totalItemCount; i++) {
            if(_idToMarketItem[i + 1].tokenOwner == msg.sender) {
                uint currentId = _idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = _idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    function getItemsCreated() public view returns (MarketItem[] memory) {
        uint totalItemCount = _itemIds.current();
        uint itemCount = 0;
        uint currentIndex = 0;

        for(uint i = 0; i < totalItemCount; i++) {
            if(_idToMarketItem[i + 1].seller == msg.sender) {
               itemCount += 1;
            }
        }
        MarketItem[] memory items = new MarketItem[](itemCount);
        for(uint i = 0; i < totalItemCount; i++) {
            if(_idToMarketItem[i + 1].seller == msg.sender) {
                uint currentId = _idToMarketItem[i + 1].itemId;
                MarketItem storage currentItem = _idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }
}
