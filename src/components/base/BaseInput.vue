<script setup lang="ts">
import { computed } from "vue";

const emit = defineEmits(['update:modelValue']);

const props = defineProps<{
  modelValue: string;
  placeholder: string;
}>();

const value = computed({
  get: () => props.modelValue,
  set: newValue => emit('update:modelValue', newValue)
});

</script>

<template>
  <input type="text" :placeholder="props.placeholder" v-model="value">
</template>

<style lang="postcss" scoped>
input {
  background: transparent;
  border: 0;
  font-family: var(--font-family-base);
  text-transform: uppercase;
  color: var(--color-white);
  padding: 12px;
  border-radius: 0;
  outline: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.7);

  &::placeholder {
    color: var(--color-white);
    opacity: 0.7;
  }

  &:focus {
    outline: none;
  }
}
</style>
