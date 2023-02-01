<script setup>
import { ref, onMounted } from 'vue'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { options } from './defaultChartOptions'

Chart.register(...registerables);

const themeVars = useThemeVars()
const data = ref({})

// deep copy or else it will leak to other chart components
const options_ = JSON.parse(JSON.stringify(options))
options_.scales.x.title.text = 'block'

const chartProps = {
  chartName: 'Active snark workers ‍🛠️',
  additionalValues: [
    {value: null, text: 'workers'},
    {value: null, text: 'new workers over the last 100 blocks', precision: 0}
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
    A SNARK worker is considered active if it produced at least one SNARK over the period of last 5000 blocks (around one and a half week).
  </p>
  `,
}

const loading = ref(false)

const loadData = async () => {

  loading.value = true

  // config
  const url = 'https://node-dashboard-bigquery-backend-2qz4wkdima-uc.a.run.app/active_snark_workers'

  // API request
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  let response_ = await response.json()

  response_ = response_.slice(-1000)

  // set data element values
  data.value = {
    labels: response_.map(i => i.blockheight),
    datasets: [
      {
        data: response_.map(i => i.snark_workers),
        backgroundColor: [themeVars.value.infoColor],
      },
    ],
  }

  // set other values
  chartProps.additionalValues[0].value = response_.slice(-1)[0].snark_workers
  chartProps.additionalValues[1].value = response_.slice(-1)[0].snark_workers - response_.slice(-100)[0].snark_workers

  loading.value = false
}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <LineChart :chartData="data" :width="150" :height="120" :options="options_" />
  </StatsCard>
</template>

<style scoped>

</style>
