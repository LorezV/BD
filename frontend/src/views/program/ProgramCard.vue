<script setup lang="ts">
import { IPodcast } from "@/interfaces";

defineProps<{
  program: IPodcast;
}>();
</script>

<template>
  <RouterLink
    class="flex px-4 pb-8"
    :to="{ name: 'program-view', params: { programId: program.id } }"
  >
    <div>
      <div
        class="w-16 h-16 bg-center bg-cover rounded"
        :style="{
          'background-image': `url(${program.coverLink})`,
        }"
      />
    </div>
    <div class="flex flex-col overflow-hidden ms-4">
      <div
        class="text-ellipsis inline-block whitespace-nowrap overflow-hidden w-full"
      >
        {{ program.header }}
      </div>
      <div
        class="text-ellipsis text-xs inline-block whitespace-nowrap overflow-hidden w-full"
      >
        {{ program.Author.firstName }} {{ program.Author.lastName }}
      </div>
    </div>
  </RouterLink>
</template>
