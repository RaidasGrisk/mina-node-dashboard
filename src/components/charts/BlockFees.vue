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
options.scales.x.title.text = 'block'

const chartProps = {
  chartName: 'Fees per block 🏷️',
  additionalValues: [
    {value: null, text: 'MINA, last block', precision: 2},
    {value: null, text: '% change over the last 100 blocks', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
    <p>
      Every transaction has a fee. The sender is free to decide the size of the fee.
      Higher fee will increase the change of transaction being included into the next block.
    </p>
    <p>
      As a general rule, fees go up as the number of transactions over a period of time increase.
    </p>
    <p>
      The chart shows the sum of fees in MINA over all of the transactions included in a block.
    </p>
  `
}

const loading = ref(false)

const loadData = async () => {

  loading.value = true

  // config
  const url = 'https://graphql.minaexplorer.com/'
  const limit = store.getters['chainData/getBlockSpan']

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
          txFees
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
        data: response_.map(i => i.txFees / 1000000000),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = response_.slice(-1)[0].txFees / 1000000000
  chartProps.additionalValues[1].value = ((response_.slice(-1)[0].txFees /
    response_.slice(-100)[0].txFees) - 1 ) * 100

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
    <BarChart :chartData="data" :width="150" :height="120" :options="options" />
  </StatsCard>
</template>

<style scoped>

</style>
