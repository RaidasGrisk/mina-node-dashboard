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
  description: 'The difference in minutes between two subsequent blocks.'
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
        blocks(sortBy: DATETIME_DESC, limit: 100, query: {canonical: true}) {
          dateTime
          blockHeight
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // helper functions
  // const filterUnique = (value, index, self) => {
  //   return self.findIndex(v => v.blockHeight === value.blockHeight) === index
  // }

  const subtractDates = (prev, curr) => {
    const prev_ = new Date(prev)
    const curr_ = new Date(curr)
    var diff = (curr_.getTime() - prev_.getTime()) / 1000 / 60
    return Math.abs(diff)
  }

  // reverse
  response_ = response_.data.blocks.reverse()

  // filter out duplicates
  // response_ = response_.filter(filterUnique)

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

  loading.value = false
}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <BarChart :chartData="data" :width="150" :height="100" :options="options" />
  </StatsCard>
</template>

<style scoped>

</style>
