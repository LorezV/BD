<script setup lang="ts">
import { PiUser } from "vue3-icons/pi";
import Menu from "@/components/Menu.vue";
import { useUserStore } from "../store";

const userStore = useUserStore();
let profileLinkName = "profile-view";
if (!userStore.user) {
  profileLinkName = "sign-in";
}
</script>

<template>
  <div
    class="container max-w-md mx-auto flex-1 flex flex-col relative overflow-hidden"
  >
    <div class="flex justify-between px-4 pt-2 items-center">
      <h2 class="font-pacifico">AudioTube</h2>
      <RouterLink :to="{ name: profileLinkName }">
        <PiUser class="w-5 h-5" />
      </RouterLink>
    </div>

    <div class="flex-1 flex flex-col overflow-y-auto">
      <RouterView />
    </div>

    <div class="absolute bottom-4 left-4 right-4">
      <Menu />
    </div>
  </div>
</template>
