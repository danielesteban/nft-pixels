// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// NFT Pixels token
// Stores rgb pixels

contract PixelsToken is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint constant size = 8*8;
  bytes3[size][] private _store;

  constructor() public ERC721("PixelsToken", "PXLS") {

  }

  // Returns the pixels of a token
  function getPixels(uint256 tokenId)
    public
    view
    returns(bytes3[size] memory)
  {
    return _store[tokenId];
  }

  // Create a new token
  function mintPixels(bytes3[size] memory pixels)
    public
    returns (uint256)
  {
    uint256 tokenId = _tokenIds.current();
    _store.push(pixels);
    _mint(msg.sender, tokenId);
    _tokenIds.increment();
    return tokenId;
  }
}
