<script setup lang="ts">
import { PiPlus } from "vue3-icons/pi";
import { CiFilter } from "vue3-icons/ci";
import { onBeforeMount, ref } from "vue";
import BroadcastCard from "./AnnouncementCard.vue";
import api from "@/api";
import { Input } from "../../components/form";

import { IPodcast, IStream, IStreamType } from "../../interfaces";
import dayjs from "dayjs";

const streams = ref<IStream[] | null>(null);
const streamTypes = ref<IStreamType[] | null>(null);
const podcasts = ref<IPodcast[] | null>(null);

const filterActive = ref(false);
const filterPodcastId = ref<number | undefined>();
const filterStartDate = ref<number | undefined>();
const filterEndDate = ref<number | undefined>();

async function fetchStreams() {
  const response = await api.get("/stream", {
    params: {
      typeId: 1,
      ...(filterPodcastId.value ? { podcastId: filterPodcastId.value } : {}),
      ...(filterStartDate.value
        ? { startDate: dayjs(filterStartDate.value).toDate() }
        : {}),
      ...(filterEndDate.value
        ? { endDate: dayjs(filterEndDate.value).toDate() }
        : {}),
    },
  });
  if (response.status === 200) {
    streams.value = response.data;
  }
}

onBeforeMount(async () => {
  await fetchStreams();

  const podcasstsResponse = await api.get("/podcast");
  if (podcasstsResponse.status === 200) {
    podcasts.value = podcasstsResponse.data;
  }

  const streamTypesResponse = await api.get("/stream/type");
  if (streamTypesResponse.status === 200) {
    streamTypes.value = streamTypesResponse.data;
  }
});
</script>

<template>
  <div class="flex flex-1 flex-col mt-10">
    <div
      class="mx-4 bg-gradient-to-b from-orange-600 to-orange-700 rounded-xl relative pt-5 pb-10 flex flex-col items-center"
    >
      <h2 class="font-pacifico text-2xl">Анонсы</h2>

      <div class="absolute top-16 flex gap-1">
        <RouterLink
          :to="{ name: 'broadcast-create' }"
          class="bg-gradient-to-b from-green-600 to-green-700 rounded-xl w-14 h-14 flex items-center justify-center border-4 border-zinc-800 shadow-inner shadow-green-400"
        >
          <PiPlus />
        </RouterLink>
        <div
          @click="filterActive = !filterActive"
          class="bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl w-14 h-14 flex items-center justify-center border-4 border-zinc-800 shadow-inner shadow-blue-400"
        >
          <CiFilter />
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-2 px-4 mt-8" v-if="filterActive">
      <h2>Фильтры</h2>

      <Input
        type="datetime-local"
        label="Дата начала"
        v-model="filterStartDate"
      />

      <Input
        type="datetime-local"
        label="Дата окончания"
        v-model="filterEndDate"
      />

      <label class="flex flex-col">
        <span>Подкаст</span>
        <select
          class="outline-none bg-zinc-800 px-2 py-3 rounded"
          v-model="filterPodcastId"
        >
          <option
            v-for="podcast in podcasts"
            :value="podcast.id"
            :label="podcast.header"
          ></option>
        </select>
      </label>

      <button @click="fetchStreams">Применить</button>
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
