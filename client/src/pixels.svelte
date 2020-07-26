<script>
  import { pixels } from './contract';

  export let tokenId;

  $: formattedId = `#${('000000' + tokenId).slice(-6)}`;
  $: image = $pixels[tokenId];
  $: !image && pixels.load(tokenId);
</script>

<pixels>
  {#if image}
    <img alt={formattedId} src={image} />
  {:else}
    <placeholder />
  {/if}
  <id>{formattedId}</id>
</pixels>

<style>
  pixels {
    display: block;
    margin: 1.5rem 1rem;
    background: #000;
    border: 4px solid #222;
    border-bottom: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  id {
    display: block;
    padding: 0.5rem 0;
    border-top: 4px solid #222;
    border-bottom: 4px solid #222;
  }

  img {
    vertical-align: middle;
  }

  placeholder {
    display: block;
    width: 208px;
    height: 312px;
  }
</style>
