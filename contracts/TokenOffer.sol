// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Holder.sol';

contract TokenOffer is ERC721Holder {
  ERC721 private _contract;

  struct Offer {
    address owner;
    uint128 value;
  }

  mapping (uint256 => Offer) private _offers;

  constructor(address contractAddress) public {
    _contract = ERC721(contractAddress);
  }

  // Get an offer
  function get(uint256 tokenId)
    public
    view
    returns (address owner, uint128 value)
  {
    Offer memory offer = _offers[tokenId];
    require(
      offer.owner != address(0),
      "TokenOffer: get query for nonexistent offer"
    );
    owner = offer.owner;
    value = offer.value;
  }

  // Create an offer
  function create(uint256 tokenId, uint128 value)
    public
  {
    require(
      _offers[tokenId].owner == address(0),
      "TokenOffer: create query for already existent offer"
    );
    _contract.safeTransferFrom(msg.sender, address(this), tokenId);
    Offer memory offer = Offer({
      owner: msg.sender,
      value: value
    });
    _offers[tokenId] = offer;
  }

  // Cancel an offer
  function cancel(uint256 tokenId)
    public
  {
    Offer memory offer = _offers[tokenId];
    require(
      msg.sender == offer.owner,
      "TokenOffer: cancel query caller is not owner"
    );
    _contract.safeTransferFrom(address(this), msg.sender, tokenId);
    delete _offers[tokenId];
  }

  // Buy an offer
  function buy(uint256 tokenId)
    public
    payable
  {
    Offer memory offer = _offers[tokenId];
    require(
      offer.owner != address(0),
      "TokenOffer: buy query for nonexistent offer"
    );
    require(
      msg.sender != offer.owner,
      "TokenOffer: buy query caller is owner"
    );
    require(
      msg.value >= offer.value,
      "TokenOffer: buy query without enough value"
    );
    payable(offer.owner).transfer(msg.value);
    _contract.safeTransferFrom(address(this), msg.sender, tokenId);
    delete _offers[tokenId];
  }
}
