const { balance, ether, expectRevert } = require('@openzeppelin/test-helpers');

const PixelsToken = artifacts.require('PixelsToken');

const data = [...Array(16 * 16)].map(() => '0xff00ff');

contract('Pixels token', (accounts) => {
  it('Should have deployer as owner', async () => {
    const instance = await PixelsToken.deployed();
    const owner = await instance.owner();
    assert.equal(owner, accounts[0]);
  });

  it('Should error when getting nonexistent token pixels', async () => {
    const instance = await PixelsToken.deployed();
    await expectRevert(
      instance.getPixels(0),
      'PixelsToken: pixels query for nonexistent token'
    );
  });

  it('Should create tokens with specified pixels', async () => {
    const instance = await PixelsToken.deployed();
    await instance.mintPixels(data);
    const pixels = await instance.getPixels(0);
    assert.deepEqual(pixels, data);
  });

  it('Should error when not owner and minting without enough value', async () => {
    const instance = await PixelsToken.deployed();
    await expectRevert(
      instance.mintPixels(data, { from: accounts[1] }),
      'PixelsToken: minting query without enough value'
    );
  });

  it('Should transfer minting cost to owner', async () => {
    const value = ether('0.005').toString();
    const instance = await PixelsToken.deployed();
    const owner = await instance.owner();
    const tracker = await balance.tracker(owner);
    await instance.mintPixels(data, { from: accounts[1], value });
    const delta = await tracker.delta();
    assert.equal(delta.toString(), value);
  });
});
