<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { options } from './defaultChartOptions'

Chart.register(...registerables);

const themeVars = useThemeVars()
const store = useStore()
const data = ref({})

// deep copy or else it will leak to other chart components
const options_ = JSON.parse(JSON.stringify(options))
options_.scales.x.title.text = 'block'

const chartProps = {
  chartName: 'Block rewards 🔖',
  additionalValues: [
    {value: null, text: 'MINA, last block', precision: 0},
    {value: null, text: 'MINA, on average last 100 blocks', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
    <p>
      Block reward is a reward given to a validator for creating a block.
    </p>
    <p>
      The reward for producing a block is 720 MINA. Supercharged rewards are 1440 Mina
      (will likely be removed as per <a href="https://github.com/MinaProtocol/MIPs/blob/main/MIPS/mip-remove-supercharged-rewards.md" target="_blank">MIP<a/>).
    </p>
    <p>
      The logic behind block rewards is to incentivize validators to secure and maintain the network by providing them with a reward for their efforts.
    <p/>
  `
}

const loading = ref(false)

const loadData = async () => {

  loading.value = true

  // config
  const url = 'https://graphql.minaexplorer.com/'
  const limit = store.getters['settings/getBlockSpan']

  // API request
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      query MyQuery {
        blocks(query: {canonical: true}, limit: ${limit}, sortBy: BLOCKHEIGHT_DESC) {
          transactions {
            coinbase
          }
          blockHeight
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // reverse
  response_ = response_.data.blocks.reverse()

  // set data element values
  data.value = {
    labels: response_.map(i => i.blockHeight),
    datasets: [
      {
        data: response_.map(i => i.transactions.coinbase / 1000000000),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = response_.slice(-1)[0].transactions.coinbase / 1000000000
  chartProps.additionalValues[1].value = response_.slice(-100).reduce(
    (total, next) => total + next.transactions.coinbase / 1000000000, 0
  ) / 100

  loading.value = false
}

onMounted( async () => {
  loadData()
})

// this adds complexity but here goes
// wathc for store changes and reload data
watch(
  () => store.getters['settings/getBlockSpan'], (curr, prev) => {
    if (curr != prev) {
      loadData()
    }
  }
)

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <BarChart :chartData="data" :width="150" :height="120" :options="options_" />
  </StatsCard>
</template>

<style scoped>

</style>
