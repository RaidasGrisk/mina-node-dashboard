<script setup>
import { ref, onMounted } from 'vue'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

import { LineChart } from 'vue-chart-3';
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
        text: 'block',
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
  chartName: 'Active validators 🦸',
  additionalValues: [
    {value: null, text: 'validators'},
    {value: null, text: 'new validators in the last 100 blocks', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    Above all, validators are pieces of hardware that run MINA software. The combination of all the validators and SNARK workers form the foundation of mina network.
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
  const url = 'https://graphql.minaexplorer.com/'

  // API request
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
      query MyQuery {
        blocks(sortBy: DATETIME_DESC, limit: 5000, query: {canonical: true}) {
          creator
          blockHeight
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // helper functions
  const filterUnique = (value, index, self) => {
    return self.findIndex(v => v.blockHeight === value.blockHeight) === index
  }

  // reverse
  response_ = response_.data.blocks.reverse()

  // filter out duplicates
  response_ = response_.filter(filterUnique)

  // subtract dates to get the difference
  const uniqueAddresses = new Set()
  for (let i = 1; i < response_.length; i++) {

    if (uniqueAddresses.has(response_[i].creator)) {
      response_[i].uniqueAddresses = response_[i-1].uniqueAddresses | 0
    } else {
      uniqueAddresses.add(response_[i].creator)
      response_[i].uniqueAddresses = response_[i-1].uniqueAddresses + 1
    }
  }

  response_ = response_.slice(-1000)

  // set data element values
  data.value = {
    labels: response_.map(i => i.blockHeight),
    datasets: [
      {
        data: response_.map(i => i.uniqueAddresses),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = response_.slice(-1)[0].uniqueAddresses
  chartProps.additionalValues[1].value = response_.slice(-1)[0].uniqueAddresses - response_.slice(-100)[0].uniqueAddresses

  loading.value = false
}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <LineChart :chartData="data" :width="150" :height="120" :options="options" />
  </StatsCard>
</template>

<style scoped>

</style>
