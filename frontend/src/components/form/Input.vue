<script setup lang="ts">
const model = defineModel();
const props = defineProps<{
  type: string;
  label: string;
  disabled?: boolean;
}>();
</script>

<template>
  <label class="relative flex flex-col">
    <input
      :disabled="disabled"
      v-model="model"
      placeholder=" "
      :type="props.type"
      class="bg-zinc-800 rounded outline-none border-none px-2 pb-2 pt-4 font-medium"
    />
    <span
      class="absolute left-2 top-3 opacity-40 transition-all duration-100"
      >{{ props.label }}</span
    >
  </label>
</template>

<style lang="scss" scoped>
label {
  input {
    &:focus,
    &:not(:placeholder-shown) {
      & ~ span {
        @apply top-0 text-sm;
      }
    }
  }
}
</style>
