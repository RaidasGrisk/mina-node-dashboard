<script setup>
import { ref, onMounted } from 'vue'
import StatsCard from '../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const themeVars = useThemeVars()

const loading = ref(true)
const data = ref({})
const options = {
  plugins: {
    legend: {display: false}
  },
  scales: {
    x: {
      display: false,
      border: {
        display: false
      },
      grid: {
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
  chartName: 'Block time',
  additionalValues: [
    {value: null, text: 'minutes'},
    {value: null, text: 'avg. over the last 20 blocks', precision: 2}
  ],
  mainValue: 0,
  changeValue: null,
}

onMounted( async () => {

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
        blocks(limit: 100) {
          dateTime
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

  const subtractDates = (prev, curr) => {
    const prev_ = new Date(prev)
    const curr_ = new Date(curr)
    var diff = (curr_.getTime() - prev_.getTime()) / 1000 / 60
    return Math.abs(diff)
  }

  // filter out duplicates
  response_ = response_.data.blocks.filter(filterUnique)

  // subtract dates to get the difference
  for (let i = 1; i < response_.length; i++) {
    response_[i].minutesBetweenBlocks = subtractDates(
      response_[i].dateTime, response_[i-1].dateTime
    )
  }

  // set data element values
  data.value = {
    labels: response_.map(i => i.blockHeight),
    datasets: [
      {
        data: response_.map(i => i.minutesBetweenBlocks),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = response_.slice(-1)[0].minutesBetweenBlocks
  chartProps.additionalValues[1].value = response_.slice(-20).reduce(
    (total, next) => total + next.minutesBetweenBlocks, 0
  ) / 20

})

</script>

<template>
  <StatsCard :data="chartProps">
    <BarChart :chartData="data" :width="150" :height="100" :options="options" />
  </StatsCard>
</template>

<style scoped>

</style>
