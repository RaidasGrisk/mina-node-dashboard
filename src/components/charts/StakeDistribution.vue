<script setup>
import { ref, onMounted } from 'vue'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

import { BarChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { options } from './utils/defaultChartOptions'

Chart.register(...registerables);

const themeVars = useThemeVars()
const data = ref({})
const jsonData = ref({})

// deep copy or else it will leak to other chart components
const options_ = JSON.parse(JSON.stringify(options))
options_.scales.x.title.text = 'epoch'

const chartProps = {
  chartName: 'Stake held by top 20 validators ️🪧',
  additionalValues: [
    {value: null, text: '% in the current epoch', precision: 1},
    // {value: null, text: '% change over the last epoch', precision: 2}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    The chart shows the percentage of the total stake in the network that is controlled by the top 20 validators.
    This metric can be used to track the concentration of power in the network over time.
  </p>
  <p>
    Validators are selected to create new blocks based on the amount of stake they hold in the network,
    with a higher amount of stake resulting in a higher likelihood of being selected as a validator.
  </p>
  <p>
    The metric is an important factor in ensuring the decentralization and security of the network
    and can be used to monitor the distribution of power in the network over time.
    If the percentage of the stake held by the top validators remains relatively stable (or decreases) over time,
    it may indicate that the network is well-distributed and decentralized.
  </p>
  `
}

const loading = ref(false)

const loadData = async () => {

  loading.value = true

  // config
  const url = 'https://node-dashboard-bigquery-backend-2qz4wkdima-uc.a.run.app/stake_distribution'

  // API request
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  let response_ = await response.json()
  response_ = response_[0]
  jsonData.value = response_

  // set data element values
  data.value = {
    labels: response_.map(i => i.epoch),
    datasets: [
      {
        data: response_.map(i => (i.stake_pct_of_top_accounts * 100).toPrecision(3)),
        // borderColor: [themeVars.value.infoColor],
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = response_.slice(-1)[0].stake_pct_of_top_accounts * 100
  // chartProps.additionalValues[1].value = (
  //   response_.slice(-1)[0].stake_pct_of_top_accounts -
  //   response_.slice(-2)[0].stake_pct_of_top_accounts
  // ) * 100

  loading.value = false
}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData" :jsonData="jsonData">
    <BarChart :chartData="data" :width="150" :height="141" :options="options_" />
  </StatsCard>
</template>

<style scoped>

</style>
