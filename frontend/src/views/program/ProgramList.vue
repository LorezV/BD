<script setup lang="ts">
import { PiPlus } from "vue3-icons/pi";
import { CiFilter } from "vue3-icons/ci";
import ProgramCard from "./ProgramCard.vue";
import { onBeforeMount, ref } from "vue";
import { IPodcast } from "@/interfaces";
import api from "@/api";
import { useUserStore } from "@/store";

const programs = ref<IPodcast[] | null>(null);

const userStore = useUserStore();

onBeforeMount(async () => {
  try {
    const response = await api.get<IPodcast[]>("/podcast");
    if (response.status === 200) {
      programs.value = response.data;
    }
  } catch (error: unknown) {
    console.error(error);
  }
});
</script>

<template>
  <div class="flex flex-1 flex-col mt-10">
    <div
      class="mx-4 bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl relative pt-5 pb-10 flex flex-col items-center"
    >
      <h2 class="font-pacifico text-2xl">Подкасты</h2>

      <div class="absolute top-16 flex gap-1">
        <RouterLink
          :to="{ name: 'program-create' }"
          v-if="userStore.user?.typeId == 3"
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

    <div class="flex-1 flex flex-col pb-20 mt-10" v-if="programs?.length">
      <ProgramCard v-for="program of programs" :program />
    </div>
    <div class="mt-10 px-4" v-else>Ещё не создан ни один подкаст</div>
  </div>
</template>
