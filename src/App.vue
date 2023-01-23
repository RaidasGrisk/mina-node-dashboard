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
import BlockSnarks from './components/charts/BlockSnarks.vue'

import { ref } from 'vue'
import { useStore } from 'vuex'
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);
Chart.defaults.font.size = 10
Chart.defaults.font.family = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const store = useStore()
const generalStatsRef = ref()

// put charts into an array, then render in a v-for loop
// render as per the order in the list
const charts = [
  ActiveValidators,
  ActiveSnarkWorkers,
  LatestBlockCreators,
  TopValidatorsByStake,
  BlockTime,
  BlockRewards,
  BlockFees,
  BlockTransactions,
  BlockSnarks,
  StatsCard,
  StatsCard,
  StatsCard,
]

const reload = () => {
  generalStatsRef.value.getData()
}

</script>

<template>
  <n-config-provider :theme="store.getters['theme/getTheme']" :theme-overrides="store.getters['theme/getThemeOverrides']">
    <n-notification-provider>
      <n-loading-bar-provider>
        <n-layout>
          <header_ @logoClick="reload" />
          <n-layout-content content-style="max-width: 140vh; margin: 0 auto; padding: 2em;">
            <GeneralStats ref="generalStatsRef"/>
            <div style="padding: 3em 0em 3em 0em;">
              <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:3 xl:4 2xl:4" responsive="screen">
                <n-grid-item v-for="chart_ in charts">
                  <component v-bind:is="chart_"></component>
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
