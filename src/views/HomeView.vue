<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';


const router = useRouter();

const searchTerm = ref('');

function handleLocationSearch() {
  router.push({ name: 'location', query: { term: searchTerm.value } });
}

function handleCurrentLocationSearch() {
  router.push({ name: 'location', query: { term: 'current' } });
}
</script>

<template>
  <main>
    <h1>Sunset Today</h1>
    <p>Find out how much time is left until the sunset near your location.</p>
    <form @submit.prevent="handleLocationSearch">
      <input v-model="searchTerm" placeholder="Type in a city and press enter" />
      <p>or</p>
    </form>
    <form @submit.prevent="handleCurrentLocationSearch">
      <button type="submit">Use my location</button>
    </form>
    <p>Powered by SunriseSunset.io</p>
  </main>
</template>
