<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

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
  chartName: 'Top validators by stake 🪧',
  additionalValues: [
    {value: null, text: '% of stake held by top 5 validators', precision: 1},
    {value: null, text: 'Gini coefficient', precision: 2}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    These are the addresses of active validators sorted by their stake in MINA.
  </p>
  <p>
    This signifies how distributed or concentrated the validator power is.
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
        stakes(limit: 50, sortBy: BALANCE_DESC, query: {epoch: ${store.getters['chainData/getData'].epoch}}) {
          balance
          public_key
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // reverse
  response_ = response_.data.stakes

  // set data element values
  data.value = {
    labels: response_.map(i => i.public_key.slice(0, 5) + ' ... ' + i.public_key.slice(-5)),
    datasets: [
      {
        data: response_.map(i => i.balance),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // helpers
  const sumArray = (x) => {
    return x.reduce((a, b) => {return a + b})
  }


  const gini = (array) => {
    // https://github.com/oliviaguest/gini
    array = array.sort()
    let index = Array.from(Array(array.length).keys())
    let n = array.length

    var top = 0
    for(var i=0; i< array.length; i++) {
        top += array[i] * (index[i] * 2 - n - 1)
    }

    var botom = n * sumArray(array)

    return top / botom
  }


  const balances = response_.map(i => i.balance)

  // set other values
  chartProps.additionalValues[0].value = (sumArray(balances.slice(0, 5)) / 809110096) * 100
  chartProps.additionalValues[1].value = gini(balances) * 100

  loading.value = false
}

// doing wathc inste4ad of onMounted, because we are relying on
// another api call in the store that returns epoch number
// check if epoch has changed, if so, load the data again
watch(() => store.getters['chainData/getData'], (prev, curr) => {
  prev.epoch == curr.epoch ? false : loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <BarChart :chartData="data" :width="150" :height="100" :options="options" />
  </StatsCard>
</template>

<style scoped>

</style>
