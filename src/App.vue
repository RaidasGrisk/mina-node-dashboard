<script setup>
import StatsCard from './components/StatsCard.vue'
import GeneralStats from './components/GeneralStats.vue'
import Chart1 from './components/Chart1.vue'
import Chart2 from './components/Chart2.vue'
import Chart3 from './components/Chart3.vue'
import footer_ from './components/footer_.vue'
import { ref } from 'vue'
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
Chart.defaults.font.size = 10
Chart.defaults.font.family = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const generalStatsRef = ref()

const reload = () => {
  generalStatsRef.value.getData()
}

</script>

<template>
  <n-config-provider>
    <n-notification-provider>

      <n-layout>
        <n-layout-header bordered>
          <n-page-header subtitle="">
            <template #title>
              <a href="/" style="text-decoration: none; color: inherit">
                <b>MINA protocol</b> <n-text depth="3"><br> Node dashboard</n-text>
              </a>
            </template>
            <template #header>

            </template>
            <template #avatar>
              <n-element>
                <n-avatar :size="64" style="margin-left: 1.7em;" class="logo" @click="reload">
                  <n-text style="font-size: 36px;">
                    🛰️
                  </n-text>
                </n-avatar>
              </n-element>
            </template>
            <template #extra>
              <n-dropdown trigger="hover" :options="[{label: 'mainnet'}, {label: 'berkeley'}]" @select="">
                <n-button tertiary type="info" size="large">
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill-opacity=".3" d="M23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7L12 21.5L23.64 7z" fill="currentColor"></path><path d="M3.53 10.95L12 21.5l8.47-10.55C20.04 10.62 16.81 8 12 8s-8.04 2.62-8.47 2.95z" fill="currentColor"></path></svg>
                    </n-icon>
                  </template>
                  Network
                </n-button>
              </n-dropdown>
            </template>
            <template #footer>
            </template>
          </n-page-header>
        </n-layout-header>

        <n-layout-content content-style="padding: 24px;">

          <br>
          <GeneralStats ref="generalStatsRef"/>
          <br>
          <br>

          <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen">
            <n-grid-item>
              <Chart1 />
            </n-grid-item>
            <n-grid-item>
              <Chart2 />
            </n-grid-item>
            <n-grid-item>
              <Chart3 />
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

          <br><br><br>
        </n-layout-content>
        <n-layout-footer bordered>
          <footer_ />
        </n-layout-footer>
      </n-layout>

    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>
.logo {
  will-change: filter;
  transition: filter .9s ease-out;
  transition: transform .6s ease-out;
  cursor: pointer;
}
.logo:hover {
  filter: drop-shadow(0 0 0.3em var(--info-color));
  transform: scale(1.1);
}

</style>
