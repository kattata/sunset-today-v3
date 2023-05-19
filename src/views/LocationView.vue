<script setup lang="ts">
import { fetchLocationByTerm, getCurrentLocation, fetchSunsetTime, fetchBackground } from '@/utils';
import { onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Coordinates, Countdown } from '@/types';
import { useCountdown } from '@/composables/useCountdown';
import { useDateFormatter } from '@/composables/useDateFormatter';

const route = useRoute();
const background = ref<string>('');
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

async function getBackground () {
  const backgroundUrl = await fetchBackground();
  if(!backgroundUrl) {
    return background.value = '';
  }
  background.value = backgroundUrl;  
}

onMounted(() => {
  getBackground();
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
  <main class="location">
    <img v-if="background" class="location__background" :src="background" alt="Background"/>
    <div v-else class="location__background-placeholder"></div>
    <div class="location__header">
      <RouterLink to="/" class="location__back">
        <img src="@/assets/icons/arrow.svg"/>
        <div>Back</div>
      </RouterLink>
      <div>
        <span>Sunset at </span>
        <span>{{ formatDateAndTime(sunsetTime) }}</span>
      </div>
    </div>
    <section class="location__content">
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <div v-else>
        <p class="location__countdown">{{ countdown?.hours }}:{{ countdown?.minutes }}:{{ countdown?.seconds }}</p>
        <p>Until sunset in {{ route.query.term }}</p>
      </div>
    </section>
  </main>
</template>

<style lang="postcss" scoped>
.location {
  color: var(--color-white);
  text-transform: uppercase;

  &__background {
    width: 100vw;
    height: 100vh;
    filter: brightness(0.5);
  }
  
  &__background-placeholder {
    width: 100vw;
    height: 100vh;
    background: var(--color-primary);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;

    img {
      width: 12px;
      height: 12px;
    }
  }
  
  &__back {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: var(--color-white);
  }

  &__content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  &__countdown {
    font-family: "Chromate";
    font-size: 100px;
    white-space: nowrap;
    margin-bottom: 32px;
  }
}

</style>
