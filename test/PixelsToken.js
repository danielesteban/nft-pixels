const PixelsToken = artifacts.require('PixelsToken');

contract('Pixels token', () => {
  it('Should create tokens with specified pixels', async () => {
    const data = [...Array(8 * 8)].map(() => '0xff00ff');
    const instance = await PixelsToken.deployed();
    await instance.mintPixels(data);
    const pixels = await instance.getPixels(0);
    assert.equal(parseInt(pixels[0], 16), 0xff00ff);
    assert.equal(parseInt(pixels[63], 16), 0xff00ff);
  });
});
