<script>
  import { hsv2Rgb } from 'colorsys';
  import { account, mint } from '../services/contract.js';

  const aux = new Uint32Array(8*8);
  const onMint = () => {
    window.crypto.getRandomValues(aux);
    const pixels = [...aux].map((n) => {
      const color = hsv2Rgb({
        h: (((n >> 16) & 0xFF) / 0xFF) * 0x168,
        s: (((n >> 8) & 0xFF)  / 0xFF) * 0x64,
        v: ((n & 0xFF) / 0xFF) * 0x64
      });
      return [color.r, color.g, color.b];
    });
    mint({ account: $account, pixels });
  };

  const onRequestAccount = () => account.request();
</script>

{#if !$account}
  <button
    class="primary"
    on:click={onRequestAccount}
  >
    Connect wallet
  </button>
{/if}
<button
  class={$account ? 'primary' : ''}
  disabled={!$account}
  on:click={onMint}
>
  Mint pixels (with random data)
</button>

<style>
  button {
    margin: 0 0.25rem;
  }
</style>
