const { expectRevert } = require('@openzeppelin/test-helpers');

const PixelsToken = artifacts.require('PixelsToken');
const TokenOffer = artifacts.require('TokenOffer');

contract('Token offers', (accounts) => {
  let tokens;
  before(async () => {
    tokens = await PixelsToken.deployed();
    await tokens.mintPixels([...Array(16 * 16)].map(() => '0x000000'));
  });

  it('Should create an offer', async () => {
    const instance = await TokenOffer.deployed();
    const tokenId = await tokens.tokenByIndex(0);
    await tokens.approve(TokenOffer.address, tokenId);
    await instance.create(tokenId, 1);
    const owner = await tokens.ownerOf(tokenId);
    const { owner: seller, value } = await instance.get(tokenId);
    assert.equal(owner, TokenOffer.address);
    assert.equal(seller, accounts[0]);
    assert.equal(value, 1);
  });

  it('Should be able to cancel an offer', async () => {
    const instance = await TokenOffer.deployed();
    const tokenId = await tokens.tokenByIndex(0);
    await instance.cancel(tokenId);
    const owner = await tokens.ownerOf(tokenId);
    assert.equal(owner, accounts[0]);
  });

  it('Should error if buying without enough value', async () => {
    const instance = await TokenOffer.deployed();
    const tokenId = await tokens.tokenByIndex(0);
    await tokens.approve(TokenOffer.address, tokenId);
    await instance.create(tokenId, 1);
    await expectRevert(
      instance.buy(tokenId, { from: accounts[1], value: 0 }),
      'TokenOffer: buy query without enough value'
    );
  });

  it('Should transfer the token if buying with enough value', async () => {
    const instance = await TokenOffer.deployed();
    const tokenId = await tokens.tokenByIndex(0);
    await instance.buy(tokenId, { from: accounts[1], value: 1 });
    const owner = await tokens.ownerOf(tokenId);
    assert.equal(owner, accounts[1]);
  });
});
