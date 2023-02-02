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
  chartName: 'Transactions per block 🔃',
  additionalValues: [
    {value: null, text: 'transactions, last block', precision: 0},
    {value: null, text: '% over the last 100 blocks', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    The number of transactions in each block is different. At maximum, 120 transactions can be included in each block.
  </p>
  <p>
    A higher number of transactions per block indicates an increase in the usage of the network,
    as more users are making transactions and requiring them to be processed and added to the blockchain.
  </p>
  <p>
    Transactions per block are important because it helps to gauge the network's capacity and overall health.
  </p>

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
        blocks(limit: ${limit}, query: {canonical: true}, sortBy: BLOCKHEIGHT_DESC) {
          transactions {
            userCommands {
              nonce
            }
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
        data: response_.map(i => i.transactions.userCommands.length),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = response_.slice(-1)[0].transactions.userCommands.length
  chartProps.additionalValues[1].value = ((
    response_.slice(-1)[0].transactions.userCommands.length /
    response_[0].transactions.userCommands.length
  ) - 1 ) * 100

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
