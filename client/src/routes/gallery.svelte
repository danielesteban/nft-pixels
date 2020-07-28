<script>
  import { tokens } from '../services/contract';
  import Pixels from '../components/pixels.svelte';
</script>

<gallery>
  {#if $tokens}
    {#each $tokens as tokenId}
      <a href="#/token/{tokenId}">
        <Pixels tokenId={tokenId} />
      </a>
    {/each}
  {:else}
    <loading>
      Loading tokens...
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
    padding-top: 2rem;
  }
</style>
