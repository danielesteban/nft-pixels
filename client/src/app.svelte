<script>
  import { hasWeb3Support } from './services/contract';
  import Tools from './components/tools.svelte';
  import Creator from './routes/creator.svelte';
  import Gallery from './routes/gallery.svelte';
  import Item from './routes/item.svelte';
  import Unsupported from './routes/unsupported.svelte';

  let route = {
    component: Unsupported,
    params: [],
  };

  if (hasWeb3Support) {
    // This should prolly be a service that just exports a store.
    // Maybe use the history module and path-to-regex schema.
    // But this quick&dirty hash router should work for now.
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
      route.params = params;
    };
    window.addEventListener('hashchange', onLocationChange);
    onLocationChange();
  }
</script>

<app>
  <route>
    <svelte:component this={route.component} params={route.params} />
  </route>
  <toolbar>
    {#if hasWeb3Support}
      <Tools />
    {/if}
  </toolbar>
</app>

<style>
  app {
    display: block;
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
    justify-content: center;
    width: 100%;
    height: 64px;
    padding: 1rem 0;
    box-sizing: border-box;
    background: #222;
    border-top: 2px solid #000;
  }
</style>
