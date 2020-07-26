const PixelsToken = artifacts.require('PixelsToken');

module.exports = (deployer) => {
  deployer.deploy(PixelsToken);
};
