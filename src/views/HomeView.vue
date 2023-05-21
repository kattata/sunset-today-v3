<script setup lang="ts">
import BaseBackground from '@/components/base/BaseBackground.vue';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
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
  <div class="page">
    <BaseBackground />
    <main class="home">
      <section class="home__content">
        <h1 class="home__headline">Sunset Today</h1>
        <p class="home__subheadline">Find out how much time is left until the sunset near your location</p>
        <form @submit.prevent="handleLocationSearch">
          <BaseInput class="home__input" v-model="searchTerm" placeholder="Type in a city and press enter" />
          <p>or</p>
        </form>
        <form @submit.prevent="handleCurrentLocationSearch">
          <BaseButton class="home__button" type="submit">Use my location</BaseButton>
        </form>
      </section>
      <p class="home__credit">Powered by <a href="https://sunrise-sunset.org/api">sunrise-sunset.org</a></p>
    </main>
  </div>
</template>

<style lang="postcss" scoped>
.home {
  text-align: center;
  color: var(--color-white);

  &__content {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
  }

  &__headline {
    font-family: "Chromate";
    font-size: 100px;
    white-space: nowrap;
    margin-bottom: 16px;

    @media (max-width: 768px) {
      font-size: 44px;
    }
  }

  &__subheadline {
    margin-bottom: 32px;
  }

  &__input {
    width: 300px;
    text-align: center;
    margin-bottom: 16px;
  }

  &__button {
    margin-top: 16px;
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