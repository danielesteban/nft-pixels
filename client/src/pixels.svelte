<script>
  import {
    account,
    meta,
    pixels,
    buy,
    createOffer,
    cancelOffer,
  } from './contract';

  export let tokenId;

  $: formattedId = `#${('000000' + tokenId).slice(-6)}`;
  $: data = $meta[tokenId];
  $: !data && meta.fetch(tokenId);
  $: image = $pixels[tokenId];
  $: !image && pixels.fetch(tokenId);
  $: isOwner = (
    $account && data && data.owner.toLowerCase() === $account.toLowerCase()
  );
  
  const onBuy = () => (
    buy({ account: $account, tokenId, value: data.value })
  );

  let value = 0;
  const onCreateOffer = () => (
    createOffer({ account: $account, tokenId, value })
  );

  const onCancelOffer = () => (
    cancelOffer({ account: $account, tokenId })
  );
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
          <button on:click={onCancelOffer}>
            Cancel offer
          </button>
        {:else}
          <button on:click={onBuy}>
            Buy
          </button>
        {/if}
      {:else if isOwner}
        <input
          type="number"
          bind:value={value}
        />
        <button on:click={onCreateOffer}>
          Create offer
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
    margin: 1.5rem 1rem;
    background: #000;
    border: 4px solid #222;
    border-bottom: 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  }

  id, actions {
    display: block;
    padding: 0.5rem 0;
    border-top: 4px solid #222;
    border-bottom: 4px solid #222;
  }

  actions {
    border-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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
    width: 208px;
    height: 312px;
  }
</style>
