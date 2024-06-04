<script setup lang="ts">
import { PiPlus } from "vue3-icons/pi";
import { CiFilter } from "vue3-icons/ci";
import { onBeforeMount, ref } from "vue";
import BroadcastCard from "./AnnouncementCard.vue";
import api from "@/api";

import { IStream } from "../../interfaces";

const streams = ref<IStream[] | null>(null);

onBeforeMount(async () => {
  const response = await api.get("/stream", {
    params: {
      typeId: 2,
    },
  });
  if (response.status === 200) {
    streams.value = response.data;
  }
});
</script>

<template>
  <div class="flex flex-1 flex-col mt-10">
    <div
      class="mx-4 bg-gradient-to-b from-pink-600 to-pink-700 rounded-xl relative pt-5 pb-10 flex flex-col items-center"
    >
      <h2 class="font-pacifico text-2xl">Эфиры</h2>

      <div class="absolute top-16 flex gap-1">
        <RouterLink
          :to="{ name: 'broadcast-create' }"
          class="bg-gradient-to-b from-green-600 to-green-700 rounded-xl w-14 h-14 flex items-center justify-center border-4 border-zinc-800 shadow-inner shadow-green-400"
        >
          <PiPlus />
        </RouterLink>
        <div
          class="bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl w-14 h-14 flex items-center justify-center border-4 border-zinc-800 shadow-inner shadow-blue-400"
        >
          <CiFilter />
        </div>
      </div>
    </div>

    <div
      class="flex-1 flex flex-col pb-20 mt-8"
      v-if="streams && streams.length > 0"
    >
      <BroadcastCard v-for="stream in streams" :stream />
    </div>
    <div class="px-4 mt-8" v-else>Эфиров пока нет</div>
  </div>
</template>
