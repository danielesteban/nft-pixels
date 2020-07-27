const { expectRevert } = require('@openzeppelin/test-helpers');

const PixelsToken = artifacts.require('PixelsToken');
const TokenAuction = artifacts.require('TokenAuction');

contract('Pixels token', (accounts) => {
  let tokens;
  before(async () => {
    tokens = await PixelsToken.deployed();
    await tokens.mintPixels([...Array(8 * 8)].map(() => '0x000000'));
  });

  it('Should create an auction', async () => {
    const instance = await TokenAuction.deployed();
    const tokenId = await tokens.tokenByIndex(0);
    await tokens.approve(TokenAuction.address, tokenId);
    await instance.createAuction(tokenId, 0);
    const owner = await tokens.ownerOf(tokenId);
    assert.equal(owner, TokenAuction.address);
  });

  it('Should be able to cancel an auction', async () => {
    const instance = await TokenAuction.deployed();
    const tokenId = await tokens.tokenByIndex(0);
    await instance.cancelAuction(tokenId);
    const owner = await tokens.ownerOf(tokenId);
    assert.equal(owner, accounts[0]);
  });

  it('Should error if bidding without enough value', async () => {
    const instance = await TokenAuction.deployed();
    const tokenId = await tokens.tokenByIndex(0);
    await tokens.approve(TokenAuction.address, tokenId);
    await instance.createAuction(tokenId, 1);
    await expectRevert(
      instance.bid(tokenId, { from: accounts[1], value: 0 }),
      'TokenAuction: bid query without enough value'
    );
  });

  it('Should transfer the token if bidding with enough value', async () => {
    const instance = await TokenAuction.deployed();
    const tokenId = await tokens.tokenByIndex(0);
    await instance.bid(tokenId, { from: accounts[1], value: 1 });
    const owner = await tokens.ownerOf(tokenId);
    assert.equal(owner, accounts[1]);
  });
});
