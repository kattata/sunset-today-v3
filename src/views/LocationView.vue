<script setup lang="ts">
import { getRemainingTime } from '@/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const position = ref<any>({});
const sunsetTime = ref<string>('');
const errorMessage = ref<string>('');

function getGeolocation (){
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(((geolocation: any) => {
      position.value = {
        lat: geolocation.coords.latitude,
        lng: geolocation.coords.longitude
      };
    }));
  } else {
    errorMessage.value= "Geolocation is not supported by this browser.";
  }
}

async function fetchSunsetTime () {
  const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${position.value.lat}&lng=${position.value.lng}&formatted=0`);
  const data = await res.json();

  // const formattedTime = new Date(data.results.sunset).toLocaleString('da-DK', { timeZone: 'Europe/Copenhagen' });
  sunsetTime.value = data.results.sunset; 
}

onMounted(() => {
  if(route.query.term === 'current') {
    getGeolocation();
  }

  if(!position.value) {
    return;
  }

  fetchSunsetTime();
})

const countdown = computed(() => {
    return getRemainingTime(sunsetTime.value);
})


</script>

<template>
  <div class="location">
    <p class="location__sunset-time">{{ sunsetTime }}</p>
    <p>{{ errorMessage }}</p>
    <p>{{ countdown.hours }}:{{ countdown.minutes }}:{{ countdown.seconds }}</p>
  </div>
</template>

<style>

</style>
