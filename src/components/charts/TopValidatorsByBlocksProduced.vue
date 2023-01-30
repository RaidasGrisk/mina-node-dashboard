<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'
import { storeReady } from '../../utils'

import { BarChart } from 'vue-chart-3';
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const themeVars = useThemeVars()
const store = useStore()

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
        text: 'validator address',
      },
      display: true,
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
  chartName: 'Top validators over the last 6 hours 🪧',
  additionalValues: [
    {value: null, text: '% of blocks produced by top validator', precision: 1},
    {value: null, text: '', precision: 2}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    The addresses of validators sorted by the number of blocks they produced over the last 24 hours.
  </p>
  <p>
    This signifies how distributed or concentrated the block production is.
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

  // set data element values
  data.value = {
    labels: validators.map(i => i.validator.slice(0, 5) + ' ... ' + i.validator.slice(-5)),
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
  await storeReady()
  loadData()

})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <BarChart :chartData="data" :width="150" :height="128" :options="options" />
  </StatsCard>
</template>

<style scoped>

</style>
