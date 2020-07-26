const fs = require('fs');
const path = require('path');

const PixelsToken = artifacts.require('PixelsToken');

module.exports = (deployer) => (
  deployer.deploy(PixelsToken)
    .then(({ address }) => {
      if (process.env.NODE_ENV !== 'production') {
        return;
      }
      const envPath = path.join(__dirname, '..', '.env');
      let env;
      try {
        env = fs.readFileSync(envPath, 'utf8')
          .split('\n')
          .filter((line) => (
            line && line.indexOf('ADDRESS=') !== 0
          ));
      } catch (e) {
        env = [];
      }
      env.push(`ADDRESS=${address}`);
      fs.writeFileSync(envPath, env.join('\n'));
    })
);
