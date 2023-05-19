<template>
  <div class="background">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</template>

<style scoped lang="postcss">

.background {
  background-color: var(--color-primary);
  width: 100vw;
  height: 100vh;
}

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
    height: 50vh;
    width: 50vh;
  }
  
  &:nth-child(2) {
    transform: translateX(-50%) translateY(-25vh);
    height: 100vh;
    width: 100vh;
  }
  
  &:nth-child(3) {
    transform: translateX(-50%) translateY(-50vh);
    height: 150vh;
    width: 150vh;
  }
  
  &:nth-child(4) {
    transform: translateX(-50%) translateY(-75vh);
    height: 200vh;
    width: 200vh;
  }
  
  &:nth-child(5) {
    transform: translateX(-50%) translateY(-100vh);
    height: 250vh;
    width: 250vh;
  }
}

  
</style>