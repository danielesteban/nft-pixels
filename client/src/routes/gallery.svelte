<script>
  import { tokens } from '../services/contract';
  import Pixels from '../components/pixels.svelte';
</script>

<gallery>
  {#if $tokens}
    {#each $tokens as tokenId}
      <Pixels tokenId={tokenId} />
    {/each}
  {:else}
    <loading>
      Loading...
    </loading>
  {/if}
</gallery>

<style>
  gallery {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 2rem 3rem;
    align-items: center;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  loading {
    display: block;
    margin: 6rem;
  }
</style>
