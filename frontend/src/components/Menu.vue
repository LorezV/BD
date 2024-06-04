<script setup lang="ts">
import { PiBroadcast, PiMusicNote, PiNewspaper } from "vue3-icons/pi";

const menuItems = [
  {
    name: "Эфиры",
    icon: PiBroadcast,
    routeName: "broadcast-list",
  },
  {
    name: "Анонсы",
    icon: PiNewspaper,
    routeName: "announcement-list",
  },
  {
    name: "Подкасты",
    icon: PiMusicNote,
    routeName: "program-list",
  },
];
</script>

<template>
  <div class="flex justify-around bg-zinc-800 shadow-zinc-700 shadow-inner py-2 rounded-xl">
    <RouterLink
      v-for="item in menuItems"
      :to="{ name: item.routeName }"
      class="flex flex-col items-center"
    >
      <component class="text-xl" :is="item.icon"></component>
      <span class="text-sm">{{ item.name }}</span>
    </RouterLink>
  </div>
</template>
