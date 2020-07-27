// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Holder.sol';

contract TokenAuction is ERC721Holder {
  ERC721 private _contract;

  struct Auction {
    address seller;
    uint128 value;
  }

  mapping (uint256 => Auction) private _auctions;

  constructor(address contractAddress) public {
    _contract = ERC721(contractAddress);
  }

  // Create an auction
  function createAuction(uint256 tokenId, uint128 value)
    public
  {
    require(
      _auctions[tokenId].seller == address(0),
      "TokenAuction: creation query for already existent auction"
    );
    _contract.safeTransferFrom(msg.sender, address(this), tokenId);
    Auction memory auction = Auction({
      seller: msg.sender,
      value: value
    });
    _auctions[tokenId] = auction;
  }

  // Cancel an auction
  function cancelAuction(uint256 tokenId)
    public
  {
    Auction memory auction = _auctions[tokenId];
    require(
      msg.sender == auction.seller,
      "TokenAuction: cancel query caller is not seller"
    );
    _contract.safeTransferFrom(address(this), msg.sender, tokenId);
    delete _auctions[tokenId];
  }

  // Bid on an auction
  function bid(uint256 tokenId)
    public
    payable
  {
    Auction memory auction = _auctions[tokenId];
    require(
      auction.seller != address(0),
      "TokenAuction: bid query for nonexistent auction"
    );
    require(
      msg.sender != auction.seller,
      "TokenAuction: bid query caller is seller"
    );
    require(
      msg.value >= auction.value,
      "TokenAuction: bid query without enough value"
    );
    payable(auction.seller).transfer(msg.value);
    _contract.safeTransferFrom(address(this), msg.sender, tokenId);
    delete _auctions[tokenId];
  }
}
