<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Input } from "../../components/form";
import { IPodcast, IPodcastCategory } from "@/interfaces";
import api from "@/api";
import { useUserStore } from "@/store";
import dayjs from "dayjs";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const header = ref("");
const description = ref("");
const coverLink = ref("");
const postLink = ref(null);
const startDate = ref(null);
const endDate = ref(null);
const podcastId = ref(null);

const podcasts = ref<IPodcast[]>([]);

onBeforeMount(async () => {
  const response = await api.get("/podcast", {
    params: {
      authorId: userStore.user?.id,
    },
  });
  if (response.status === 200) {
    podcasts.value = response.data;
  }
});

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
  if (response.status === 200) {
    router.push({
      name: "program-view",
      params: { programId: response.data.podcastId },
    });
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col mt-12">
    <div class="px-2">
      <h2 class="text-2xl">Создание подкаста</h2>
    </div>

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
          v-for="podcast in podcasts"
          :value="podcast.id"
          :label="podcast.header"
        ></option>
      </select>

      <button @click="submit" class="px-2 py-3 bg-zinc-800">Сохранть</button>
    </div>
  </div>
</template>
