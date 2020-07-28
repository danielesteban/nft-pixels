<script>
  import {
    account,
    meta,
    pixels,
    buy,
    createOffer,
    cancelOffer,
  } from '../services/contract';
  import Pixels from '../components/pixels.svelte';

  export let params;

  // This should prolly scale with the viewport
  // But for now it's just scaled for a 1080p desktop browser
  const scale = { x: 32, y: 48 };

  $: tokenId = params[0];
  $: formattedId = `#${('000000' + tokenId).slice(-6)}`;
  $: data = $meta[tokenId];
  $: !data && meta.fetch(tokenId);
  $: isOwner = (
    $account && data && data.owner.toLowerCase() === $account.toLowerCase()
  );

  let isBuying = false;
  const onBuy = () => {
    isBuying = true;
    buy({ account: $account, tokenId, value: data.value })
      .catch(() => {})
      .finally(() => {
        isBuying = false;
      });
  };

  let value = 0;
  let isCreating = false;
  const onCreateOffer = () => {
    isCreating = true;
    createOffer({ account: $account, tokenId, value })
      .catch(() => {})
      .finally(() => {
        isCreating = false;
      });
  };

  let isCanceling = false;
  const onCancelOffer = () => {
    isCanceling = true;
    cancelOffer({ account: $account, tokenId })
      .catch(() => {})
      .finally(() => {
        isCanceling = false;
      });
  };
</script>

<token>
  <half>
    <Pixels
      tokenId={tokenId}
      scale={scale}
    />
  </half>
  <half>
    <actions>
      {#if data}
        {#if data.value !== undefined}
          <value>{data.formattedValue}</value>
          {#if isOwner}
            <button
              disabled={isCanceling}
              on:click={onCancelOffer}
            >
              {#if isCanceling}
                Canceling...
              {:else}
                Cancel offer
              {/if}
            </button>
          {:else}
            <button
              disabled={!$account || isBuying}
              on:click={onBuy}
            >
              {#if isBuying}
                Buying...
              {:else}
                Buy
              {/if}
            </button>
          {/if}
        {:else if isOwner}
          <input
            type="number"
            disabled={isCreating}
            bind:value={value}
          />
          <button
            disabled={isCreating}
            on:click={onCreateOffer}
          >
            {#if isCreating}
              Creating...
            {:else}
              Create offer
            {/if}
          </button>
        {:else}
          <feedback>No current offer</feedback>
        {/if}
      {:else}
        <feedback>Loading...</feedback>
      {/if}
    </actions>
  </half>
</token>

<style>
  token {
    display: flex;
    justify-content: center;
    min-height: 100%;
  }

  half {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-content: top;
    width: 50%;
    max-width: 700px;
    box-sizing: border-box;
    padding: 3rem 1rem;
  }

  actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
  }

  actions {
    border-top: 0;
  }

  actions > input {
    width: 50px;
    margin-right: 0.5rem;
  }

  value {
    display: block;
    margin-right: 1rem;
  }

  feedback {
    display: block;
    padding: 0.5rem 0;
  }
</style>
