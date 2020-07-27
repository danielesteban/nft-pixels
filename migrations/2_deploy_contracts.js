const fs = require('fs');
const path = require('path');

const PixelsToken = artifacts.require('PixelsToken');
const TokenOffer = artifacts.require('TokenOffer');

module.exports = async (deployer) => {
  await deployer.deploy(PixelsToken);
  await deployer.deploy(TokenOffer, PixelsToken.address);
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
        && line.indexOf('OFFERS_ADDRESS=') !== 0
        && line.indexOf('TOKENS_ADDRESS=') !== 0
      ));
  } catch (e) {
    env = [];
  }
  env.push(`OFFERS_ADDRESS=${TokenOffer.address}`);
  env.push(`TOKENS_ADDRESS=${PixelsToken.address}`);
  fs.writeFileSync(envPath, env.join('\n'));
};
