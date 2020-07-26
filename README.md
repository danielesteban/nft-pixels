nft-pixels
==

#### Local development

```bash
# clone this repo
git clone https://github.com/danielesteban/nft-pixels.git
cd nft-pixels
# install dependencies
npm install
# start local blockchain:
# once started, copy & import a "private key" to your wallet
npm run ganache
# deploy the contract on another terminal:
# once deployed copy the "contract address"
npm run migrate
# finally, you can start the client on the same terminal:
ADDRESS=0x000000000THECONTRACTADDRESSYOUJUSTCOPIED npm start
```
