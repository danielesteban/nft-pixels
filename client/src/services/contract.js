import { writable } from 'svelte/store';
import PixelsToken from '../../artifacts/PixelsToken.json';
import TokenOffer from '../../artifacts/TokenOffer.json';

const { TruffleContract, Web3 } = window;
const web3 = Web3.givenProvider ? (
  new Web3(Web3.givenProvider)
) : undefined;
if (web3 && web3.currentProvider.autoRefreshOnNetworkChange) {
  web3.currentProvider.autoRefreshOnNetworkChange = false;
}
export const hasWeb3Support = !!web3;

let contract;
let offers;
export const status = (() => {
  const { subscribe, set } = writable('unsupported');
  const load = () => {
    contract = undefined;
    offers = undefined;
    set('loading');
    (__NetworkId__ ? (
      web3.eth.net.getId()
        .then((networkId) => {
          if (networkId.toString() !== __NetworkId__) {
            throw new Error('wrongnetwork');
          }
        })
    ) : Promise.resolve())
      .then(() => (
        Promise.all(
          [
            { artifact: TokenOffer, address: __OffersAddress__ },
            { artifact: PixelsToken, address: __TokensAddress__ },
          ].map(({ artifact, address }) => {
            const contract = TruffleContract(artifact);
            contract.setProvider(web3.currentProvider);
            return contract.at(address);
          })
        )
          .then(([offersInstance, tokensInstance]) => {
            contract = tokensInstance;
            offers = offersInstance;
            set('ready');
            tokens.fetch(); // eslint-disable-line no-use-before-define
          })
          .catch(() => {
            throw new Error('error');
          })
      ))
      .catch(({ message }) => (
        set(message)
      ));
  };
  if (hasWeb3Support) {
    load();
    web3.currentProvider.on('chainChanged', load);
  }
  return {
    subscribe,
  };
})();

export const account = (() => {
  const { subscribe, set } = writable();
  if (hasWeb3Support) {
    web3.currentProvider.on('accountsChanged', (accounts) => (
      set(accounts[0])
    ));
    web3.eth.getAccounts()
      .then((accounts) => (
        set(accounts[0])
      ));
  }
  return {
    subscribe,
    request: () => (
      web3.currentProvider.request({ method: 'eth_requestAccounts' })
    ),
  };
})();

export const meta = (() => {
  const { subscribe, update } = writable({});
  return {
    subscribe,
    fetch: (tokenId) => {
      if (!contract || !offers) {
        return Promise.reject();
      }
      return contract.ownerOf(tokenId)
        .then((owner) => {
          if (owner.toLowerCase() !== offers.address.toLowerCase()) {
            return { owner };
          }
          return offers.get(tokenId)
            .then(({ owner, value }) => ({
              owner,
              value,
              formattedValue: `${web3.utils.fromWei(value, 'ether')} ETH`,
            }));
        })
        .then((meta) => (
          update((state) => ({
            ...state,
            [tokenId]: meta,
          }))
        ));
    },
  };
})();

export const pixels = (() => {
  const { subscribe, update } = writable({});
  return {
    subscribe,
    fetch: (tokenId) => {
      if (!contract) {
        return Promise.reject();
      }
      return contract.getPixels(tokenId)
        .then((pixels) => (
          update((state) => ({
            ...state,
            [tokenId]: pixels,
          }))
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
    unshift: (token) => update((state) => [token, ...(state || [])]),
  };
})();

export const buy = ({ account, tokenId, value }) => {
  if (!contract || !offers) {
    return Promise.reject();
  }
  return offers.buy(tokenId, { from: account, value })
    .then(() => (
      meta.fetch(tokenId)
    ));
};

export const cancelOffer = ({ account, tokenId }) => {
  if (!contract || !offers) {
    return Promise.reject();
  }
  return offers.cancel(tokenId, { from: account })
    .then(() => (
      meta.fetch(tokenId)
    ));
};

export const createOffer = ({ account, tokenId, value }) => {
  if (!contract || !offers) {
    return Promise.reject();
  }
  return contract.getApproved(tokenId)
    .then((approved) => (
      approved.toLowerCase() !== offers.address.toLowerCase() ? (
        contract.approve(offers.address, tokenId, { from: account })
      ) : (
        Promise.resolve()
      )
    ))
    .then(() => (
      offers.create(tokenId, web3.utils.toWei(`${value}`, 'ether'), { from: account })
    ))
    .then(() => (
      meta.fetch(tokenId)
    ));
};

export const mint = ({ account, pixels }) => {
  if (!contract) {
    return Promise.reject();
  }
  return contract.mintPixels(pixels, { from: account, value: web3.utils.toWei('0.005', 'ether') })
    .then(({ logs: [{ args: { tokenId } }] }) => (
      tokens.unshift(tokenId.toString())
    ));
};
