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
  chartName: 'Active snark workers ‍🛠️',
  additionalValues: [
    {value: null, text: 'workers'},
    {value: null, text: 'new workers in the last 50 blocks', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    SNARKs (Succinct Non-Interactive Argument of Knowledge) are what allows mina blockchain size to remain fixed size and small (about 22kb).
  </p>
  <p>
    Mina blockchain functions with two main roles on the network:
    <p style="margin-left: 15px">
      1. Block producers are those who produce blocks in the network;
    </p>
    <p style="margin-left: 15px">
      2. SNARK workers create zk-SNARK proofs of transactions to compress the transactions so they can be folded into the tiny blockchain proof.
    </p>
  </p>
  <p>
    Before adding a new block, block producers must purchase a SNARK from SNARK workers that contains proofs of new transactions. Only after doing that
    can a block producer produce a new block.
  </p>
  <p>
    SNARK workers are incentivized through a reward mechanism in MINA. They are rewarded with MINA tokens for the computation they perform, and this incentivizes more nodes to join the network and act as SNARK workers.
  </p>
  <p>
    The data shows number of active SNARK workers, i.e. workers that produced at least 1 SNARK during the last 1000 blocks.
  </p>
  `,
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
        snarks(sortBy: DATETIME_DESC, limit: 1000, query: {canonical: true}) {
          prover
          blockHeight
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // reverse
  response_ = response_.data.snarks.reverse()

  // subtract dates to get the difference
  const uniqueAddresses = new Set()
  for (let i = 1; i < response_.length; i++) {

    if (uniqueAddresses.has(response_[i].prover)) {
      response_[i].uniqueAddresses = response_[i-1].uniqueAddresses | 0
    } else {
      uniqueAddresses.add(response_[i].prover)
      response_[i].uniqueAddresses = response_[i-1].uniqueAddresses + 1
    }
  }

  // helper functions
  // const filterUnique = (value, index, self) => {
  //   return self.findIndex(v => v.blockHeight === value.blockHeight) === index
  // }

  // response_ = response_.filter(filterUnique)

  response_ = response_.slice(-100)

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
  chartProps.additionalValues[1].value = response_.slice(-1)[0].uniqueAddresses - response_.slice(-50)[0].uniqueAddresses

  loading.value = false
}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <LineChart :chartData="data" :width="150" :height="100" :options="options" />
  </StatsCard>
</template>

<style scoped>

</style>
