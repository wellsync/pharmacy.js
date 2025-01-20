<script lang="ts">
  import Button from "./Button.svelte";
  import { decryptPrivateKey } from "../lib/crypto";

  export let wrapperKey: string;
  export let privateKey: string;
  export let decryptedPrivateKey: (key: CryptoKey) => void;

  let invalidPassword = false;
  let password = "";

  async function unlock() {
    try {
      const key = await decryptPrivateKey(wrapperKey, privateKey, password);
      decryptedPrivateKey(key);
    } catch (e) {
      console.error(e);
      invalidPassword = true;
    }
  }
</script>

<div class="fixed inset-0 transition-opacity" aria-hidden="true"></div>

<div class="fixed inset-0 z-10 w-screen overflow-y-auto">
  <div
    class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
  >
    <form
      on:submit|preventDefault={unlock}
      class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6"
    >
      <div>
        <div
          class="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="size-5 text-green-600"
            ><path
              fill-rule="evenodd"
              d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z"
              clip-rule="evenodd"
            /></svg
          >
        </div>
        <div class="mt-3 text-center sm:mt-5">
          <h3 class="text-base font-semibold text-gray-900" id="modal-title">
            Prescription Authorization
          </h3>
          <div class="mt-2">
            <p class="text-sm text-gray-500">
              Authenticate with your personal password to unlock prescription
              writing. Each prescription is securely signed with your personal
              private key, ensuring safety and accountability.
            </p>
          </div>

          <div class="mt-4">
            <input
              bind:value={password}
              type="password"
              class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            {#if invalidPassword}
              <p class="mt-2 text-sm text-red-600 text-left" id="email-error">
                Invalid password
              </p>
            {/if}
          </div>
        </div>
      </div>
      <div class="mt-4">
        <Button type="submit" full>Unlock</Button>
      </div>
    </form>
  </div>
</div>
