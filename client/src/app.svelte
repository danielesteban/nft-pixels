<script>
  import { status } from './services/contract';
  import Account from './components/account.svelte';
  import Creator from './routes/creator.svelte';
  import Gallery from './routes/gallery.svelte';
  import Item from './routes/item.svelte';

  // This should prolly be a service that just exports a store.
  // Maybe use the history module and a path-to-regex schema.
  // But this quick&dirty hash router should work for now.
  let route = {};
  const onLocationChange = () => {
    const [id, ...params] = document.location.hash.substr(2).split('/').map((value) => (
      decodeURIComponent(value.trim())
    ));
    switch (id) {
      default:
        route.component = Gallery;
        break;
      case 'new':
        route.component = Creator;
        break;
      case 'item':
        route.component = Item;
        break;
    }
    route.params = params.length ? params : undefined;
  };
  window.addEventListener('hashchange', onLocationChange);
  onLocationChange();
</script>

<app>
  <route>
    {#if $status === 'ready'}
      <svelte:component
        this={route.component}
        {...(route.params ? { params: route.params } : {})}
      />
    {:else}
      <feedback>
        {#if $status === 'unsupported'}
          Web3 is not supported.
          Please open in an Ethereum enabled browser
          (or install <a href="https://metamask.io/" target="_blank">MetaMask</a>).
        {:else if $status === 'wrongnetwork'}
          Please switch to network: {__NetworkId__}
        {:else if $status === 'error'}
          Error loading contracts
        {:else if $status === 'loading'}
          Loading contracts...
        {/if}
      </feedback>
    {/if}
  </route>
  <toolbar>
    <brand>
      <a href="#/">
        PixelTokens
      </a>
    </brand>
    <div>
      <create>
        <a href="#/new">
          <button>Create your own</button>
        </a>
      </create>
      <Account />
    </div>
  </toolbar>
</app>

<style>
  app {
    display: block;
  }

  feedback {
    display: block;
    box-sizing: border-box;
    width: 100%;
    text-align: center;
    padding-top: 4rem;
  }

  route {
    display: block;
    width: 100%;
    height: calc(100vh - 64px);
    overflow: overlay;
  }

  toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 64px;
    padding: 1rem;
    box-sizing: border-box;
    background: #222;
    border-top: 2px solid #000;
  }

  toolbar > div {
    display: flex;
    align-items: center;
  }

  brand {
    letter-spacing: 0.2rem;
  }

  create {
    margin-right: 1rem;
  }
</style>
