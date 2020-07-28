<script>
  import {
    account,
    meta,
    pixels,
    buy,
    createOffer,
    cancelOffer,
  } from '../services/contract';

  export let tokenId;

  $: formattedId = `#${('000000' + tokenId).slice(-6)}`;
  $: data = $meta[tokenId];
  $: !data && meta.fetch(tokenId);
  $: image = $pixels[tokenId];
  $: !image && pixels.fetch(tokenId);
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
      .finally(() => {
        isCanceling = false;
      });
  };
</script>

<pixels>
  {#if image}
    <img alt={formattedId} src={image} />
  {:else}
    <placeholder />
  {/if}
  <id>{formattedId}</id>
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
</pixels>

<style>
  pixels {
    display: block;
    margin: 1rem;
    background: #000;
    border: 4px solid #222;
    border-bottom: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  id, actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 0;
    border-top: 4px solid #222;
    border-bottom: 4px solid #222;
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

  img {
    display: block;
  }

  placeholder {
    display: block;
    width: 224px;
    height: 336px;
  }
</style>
