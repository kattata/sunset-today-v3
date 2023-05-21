<template>
  <div class="background">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style lang="postcss">
:root {
  --circle-size-desktop: 50vh;
  --circle-offset-desktop: 25vh;
  
  --circle-size-mobile: 35vh;
  --circle-offset-mobile: 10vh;
}

.background {
  background-color: var(--color-primary);
  width: 100vw;
  height: 100vh;


  span {
    background-color: var(--color-secondary);
    height: 200px;
    width: 200px;
    border-radius: 50%;
    display: block;
    position: absolute;
    left: 50%;
    top: -5vh;
    transform: translateX(-50%);
    opacity: 0.15;

    &:nth-child(1) {
      height: var(--circle-size-desktop);
      width: var(--circle-size-desktop);
    }

    &:nth-child(2) {
      transform: translateX(-50%) translateY(calc(-1 * var(--circle-offset-desktop)));
      height: calc(var(--circle-size-desktop) * 2);
      width: calc(var(--circle-size-desktop) * 2);
    }

    &:nth-child(3) {
      transform: translateX(-50%) translateY(calc(-2 * var(--circle-offset-desktop)));
      height: calc(var(--circle-size-desktop) * 3);
      width: calc(var(--circle-size-desktop) * 3);
    }

    &:nth-child(4) {
      transform: translateX(-50%) translateY(calc(-3 * var(--circle-offset-desktop)));
      height: calc(var(--circle-size-desktop) * 4);
      width: calc(var(--circle-size-desktop) * 4);
    }

    &:nth-child(5) {
      transform: translateX(-50%) translateY(calc(-4 * var(--circle-offset-desktop)));
      height: calc(var(--circle-size-desktop) * 5);
      width: calc(var(--circle-size-desktop) * 5);
    }

    @media (max-width: 768px) {
      &:nth-child(1) {
        height: var(--circle-size-mobile);
        width: var(--circle-size-mobile);
      }

      &:nth-child(2) {
        transform: translateX(-50%) translateY(calc(-1 * var(--circle-offset-mobile)));
        height: calc(var(--circle-size-mobile) * 2);
        width: calc(var(--circle-size-mobile) * 2);
      }

      &:nth-child(3) {
        transform: translateX(-50%) translateY(calc(-2 * var(--circle-offset-mobile)));
        height: calc(var(--circle-size-mobile) * 3);
        width: calc(var(--circle-size-mobile) * 3);
      }

      &:nth-child(4) {
        transform: translateX(-50%) translateY(calc(-3 * var(--circle-offset-mobile)));
        height: calc(var(--circle-size-mobile) * 4);
        width: calc(var(--circle-size-mobile) * 4);
      }

      &:nth-child(5) {
        transform: translateX(-50%) translateY(calc(-4 * var(--circle-offset-mobile)));
        height: calc(var(--circle-size-mobile) * 5);
        width: calc(var(--circle-size-mobile) * 5);
      }
    }
  }
}
</style>