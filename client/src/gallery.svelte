<script>
  import { tokens } from './contract';
  import Tools from './tools.svelte';
  import Pixels from './pixels.svelte';
</script>

<gallery>
  <pixels>
    {#if $tokens}
      {#each $tokens as tokenId}
        <Pixels tokenId={tokenId} />
      {/each}
    {:else}
      <loading>
        Loading...
      </loading>
    {/if}
  </pixels>
  <toolbar>
    <Tools />
  </toolbar>
</gallery>

<style>
  gallery {
    display: block;
  }

  pixels {
    display: flex;
    box-sizing: border-box;
    width: 100%;
    padding: 3rem;
    margin-bottom: 64px;
    align-items: center;
    align-content: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  loading {
    display: block;
    margin: 6rem;
  }

  toolbar {
    box-sizing: border-box;
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    padding: 1rem 0;
    height: 64px;
    background: #222;
    border-top: 2px solid #000;
  }
</style>
