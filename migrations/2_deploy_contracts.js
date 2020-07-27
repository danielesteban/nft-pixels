const fs = require('fs');
const path = require('path');

const PixelsToken = artifacts.require('PixelsToken');
const TokenAuction = artifacts.require('TokenAuction');

module.exports = async (deployer) => {
  await deployer.deploy(PixelsToken);
  await deployer.deploy(TokenAuction, PixelsToken.address);
  if (process.env.NODE_ENV !== 'production') {
    return;
  }
  const envPath = path.join(__dirname, '..', '.env');
  let env;
  try {
    env = fs.readFileSync(envPath, 'utf8')
      .split('\n')
      .filter((line) => (
        line
        && line.indexOf('AUCTIONS_ADDRESS=') !== 0
        && line.indexOf('CONTRACT_ADDRESS=') !== 0
      ));
  } catch (e) {
    env = [];
  }
  env.push(`AUCTION_ADDRESS=${TokenAuction.address}`);
  env.push(`CONTRACT_ADDRESS=${PixelsToken.address}`);
  fs.writeFileSync(envPath, env.join('\n'));
};
