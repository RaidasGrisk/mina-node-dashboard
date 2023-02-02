<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'
import { storeReady } from '../../utils'

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
options_.scales.x.title.text = 'validator address'

// on click open new window to address on explorer
options_.onClick = (chart_, clickIndex, _) => {
  if (clickIndex.length > 0) {
    const address = data.value.labels[clickIndex[0].index]
    window.open('https://minaexplorer.com/wallet/' + address, '_blank')
  }
}

// proper way to trim tooltip labels on hover
// https://www.chartjs.org/docs/latest/configuration/tooltip.html
options_.plugins.tooltip = {
  callbacks: {
    title: (context) => {
      return context[0].label.slice(0, 5) + ' ... ' + context[0].label.slice(-5)
    }
  }
}

const chartProps = {
  chartName: 'Top validators over the last 6 hours 🏆',
  additionalValues: [
    {value: null, text: '% of blocks produced by the top validator', precision: 1},
    // {value: null, text: 'out of 120 blocks have been created by the top validator', precision: 0},
    {value: null, text: '', precision: 2}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    Some validators are producing more blocks than others.
    Validators are selected to create new blocks based on the amount of stake they hold in the network,
    with a higher amount of stake resulting in a higher likelihood of being selected as a validator.
  </p>
  <p>
    The chart shows the top validators and the number of blocks that have been produced by each.
    The data covers a window of the last 120 blocks (i.e the last 6 hours).
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
        blocks(limit: 120, query: {canonical: true}, sortBy: BLOCKHEIGHT_DESC) {
          creator
          blockHeight
        }
      }
        `
    }),
  })

  let response_ = await response.json()
  response_ = response_.data.blocks

  // get a set of validators and count the
  //  number of blocks produced by each validator
  let validators = new Set(response_.map(block => block.creator))
  validators = Array.from(validators)

  validators = validators.map(validator => {
    return {
      validator: validator,
      blocksProduced: response_.filter(block => block.creator == validator).length
    }
  })

  validators = validators.sort((a, b) => b.blocksProduced - a.blocksProduced)

  jsonData.value = response_

  // set data element values
  data.value = {
    labels: validators.map(i => i.validator),
    datasets: [
      {
        data: validators.map(i => i.blocksProduced),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = (
    validators[0].blocksProduced /
    validators.reduce((accum, validator) => accum + validator.blocksProduced, 0)
  ) * 100

  loading.value = false
}

// doing wathc inste4ad of onMounted, because we are relying on
// another api call in the store that returns epoch number
// check if epoch has changed, if so, load the data again

onMounted( async () => {

  // before triggering the loadData, we've to wait for the store
  // to finish fetching the data, as we rely on it.
  loading.value = true // set this, or else, there's a weird render
  await storeReady()
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
