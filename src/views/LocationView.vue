<script setup lang="ts">
import { fetchLocationByTerm, getCurrentLocation } from '@/utils';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { zonedTimeToUtc } from 'date-fns-tz';
import type { Coordinates, Countdown } from '@/types';
import { useCountdown } from '@/composables/useCountdown';

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

async function getGeolocation (){
  const { data, error } = await getCurrentLocation();
  if(data) {
    position.value = {
        lat: data.lat,
        lng: data.lng
      };
  } else {
    errorMessage.value = error;
  }
}

async function getLocationByTerm() {
  const { data } = await fetchLocationByTerm(String(route.query.term));
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
    getLocationByTerm();
  }
})

watch(position, () => {
  if(!position.value.lat || !position.value.lng) {
    return;
  }

  fetchSunsetTime();
})

setInterval(() => {
  const { countdown: _countdown, hasPassed: _hasPassed } = useCountdown(sunsetTime.value);
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
