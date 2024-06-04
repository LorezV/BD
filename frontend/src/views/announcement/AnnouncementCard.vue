<script setup lang="ts">
import { IStream } from "../../interfaces";

defineProps<{
  stream: IStream;
}>();
</script>

<template>
  <div class="flex px-4 pb-8">
    <div>
      <div
        class="w-24 h-24 bg-center bg-cover rounded"
        :style="{
          'background-image': `url(${stream.coverLink})`,
        }"
      />
    </div>
    <div class="flex flex-col overflow-hidden ms-4">
      <div
        class="text-ellipsis inline-block whitespace-nowrap overflow-hidden w-full"
      >
        {{ stream.header }}
      </div>
      <div
        class="text-ellipsis text-xs inline-block whitespace-nowrap overflow-hidden w-full"
      >
        {{ stream.Podcast.Author.firstName }}
        {{ stream.Podcast.Author.lastName }}
      </div>
      <div
        class="mt-auto text-ellipsis text-xs inline-block whitespace-nowrap overflow-hidden w-full"
      >
        {{ new Date(stream.startDate).toLocaleString() }}
      </div>
    </div>
  </div>
</template>
