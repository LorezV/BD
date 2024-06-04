<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { Input } from "../../components/form";
import { IPodcastCategory } from "@/interfaces";
import api from "@/api";

const header = ref("");
const description = ref("");
const coverLink = ref("");
const categoryId = ref(null);

const categories = ref<IPodcastCategory[]>([]);

onBeforeMount(async () => {
  const response = await api.get("/podcast/category");
  if (response.status === 200) {
    categories.value = response.data;
  }
});

async function submit() {
  const response = await api.post("/podcast", {
    header: header.value,
    description: description.value,
    coverLink: coverLink.value,
    categoryId: categoryId.value,
  });
}
</script>

<template>
  <div class="flex flex-1 flex-col mt-12">
    <div class="px-2">
      <h2 class="text-2xl">Создание подкаста</h2>
    </div>

    <div class="flex flex-col gap-4 mt-8">
      <Input type="text" label="Заголовок" v-model="header" />

      <textarea
        class="outline-none bg-zinc-800 px-2 py-3 rounded placeholder-zinc-400"
        placeholder="Описание"
        v-model="description"
      ></textarea>

      <Input type="text" label="Ссылка на обложку" v-model="coverLink" />

      <select
        class="outline-none bg-zinc-800 px-2 py-3 rounded"
        v-model="categoryId"
      >
        <option
          v-for="category in categories"
          :value="category.id"
          :label="category.name"
        ></option>
      </select>

      <button @click="submit" class="px-2 py-3 bg-zinc-800">Сохранть</button>
    </div>
  </div>
</template>
