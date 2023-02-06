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
  chartName: 'Total validators 👷',
  additionalValues: [
    {value: null, text: 'validators'},
    {value: null, text: 'new validators this epoch', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    Above all, validators are pieces of hardware that run Mina software. The combination of all the validators and SNARK workers forms the foundation of Mina network.
  </p>
  <p>
    Validators are maintained primarily by Mina community and volunteers, who typically dedicate separate hardware to the process.
  </p>
  <p>
    The chart shows the number of <b>total</b> validators, i.e. validators that produced at least 1 block since the inception of the network.
  </p>
  `
}

const loading = ref(false)

const loadData = async () => {

  loading.value = true

  // config
  const url = 'https://node-dashboard-bigquery-backend-2qz4wkdima-uc.a.run.app/all_time_validators'

  // API request
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  let response_ = await response.json()

  jsonData.value = response_

  // set data element values
  data.value = {
    labels: response_.map(i => i.epoch),
    datasets: [
      {
        data: response_.map(i => i.validator),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = response_.slice(-1)[0].validator
  chartProps.additionalValues[1].value = response_.slice(-1)[0].validator - response_.slice(-2)[0].validator

  loading.value = false
}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData" :jsonData="jsonData">
    <BarChart :chartData="data" :width="150" :height="120" :options="options_" />
  </StatsCard>
</template>

<style scoped>

</style>
