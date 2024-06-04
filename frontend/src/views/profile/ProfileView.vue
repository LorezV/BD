<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../store";
import { CiUser } from "vue3-icons/ci";
import { Input } from "../../components/form";
import api from "@/api";

const userStore = useUserStore();

const email = ref("");
const phoneNumber = ref("");
const firstName = ref("");
const lastName = ref("");

onBeforeMount(async () => {
  await userStore.fetchUser();

  if (userStore.user) {
    email.value = userStore.user.email;
    phoneNumber.value = userStore.user.phoneNumber;
    firstName.value = userStore.user.firstName;
    lastName.value = userStore.user.lastName;
  }
});

async function submit() {
  const resposne = await api.put("/user/me", {
    email: email.value,
    phoneNumber: phoneNumber.value,
    firstName: firstName.value,
    lastName: lastName.value,
  });
  if (resposne.status === 200) {
    await userStore.fetchUser();
  }
}
</script>

<template>
  <div
    class="mx-4 mt-10 bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl relative pt-5 pb-10 flex flex-col items-center"
  >
    <h2 class="font-pacifico text-2xl">
      {{ userStore.user?.firstName }} {{ userStore.user?.lastName }}
    </h2>

    <div class="absolute top-16 flex gap-1">
      <div
        class="bg-gradient-to-b from-blue-600 to-blue-700 rounded-xl w-14 h-14 flex items-center justify-center border-4 border-zinc-800 shadow-inner shadow-blue-400"
      >
        <CiUser />
      </div>
    </div>
  </div>

  <div class="flex flex-col gap-4 px-4 mt-12">
    <Input type="text" label="Почта" v-model="email" />
    <Input type="text" label="Номер телефона" v-model="phoneNumber" />
    <Input type="text" label="Имя" v-model="firstName" />
    <Input type="text" label="Фамилия" v-model="lastName" />
    <button @click="submit" class="px-2 py-3 bg-zinc-800">Сохранть</button>
    <button
      @click="userStore.logOut"
      class="px-2 py-3 bg-zinc-800 text-red-400"
    >
      Выйти
    </button>
  </div>
</template>
