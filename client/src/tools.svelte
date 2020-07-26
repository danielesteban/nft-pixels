<script>
  import { hsv2Rgb } from 'colorsys';
  import {
    account,
    mint,
  } from './contract.js';
  import Pixels from './pixels.svelte';

  const MAX_UINT32 = (2 ** 32) - 1;
  const aux = new Uint32Array(1);
  const RNG = (ceiling) => Math.floor(
    (
      window.crypto && window.crypto.getRandomValues ? (
        window.crypto.getRandomValues(aux)[0] / MAX_UINT32
      ) : (
        Math.random()
      )
    )
    * ceiling
  );

  const onMint = () => {
    if (!$account) {
      return;
    }
    const data = [...Array(8*8)].map(() => {
      const color = hsv2Rgb({
        h: Math.floor(RNG(361)),
        s: Math.floor(RNG(101)),
        v: Math.floor(RNG(101)),
      });
      return [color.r, color.g, color.b];
    });
    mint($account, data);
  };

  const onRequestAccount = () => account.request();
</script>

{#if !$account}
  <button class="primary" on:click={onRequestAccount}>Connect wallet</button>
{/if}
<button class={$account ? 'primary' : ''} on:click={onMint} disabled={!$account}>Mint pixels (with random data)</button>
