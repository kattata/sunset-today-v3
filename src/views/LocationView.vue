<script setup lang="ts">
import { fetchLocationByTerm, getCurrentLocation, fetchSunsetTime } from '@/utils';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Coordinates, Countdown } from '@/types';
import { useCountdown } from '@/composables/useCountdown';
import { useDateFormatter } from '@/composables/useDateFormatter';

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
const { formatDateAndTime } = useDateFormatter();

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
  
  if(data) {
    position.value = {
      lat: data[0].latitude,
      lng: data[0].longitude
    };
  }
}

async function getSunsetTime () {
  const sunset = await fetchSunsetTime(position.value.lat, position.value.lng);
  sunsetTime.value = sunset;
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

  getSunsetTime();
}, {immediate: true})

setInterval(() => {
  const { countdown: _countdown, hasPassed: _hasPassed } = useCountdown(sunsetTime.value);
  countdown.value =  _countdown || { hours: '00', minutes: '00', seconds: '00' };
  hasPassed.value = _hasPassed;
}, 1000)


</script>

<template>
  <div class="location">
    <p class="location__sunset-time">{{ formatDateAndTime(sunsetTime) }}</p>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p v-else>{{ countdown?.hours }}:{{ countdown?.minutes }}:{{ countdown?.seconds }}</p>
  </div>
</template>

<style lang="postcss" scoped>
.location {
  color: black;
}

</style>
