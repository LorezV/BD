<script setup lang="ts">
import { Input } from "@/components/form";
import { useUserStore } from "@/store";
import { ref } from "vue";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

const email = ref("");
const password = ref("");

async function submit() {
  if (email.value.length > 4 && password.value.length > 6) {
    try {
      await userStore.signIn(email.value, password.value);
      await userStore.fetchUser();
      if (userStore.user) {
        router.push({ name: "profile-view" });
      }
    } catch (error: unknown) {}
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

      <div class="px-2 mt-2 text-center">
        <span class="text-sm"
          >Если у вас ещё нет аккаунта, то вы можете<br />
          <RouterLink class="underline" :to="{ name: 'sign-up' }"
            >зарегистрировать его.</RouterLink
          ></span
        >
      </div>
    </div>

    <div class="flex flex-col">
      <button
        @click="submit"
        class="bg-zinc-800 px-2 py-3 rounded tracking-wide uppercase"
      >
        Войти
      </button>
    </div>
  </div>
</template>
