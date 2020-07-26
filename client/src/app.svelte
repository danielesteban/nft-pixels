<script>
  import { hasWeb3Support } from './contract';
  import Gallery from './gallery.svelte';
</script>

<app>
  {#if hasWeb3Support}
    <Gallery />
  {:else}
    <error>
      Web3 is not supported. Please open in an Ethereum enabled browser (or install MetaMask).
    </error>
  {/if}
</app>

<style>
  app {
    display: block;
    text-align: center;
  }

  error {
    display: block;
    text-align: center;
    padding: 3rem 1rem 1rem;
  }
</style>
