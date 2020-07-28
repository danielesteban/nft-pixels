<script>
  import { account, hasWeb3Support } from '../services/contract';
  const onRequestAccount = () => account.request();

  $: formattedAccount = $account ? (
    `${$account.slice(0, 6)}...${$account.slice(-4)}`
  ) : undefined;
</script>

<account>
  {#if $account}
    {formattedAccount}
  {:else}
    <button
      class="primary"
      disabled={!hasWeb3Support}
      on:click={onRequestAccount}
    >
      Connect to wallet
    </button>
  {/if}
</account>

<style>
  account {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
