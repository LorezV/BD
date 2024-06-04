<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Input } from "../../components/form";
import { IPodcast, IPodcastCategory, IStream } from "@/interfaces";
import api from "@/api";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store";
import BroadcastCard from "../broadcast/BroadcastCard.vue";
import dayjs from "dayjs";

const userStore = useUserStore();
const route = useRoute();
const programs = ref<IPodcast | null>(null);
const stream = ref<IStream | null>(null);

onBeforeMount(async () => {
  const response = await api.get(`/stream/${route.params.broadcastId}`);
  if (response.status === 200) {
    stream.value = response.data;
  }

  header.value = stream.value?.header;
  description.value = stream.value?.description;
  startDate.value = dayjs(stream.value?.startDate).toDate().toString();
  endDate.value = dayjs(stream.value?.endDate).toDate().toString();
  coverLink.value = stream.value?.coverLink;
  postLink.value = stream.value?.postLink;
  podcastId.value = stream.value?.podcastId;

  const podcastsResponse = await api.get("/podcast", {
    params: {
      authorId: userStore.user?.id,
    },
  });
  if (podcastsResponse.status === 200) {
    programs.value = podcastsResponse.data;
  }
});

const header = ref("");
const description = ref("");
const coverLink = ref("");
const postLink = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const podcastId = ref(null);

async function submit() {
  const response = await api.post("/stream", {
    header: header.value,
    description: description.value,
    coverLink: coverLink.value,
    podcastId: podcastId.value,
    startDate: dayjs(startDate.value).toISOString(),
    endDate: dayjs(endDate.value).toDate(),
    postLink: postLink.value,
  });
}
</script>

<template>
  <div class="flex flex-1 flex-col mt-12" v-if="stream">
    <div class="flex flex-col gap-4 mt-8 mb-20">
      <Input type="text" label="Заголовок" v-model="header" />

      <textarea
        class="outline-none bg-zinc-800 px-2 py-3 rounded placeholder-zinc-400"
        placeholder="Описание"
        v-model="description"
      ></textarea>

      <Input type="text" label="Ссылка на обложку" v-model="coverLink" />

      <Input type="text" label="Ссылка на пост" v-model="postLink" />

      <Input type="datetime-local" label="Дата начала" v-model="startDate" />

      <Input type="datetime-local" label="Дата окончания" v-model="endDate" />

      <select
        class="outline-none bg-zinc-800 px-2 py-3 rounded"
        v-model="podcastId"
      >
        <option
          v-for="podcast in programs"
          :value="podcast.id"
          :label="podcast.header"
        ></option>
      </select>

      <button @click="submit" class="px-2 py-3 bg-zinc-800">Сохранть</button>
    </div>
  </div>
</template>
