<script setup>
import header_ from './components/header_.vue'
import StatsCard from './components/StatsCard.vue'
import GeneralStats from './components/GeneralStats.vue'
import Chart1 from './components/Chart1.vue'
import Chart2 from './components/Chart2.vue'
import Chart3 from './components/Chart3.vue'
import Chart4 from './components/Chart4.vue'
import Chart5 from './components/Chart5.vue'
import Chart6 from './components/Chart6.vue'
import Chart7 from './components/Chart7.vue'
import Chart8 from './components/Chart8.vue'
import footer_ from './components/footer_.vue'
import { ref } from 'vue'
import { useThemeVars } from 'naive-ui'
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
Chart.defaults.font.size = 10
Chart.defaults.font.family = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const generalStatsRef = ref()
const themeVars = useThemeVars()

const reload = () => {
  generalStatsRef.value.getData()
}

</script>

<template>
  <n-config-provider>
    <n-notification-provider>
      <n-loading-bar-provider>

        <n-layout>
          <header_ @logoClick="reload" />
          <n-layout-content content-style="padding: 3em 0em 3em 0em;">
            <GeneralStats ref="generalStatsRef"/>
            <div style="padding: 3em 0em 3em 0em;">
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
                  <Chart4 />
                </n-grid-item>
                <n-grid-item>
                  <Chart5 />
                </n-grid-item>
                <n-grid-item>
                  <Chart6 />
                </n-grid-item>
                <n-grid-item>
                  <Chart7 />
                </n-grid-item>
                <n-grid-item>
                  <Chart8 />
                </n-grid-item>
              </n-grid>
            </div>
          </n-layout-content>
          <n-layout-footer bordered>
            <footer_ />
          </n-layout-footer>
        </n-layout>

      </n-loading-bar-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
