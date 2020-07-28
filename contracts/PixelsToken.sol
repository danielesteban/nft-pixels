// SPDX-License-Identifier: MIT
pragma solidity ^0.6.2;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

// NFT Pixels token
// Stores rgb pixels

contract PixelsToken is ERC721, ERC721Burnable, Ownable {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  uint128 constant COST = 0.005 ether;
  uint constant SIZE = 16 * 16;
  bytes3[SIZE][] private _store;

  constructor() public ERC721("PixelsToken", "PXLS") {

  }

  // Return the pixels of a token
  function getPixels(uint256 tokenId)
    public
    view
    returns (bytes3[SIZE] memory)
  {
    require(
      _exists(tokenId),
      "PixelsToken: pixels query for nonexistent token"
    );
    return _store[tokenId];
  }

  // Create a new token
  function mintPixels(bytes3[SIZE] memory pixels)
    public
    payable
    returns (uint256)
  {
    require(
      msg.value >= COST || _msgSender() == owner(),
      "PixelsToken: minting query without enough value"
    );
    uint256 tokenId = _tokenIds.current();
    _store.push(pixels);
    _safeMint(_msgSender(), tokenId);
    _tokenIds.increment();
    if (msg.value > 0) {
      payable(owner()).transfer(msg.value);
    }
    return tokenId;
  }
}
