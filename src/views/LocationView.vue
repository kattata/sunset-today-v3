<script setup lang="ts">
import { getRemainingTime } from '@/utils';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { zonedTimeToUtc } from 'date-fns-tz';
import type { Coordinates, Countdown } from '@/types';

const route = useRoute();
const position = ref<Coordinates>({
  lat: '0',
  lng: '0'
});
const sunsetTime = ref<string>('');
const errorMessage = ref<string>('');
const countdown = ref<Countdown>({
  hours: '00',
  minutes: '00',
  seconds: '00'
});
const hasPassed = ref<boolean>(false);

function getGeolocation (){
  
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(((geolocation: any) => {
      position.value = {
        lat: geolocation.coords.latitude,
        lng: geolocation.coords.longitude
      };
    }));
  } else {
    errorMessage.value = "Geolocation is not supported by this browser.";
  }
}

async function getLocation() {
  const res = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${route.query.term}`, {
    headers: {
      'X-Api-Key': import.meta.env.VITE_API_KEY
    }
  });
  const data = await res.json();
  position.value = {
    lat: data[0].latitude,
    lng: data[0].longitude
  };
}

async function fetchSunsetTime () {
  const res = await fetch(`https://api.sunrise-sunset.org/json?lat=${position.value.lat}&lng=${position.value.lng}&formatted=0&timezone=UTC`);
  const data = await res.json();

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const utcDate = zonedTimeToUtc(data.results.sunset, timezone); 
  sunsetTime.value = String(utcDate);
}

onMounted(() => {
  if(route.query.term === 'current') {
    getGeolocation();
  } else {
    getLocation();
  }
})

watch(position, () => {
  if(!position.value.lat || !position.value.lng) {
    return;
  }

  fetchSunsetTime();
})

setInterval(() => {
  const { countdown: _countdown, hasPassed: _hasPassed } = getRemainingTime(sunsetTime.value);
  countdown.value =  _countdown || { hours: '00', minutes: '00', seconds: '00' };
  hasPassed.value = _hasPassed;
}, 1000)


</script>

<template>
  <div class="location">
    <p class="location__sunset-time">{{ sunsetTime }}</p>
    <p>{{ errorMessage }}</p>
    <p>{{ countdown?.hours }}:{{ countdown?.minutes }}:{{ countdown?.seconds }}</p>
  </div>
</template>

<style>

</style>
