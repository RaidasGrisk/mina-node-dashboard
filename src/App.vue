<script setup>
import header_ from './components/header_.vue'
import footer_ from './components/footer_.vue'
import GeneralStats from './components/GeneralStats.vue'
import StatsCard from './components/StatsCard.vue'

import BlockTime from './components/charts/BlockTime.vue'
import ActiveValidators from './components/charts/ActiveValidators.vue'
import TotalValidators from './components/charts/TotalValidators.vue'
import ActiveSnarkWorkers from './components/charts/ActiveSnarkWorkers.vue'
import LatestBlockCreators from './components/charts/LatestBlockCreators.vue'
import TopValidatorsByBlocksProduced from './components/charts/TopValidatorsByBlocksProduced.vue'
import BlockRewards from './components/charts/BlockRewards.vue'
import BlockFees from './components/charts/BlockFees.vue'
import BlockTransactions from './components/charts/BlockTransactions.vue'
import BlockSnarks from './components/charts/BlockSnarks.vue'
import LatestSnarkCreators from './components/charts/LatestSnarkCreators.vue'
import StakeDistribution from './components/charts/StakeDistribution.vue'

import { ref, computed } from 'vue'
import { useBreakpoint } from 'vooks'
import { useStore } from 'vuex'
import { Chart, registerables } from 'chart.js'

import validatorMap from './components/map/validatorMap.vue'

Chart.register(...registerables)
Chart.defaults.font.size = 10
Chart.defaults.font.family = '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const store = useStore()
const breakpoint = useBreakpoint()
const generalStatsRef = ref()

// put charts into an array, then render in a v-for loop
// render as per the order in the list
const charts = [
  TotalValidators,
  ActiveValidators,
  LatestBlockCreators,
  TopValidatorsByBlocksProduced,
  ActiveSnarkWorkers,
  LatestSnarkCreators,
  BlockTime,
  BlockRewards,
  BlockFees,
  BlockTransactions,
  BlockSnarks,
  StakeDistribution,
  // StatsCard,
]

const reload = () => {
  generalStatsRef.value.getData()
}

const route = computed(() => {
  return window.location.pathname
})

</script>

<template>
  <n-config-provider :theme="store.getters['theme/getTheme']" :theme-overrides="store.getters['theme/getThemeOverrides']">
    <n-notification-provider>
      <n-loading-bar-provider>

          <!-- 
            Instead of using vue router which is overly complicated for this single use case,
            lets create a single route manually. By default, there are no routes, but if the route is
            equal to /validatorMap, then it will render one specific component and nothing else. 
          -->
        <span v-if="route == '/validatorMap'">
          <validatorMap />
        </span>
        <span v-else>
          <n-layout>
            <header_ @logoClick="reload" />
            <!-- This is not very conveniant, but it works 🤷 -->
            <n-layout-content
              :content-style="
                'margin: 0 auto;' +
                  (['xs'].includes(breakpoint) ? 'padding: 3em 2em 3em 2em;' : '') +
                  (['s'].includes(breakpoint) ? 'padding: 3em 3em 3em 3em;' : '') +
                  (['m'].includes(breakpoint)  ? 'padding: 6em 6em 6em 6em;' : '') +
                  (['l'].includes(breakpoint)  ? 'padding: 6em 10em 6em 10em;' : '') +
                  (['xl'].includes(breakpoint)  ? 'padding: 6em 20em 6em 20em;' : '') +
                  (['xxl', '2xl'].includes(breakpoint)  ? 'padding: 6em 25em 6em 25em;' : '')
                "
              >
              <GeneralStats ref="generalStatsRef"/>
              <div style="padding: 3em 0em 3em 0em;">
                <n-grid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:3 xl:3 2xl:4" responsive="screen">
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
        </span>
      </n-loading-bar-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped>

</style>
