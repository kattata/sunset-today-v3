<script setup lang="ts">
const props = defineProps<{
  placeholder: string;
}>();
</script>

<template>
  <input type="text" :placeholder="props.placeholder">
</template>

<style>

</style>
