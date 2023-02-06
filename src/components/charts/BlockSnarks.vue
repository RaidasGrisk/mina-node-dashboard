<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { options } from './utils/defaultChartOptions'

Chart.register(...registerables);

const themeVars = useThemeVars()
const store = useStore()
const data = ref({})
const jsonData = ref({})

// deep copy or else it will leak to other chart components
const options_ = JSON.parse(JSON.stringify(options))
options_.scales.x.title.text = 'block'

const chartProps = {
  chartName: 'Snarks per block 🦺',
  additionalValues: [
    {value: null, text: 'snarks'},
    {value: null, text: 'avg. over the last 100 blocks', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    The number of SNARKs produced per block is an indicator of the network's ability to generate and include
    these proofs in a timely manner, and is an important factor in maintaining the security and privacy of the network.
  </p>
  <p>
    A higher number of SNARKs produced per block indicates a more efficient network,
    as more transactions can be verified and added to the blockchain in a shorter amount of time.
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
        blocks(query: {canonical: true}, limit: ${limit}, sortBy: BLOCKHEIGHT_DESC) {
          blockHeight
          snarkJobs {
            workIds
          }
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // reverse
  response_ = response_.data.blocks.reverse()
  response_ = response_.map(i => {
    return {
      blockHeight: i.blockHeight,
      snarks: i.snarkJobs.length
    }
  })
  jsonData.value = response_

  // set data element values
  data.value = {
    labels: response_.map(i => i.blockHeight),
    datasets: [
      {
        data: response_.map(i => i.snarks),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  let array_ = response_.map(i => i.snarks)
  chartProps.additionalValues[0].value = array_.slice(-1)[0]
  chartProps.additionalValues[1].value = array_.reduce((a, b) => a + b, 0) / array_.length

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
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData" :jsonData="jsonData">
    <BarChart :chartData="data" :width="150" :height="120" :options="options_" />
  </StatsCard>
</template>

<style scoped>

</style>
