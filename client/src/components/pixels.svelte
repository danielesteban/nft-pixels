<script>
  import {
    account,
    meta,
    pixels,
    buy,
    createOffer,
    cancelOffer,
  } from '../services/contract';
  import rasterizer from '../services/rasterizer';

  export let tokenId;
  export let scale = { x: 14, y: 21 };

  $: formattedId = `#${('000000' + tokenId).slice(-6)}`;
  $: token = $pixels[tokenId];
  $: !token && pixels.fetch(tokenId);
  $: image = token && rasterizer({ tokenId, token, scale });
</script>

<pixels>
  {#if image}
    <img alt={formattedId} src={image} />
  {:else}
    <placeholder style="width: {16 * scale.x}px; height: {16 * scale.y}px" />
  {/if}
  <id>{formattedId}</id>
</pixels>

<style>
  pixels {
    display: block;
    margin: 1rem;
    background: #000;
    border: 4px solid #222;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  id {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
    border-top: 4px solid #222;
  }

  pixels:hover id {
    background: linear-gradient(#000, #111);
  }

  img {
    display: block;
  }

  placeholder {
    display: block;
  }
</style>
