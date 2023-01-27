<script setup>
import { ref, onMounted } from 'vue'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const themeVars = useThemeVars()

const data = ref({})
const options = {
  plugins: {
    legend: {display: false}
  },
  scales: {
    x: {
      ticks: {
        display: false
      },
      title: {
        display: true,
        text: 'epoch',
      },
      display: true,
      border: {
        display: false
      },
      grid: {
        drawBorder: false,
        display: false,
        drawOnChartArea: false,
        drawTicks: false,
      }
    },
    y: {
      display: false,
      border: {
        display: false
      },
      grid: {
        display: false,
        drawOnChartArea: false,
        drawTicks: false,
      }
    }
  }
}

const chartProps = {
  chartName: 'Total validators 👷',
  additionalValues: [
    {value: null, text: 'validators'},
    {value: null, text: 'new validators in the last epoch', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    Above all, validators are pieces of hardware that run mina software. The combination of all the validators and SNARK workers form the foundation of mina network.
  </p>
  <p>
    Validators are maintained primarily by mina community and volunteers, who typically dedicate a computer to the process.
  </p>
  <p>
    Similar to stakers (or miners) in other protocols, validators can be selected to produce a block and earn block rewards.
  </p>
  <p>
    The data shows number of active validators, i.e. validators that produced at least 1 block during the last 1000 blocks.
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
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <BarChart :chartData="data" :width="150" :height="120" :options="options" />
  </StatsCard>
</template>

<style scoped>

</style>
