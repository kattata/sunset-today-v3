<script setup lang="ts">
import { fetchSunsetTime, fetchBackground } from '@/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Coordinates, Countdown } from '@/types';
import { useCountdown } from '@/composables/useCountdown';
import { useDateFormatter } from '@/composables/useDateFormatter';

const route = useRoute();
const background = ref<string>('');
const lng = ref<Coordinates['lng']>(0);
const lat = ref<Coordinates['lat']>(0);
const sunsetTime = ref<string>('');
const errorMessage = ref<string>('');
const loading = ref<boolean>(true);
const countdown = ref<Countdown>({
  hours: '00',
  minutes: '00',
  seconds: '00'
});
const hasPassed = ref<boolean>(false);
const { formatDateAndTime } = useDateFormatter();

async function getLocationByTerm() {
  const res = await fetch(`https://api.api-ninjas.com/v1/geocoding?city=${route.query.term}`, {
    headers: {
      'X-Api-Key': import.meta.env.VITE_NINJA_API_KEY
    }
  });

  const data = await res.json();

  if (data) {
    lat.value = data[0].latitude;
    lng.value = data[0].longitude;
  }
}

async function getSunsetTime() {
  const sunset = await fetchSunsetTime(lat.value, lng.value);
  sunsetTime.value = sunset;
}

if (route.query.term === 'current') {
  watch([lng, lat], () => {
    if (lat.value === 0 && lng.value === 0) {
      return;
    }

    getSunsetTime()
      .then(() => loading.value = false);
  }, { immediate: true })
}

async function getBackground() {
  const backgroundUrl = await fetchBackground();
  if (!backgroundUrl) {
    return background.value = '';
  }
  background.value = backgroundUrl;
}

onMounted(async () => {
  // getBackground();
  if (route.query.term === 'current') {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        lng.value = position.coords.longitude;
        lat.value = position.coords.latitude;
      })
    }
  } else {
    getLocationByTerm()
      .then(() => getSunsetTime())
      .then(() => loading.value = false)
  }
})

setInterval(() => {
  if (!loading.value) {
    const { countdown: _countdown, hasPassed: _hasPassed } = useCountdown(sunsetTime.value);
    countdown.value = _countdown || { hours: '00', minutes: '00', seconds: '00' };
    hasPassed.value = _hasPassed;
  }
}, 1000)

const sunsetText = computed(() => {
  return route.query.term === 'current' ? 'Until sunset in your location' : `Until sunset in ${route.query.term}`;
})

</script>

<template>
  <main class="location">
    <img v-if="background" class="location__background" :src="background" alt="Background" />
    <div class="location__header">
      <RouterLink to="/" class="location__back">
        <img src="@/assets/icons/arrow.svg" />
        <div>Back</div>
      </RouterLink>
      <div>
        <span>Sunset at </span>
        <span>{{ sunsetTime && formatDateAndTime(sunsetTime) }}</span>
      </div>
    </div>
    <section class="location__content">
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="loading" class="location__countdown">00:00:00</p>
      <div v-else>
        <p>{{ hasPassed ? 'You missed it 😓' : '' }}</p>
        <p class="location__countdown">{{ countdown?.hours }}:{{ countdown?.minutes }}:{{ countdown?.seconds }}</p>
        <p>{{ sunsetText }}</p>
      </div>
    </section>
  </main>
</template>

<style lang="postcss" scoped>
.location {
  color: var(--color-white);
  text-transform: uppercase;
  background: var(--color-primary);

  &__background {
    width: 100vw;
    height: 100vh;
    filter: brightness(0.5);
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
    margin-bottom: 16px;
  }
}
</style>
