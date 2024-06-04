<script setup lang="ts">
import { Input } from "@/components/form";
import { useUserStore } from "@/store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const email = ref("");
const password = ref("");
const phoneNumber = ref("");
const firstName = ref("");
const lastName = ref("");

async function submit() {
  if (
    email.value.length > 4 &&
    password.value.length > 6 &&
    phoneNumber.value.length > 6 &&
    firstName.value.length > 3 &&
    lastName.value.length > 3
  ) {
    try {
      await userStore.signUp(
        email.value,
        password.value,
        phoneNumber.value,
        firstName.value,
        lastName.value
      );
      await userStore.fetchUser();
      if (userStore.user) {
        router.push({ name: "profile-view" });
      }
    } catch (error: unknown) {
      console.error(error);
    }
  }
}
</script>

<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-col justify-center flex-1">
      <div class="px-2">
        <Input type="email" label="Почта" v-model="email" />
      </div>

      <div class="px-2 mt-4">
        <Input type="password" label="Пароль" v-model="password" />
      </div>

      <div class="px-2 mt-4">
        <Input type="tel" label="Номер телефона" v-model="phoneNumber" />
      </div>

      <div class="px-2 mt-4">
        <Input type="text" label="Имя" v-model="firstName" />
      </div>

      <div class="px-2 mt-4">
        <Input type="text" label="Фамилия" v-model="lastName" />
      </div>

      <div class="px-2 mt-2 text-center">
        <span class="text-sm"
          >Если уже есть аккаунт,
          <RouterLink class="underline" :to="{ name: 'sign-in' }"
            >войдите в него.</RouterLink
          ></span
        >
      </div>
    </div>

    <div class="flex flex-col">
      <button
        @click="submit"
        class="bg-zinc-800 px-2 py-3 rounded tracking-wide uppercase"
      >
        ДАЛЕЕ
      </button>
    </div>
  </div>
</template>
