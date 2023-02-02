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
  chartName: 'Block time ⌛',
  additionalValues: [
    {value: null, text: 'minutes'},
    {value: null, text: 'avg. over the last 100 blocks', precision: 2}
  ],
  mainValue: 0,
  changeValue: null,
  description: `
  <p>
    The difference in minutes between two subsequent blocks.
  </p>
  <p>
    Note that the smallest block time possible is 3 minutes.
    That is because time on Mina is measured in slots. A slot is 3 minutes long.
  </p>
  <p>
    Block producers can win the chance to produce a block during a slot.
    If the selected block producer does not produce a block in a given slot,
    then the next possibility to build a block is during the next slot.
    That is why blocks are built in between the time intervals of 3, 6, 9, and 12 or more minutes.
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
        blocks(sortBy: DATETIME_DESC, limit: ${limit+1}, query: {canonical: true}) {
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

  jsonData.value = response_

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
  chartProps.additionalValues[1].value = response_.slice(-100).reduce(
    (total, next) => total + next.minutesBetweenBlocks, 0
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
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData" :jsonData="jsonData">
    <BarChart :chartData="data" :width="150" :height="120" :options="options_" />
  </StatsCard>
</template>

<style scoped>

</style>
