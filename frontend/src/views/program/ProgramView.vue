<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Input } from "../../components/form";
import { IPodcast, IPodcastCategory, IStream } from "@/interfaces";
import api from "@/api";
import { useRoute } from "vue-router";
import { useUserStore } from "@/store";
import BroadcastCard from "../broadcast/BroadcastCard.vue";

const route = useRoute();
const userStore = useUserStore();
const program = ref<IPodcast | null>(null);
const streams = ref<IStream[]>([]);

onBeforeMount(async () => {
  const response = await api.get(`/podcast/${route.params.programId}`);
  if (response.status === 200) {
    program.value = response.data;
  }

  const streamsResponse = await api.get("/stream", {
    params: { podcastId: program.value?.id },
  });
  if (streamsResponse.status === 200) {
    streams.value = streamsResponse.data;
  }

  const responseCategories = await api.get("/podcast/category");
  if (response.status === 200) {
    categories.value = responseCategories.data;
  }

  if (program.value) {
    header.value = program.value?.header;
    description.value = program.value?.description;
    coverLink.value = program.value?.coverLink;
    categoryId.value = program.value?.categoryId;
  }

  console.log(userStore.user?.id, program.value?.authorId);
});

const header = ref(program.value?.header || "");
const description = ref(program.value?.description || "");
const coverLink = ref(program.value?.coverLink || "");
const categoryId = ref(program.value?.categoryId || null);

const categories = ref<IPodcastCategory[]>([]);

async function submit() {
  const response = await api.put(`/podcast/${program.value?.id}`, {
    header: header.value,
    description: description.value,
    coverLink: coverLink.value,
    categoryId: categoryId.value,
  });
}
</script>

<template>
  <div class="flex flex-1 flex-col mt-12" v-if="program">
    <div class="flex flex-col gap-4 mt-8">
      <Input
        type="text"
        label="Заголовок"
        v-model="header"
        :disabled="program.authorId !== userStore.user?.id"
      />

      <textarea
        class="outline-none bg-zinc-800 px-2 py-3 rounded placeholder-zinc-400"
        placeholder="Описание"
        v-model="description"
        :disabled="program.authorId !== userStore.user?.id"
      ></textarea>

      <Input
        type="text"
        label="Ссылка на обложку"
        v-model="coverLink"
        :disabled="program.authorId !== userStore.user?.id"
      />

      <select
        class="outline-none bg-zinc-800 px-2 py-3 rounded"
        v-model="categoryId"
        :disabled="program.authorId !== userStore.user?.id"
      >
        <option
          v-for="category in categories"
          :value="category.id"
          :label="category.name"
        ></option>
      </select>

      <button
        @click="submit"
        class="px-2 py-3 bg-zinc-800"
        v-if="program.authorId === userStore.user?.id"
      >
        Сохранть
      </button>
    </div>

    <div>
      <div class="flex-1 flex flex-col pb-20 mt-10" v-if="streams?.length">
        <BroadcastCard v-for="stream in streams" :stream />
      </div>
      <div class="mt-10 px-4" v-else>
        Автор ещё не проводил эфиров в этом подкасте
      </div>
    </div>
  </div>
</template>
