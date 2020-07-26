import { writable } from 'svelte/store';
import PixelsToken from './PixelsToken.json';
import rasterize from './rasterizer';

const { Web3 } = window;
const web3 = Web3.givenProvider ? (
  new Web3(Web3.givenProvider)
) : undefined;
if (web3 && web3.currentProvider.autoRefreshOnNetworkChange) {
  web3.currentProvider.autoRefreshOnNetworkChange = false;
}
export const hasWeb3Support = !!web3;

let contract;
if (hasWeb3Support) {
  const { TruffleContract } = window;
  const artifact = TruffleContract(PixelsToken);
  artifact.setProvider(web3.currentProvider);
  artifact.at(__ContractAddress__)
    .then((instance) => {
      contract = instance;
      tokens.fetch(); // eslint-disable-line no-use-before-define
    });
}

export const account = (() => {
  const { subscribe, set } = writable();
  return {
    subscribe,
    setup: () => (
      web3.eth.getAccounts()
        .then((accounts) => {
          set(accounts[0]);
        })
    ),
    request: () => (
      web3.currentProvider.request({ method: 'eth_requestAccounts' })
        .then(() => (
          account.setup()
        ))
    ),
  };
})();

if (hasWeb3Support) {
  account.setup();
}

export const pixels = (() => {
  const { subscribe, update } = writable({});
  return {
    subscribe,
    load: (tokenId) => {
      if (!contract) {
        return Promise.reject();
      }
      return contract.getPixels(tokenId)
        .then((pixels) => (
          update((tokens) => ({ ...tokens, [tokenId]: rasterize(pixels) }))
        ));
    },
  };
})();

export const tokens = (() => {
  const { subscribe, set, update } = writable();
  return {
    subscribe,
    fetch: (account) => {
      if (!contract) {
        return Promise.reject();
      }
      set();
      return (account ? (
        contract.balanceOf(account)
      ) : (
        contract.totalSupply()
      ))
        .then((count) => Promise.all(
          [...Array(count.toNumber())].map((v, i) => (
            account ? (
              contract.tokenOfOwnerByIndex(account, count - 1 - i)
            ) : (
              contract.tokenByIndex(count - 1 - i)
            )
          ))
        ))
        .then((tokens) => (
          set(tokens.map((tokenId) => tokenId.toString()))
        ));
    },
    unshift: (token) => update((tokens) => [token, ...(tokens || [])]),
  };
})();

export const mint = (account, pixels) => {
  if (!contract) {
    return Promise.reject();
  }
  return contract.mintPixels(pixels, { from: account })
    .then(({ logs: [{ args: { tokenId } }] }) => (
      tokens.unshift(tokenId.toString())
    ));
};
