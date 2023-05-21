<script setup lang="ts">
import { fetchSunsetTime, fetchBackground, fetchLocationByTerm } from '@/utils';
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import type { Coordinates, Countdown, UnsplashCredits } from '@/types';
import { useCountdown } from '@/composables/useCountdown';
import { useDateFormatter } from '@/composables/useDateFormatter';

const route = useRoute();
const { formatDateAndTime } = useDateFormatter();

const background = ref<string>('');
const credits = ref<UnsplashCredits | null>(null);
const lng = ref<Coordinates['lng']>(0);
const lat = ref<Coordinates['lat']>(0);
const sunsetTime = ref<string>('');
const errorMessage = ref<string>('');
const loading = ref<boolean>(true);
const hasPassed = ref<boolean>(false);
const countdown = ref<Countdown | null>(null);

const sunsetText = computed(() => {
  return route.query.term === 'current' ? 'Until sunset in your location' : `Until sunset in ${route.query.term}`;
});

// Data fetching
async function getLocationByTerm() {
  const data = await fetchLocationByTerm(String(route.query.term));

  if (data) {
    lat.value = data[0].latitude;
    lng.value = data[0].longitude;
  }
}

async function getSunsetTime() {
  const sunset = await fetchSunsetTime(lat.value, lng.value);
  sunsetTime.value = sunset;
}

async function getBackground() {
  const {url, credits: _credits } = await fetchBackground();

  if (!url) {
    return background.value = '';
  }
  credits.value = _credits;
  background.value = url;
}

function getCurrentLocation() {
  if (!navigator.geolocation) {
    console.log('Geolocation is not supported by your browser');
  }

  navigator.geolocation.getCurrentPosition((position: any) => {
    lng.value = position.coords.longitude;
    lat.value = position.coords.latitude;
  })
}

onMounted(async () => {
  getBackground();
  if (route.query.term === 'current') {
    getCurrentLocation();
  } else {
    getLocationByTerm();
  }
})

watch([lng, lat], () => {
  if (lat.value === 0 && lng.value === 0) {
    return;
  }

  getSunsetTime()
    .then(() => loading.value = false);
}, { immediate: true })

// Initialize countdown
setInterval(() => {
  if (!loading.value) {
    const { countdown: _countdown, hasPassed: _hasPassed } = useCountdown(sunsetTime.value);
    countdown.value = _countdown || null;
    hasPassed.value = _hasPassed;
  }
}, 1000)

</script>

<template>
  <main class="location">
    <Transition name="fade">
      <img v-if="background" class="location__background" :src="background" alt="Background" />
    </Transition>
    <p v-if="credits" class="location__credit">Photo by <a :href="credits.profileUrl">{{ credits.author }}</a> on <a href="https://unsplash.com/?utm_source=SunsetTodayV3&utm_medium=referral">Unsplash</a></p>
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
      <Transition name="fade-in">
        <div v-if="countdown">
          <p>{{ hasPassed ? 'You missed it 😓' : '' }}</p>
          <p class="location__countdown">{{ countdown?.hours }}:{{ countdown?.minutes }}:{{ countdown?.seconds }}</p>
          <p>{{ sunsetText }}</p>
        </div>
      </Transition>
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
    object-fit: cover;
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

    @media (max-width: 768px) {
      white-space: normal;
      font-size: 44px;
    }
  }

  &__credit {
    left: 50%;
    transform: translateX(-50%);
    font-size: 12px;
    position: absolute;
    bottom: 16px;
    opacity: 0.7;
    text-align: center;

    a {
      color: var(--color-white);
    }
  }
}

</style>
