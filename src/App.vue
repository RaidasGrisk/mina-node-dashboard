<script setup>
import StatsCard from './components/StatsCard.vue'
import { ref } from 'vue'

</script>

<template>

  <n-layout>
    <n-layout-header>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
          <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
      </div>
    </n-layout-header>
    <n-layout-content content-style="padding: 24px;">

      <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4 xl:5 2xl:5" responsive="screen">
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
        <n-grid-item>
          <StatsCard />
        </n-grid-item>
      </n-grid>

    </n-layout-content>
    <n-layout-footer>
      Footer
    </n-layout-footer>
  </n-layout>



</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.n-card {
  transform: translate3d(0px, 20px, 0) scale(0.95);
}

</style>
