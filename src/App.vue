<script setup>
import header_ from './components/header_.vue'
import footer_ from './components/footer_.vue'
import GeneralStats from './components/GeneralStats.vue'
import StatsCard from './components/StatsCard.vue'

import BlockTime from './components/charts/BlockTime.vue'
import ActiveValidators from './components/charts/ActiveValidators.vue'
import ActiveSnarkWorkers from './components/charts/ActiveSnarkWorkers.vue'
import LatestBlockCreators from './components/charts/LatestBlockCreators.vue'
import TopValidatorsByStake from './components/charts/TopValidatorsByStake.vue'
import BlockRewards from './components/charts/BlockRewards.vue'
import BlockFees from './components/charts/BlockFees.vue'
import BlockTransactions from './components/charts/BlockTransactions.vue'

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

        <n-layout content-style="max-width: 132vh; margin: 0 auto; padding: 2em;">
          <header_ @logoClick="reload" />
          <n-layout-content content-style="padding: 3em 0em 3em 0em;">
            <GeneralStats ref="generalStatsRef"/>
            <div style="padding: 3em 0em 3em 0em;">
              <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4 xl:4 2xl:4" responsive="screen">
                <n-grid-item>
                  <ActiveValidators />
                </n-grid-item>
                <n-grid-item>
                  <ActiveSnarkWorkers />
                </n-grid-item>
                <n-grid-item>
                  <LatestBlockCreators />
                </n-grid-item>
                <n-grid-item>
                  <TopValidatorsByStake />
                </n-grid-item>
                <n-grid-item>
                  <BlockTime />
                </n-grid-item>
                <n-grid-item>
                  <BlockRewards />
                </n-grid-item>
                <n-grid-item>
                  <BlockFees />
                </n-grid-item>
                <n-grid-item>
                  <BlockTransactions />
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
            </div>
          </n-layout-content>
        </n-layout>

        <n-layout-footer bordered>
          <footer_ />
        </n-layout-footer>

      </n-loading-bar-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
