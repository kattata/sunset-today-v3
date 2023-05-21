<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  modifiers?: string[];
}>();

const buttonClasses = computed(() => {
  const modifiers = props.modifiers?.map(x => `button--${x}`).join(' ');

  return modifiers;
});

</script>
<template>
  <button class="button" :class="`${buttonClasses}`">
      <slot></slot>
  </button>
</template>

<style scoped lang="postcss">
.button {
  background: var(--color-white);
  border: 0;
  font-family: var(--font-family-base);
  padding: 12px 24px;
  text-transform: uppercase;
  border-radius: 24px;
  cursor: pointer;
  color: var(--color-black);
  font-weight: 300;
}
</style>
