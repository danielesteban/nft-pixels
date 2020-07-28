<script>
  import { account, hasWeb3Support } from '../services/contract';
  const onRequestAccount = () => account.request();
</script>

<account>
  {#if $account}
    {$account}
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
