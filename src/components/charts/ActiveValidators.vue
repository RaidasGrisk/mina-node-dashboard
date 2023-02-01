<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'
import { storeReady } from '../../utils'

import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
import { options } from './defaultChartOptions'

Chart.register(...registerables);

const themeVars = useThemeVars()
const store = useStore()
const data = ref({})

// deep copy or else it will leak to other chart components
const options_ = JSON.parse(JSON.stringify(options))
options_.scales.x.title.text = 'block'

const chartProps = {
  chartName: 'Active validators 🦸',
  additionalValues: [
    {value: null, text: 'validators'},
    {value: null, text: 'new validators over the last 100 blocks', precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    Not all validators are active. Many epochs have passed since the start of the network, so some of the validators have been turned off / abandoned / put under a different address and so on.
  </p>
  <p>
    Active validators are validators that are currently running and are producing new blocks. Active validators are participating in mina network right this moment.
  </p>
  <p>
    A validator is considered active if it produced at least one block over the period of last 5000 blocks (around one and a half week).
  </p>
  `
}

const loading = ref(false)

const loadData = async () => {

  loading.value = true

  // config
  const url = 'https://graphql.minaexplorer.com/'

  // lets dispatch X requests instead of one big request
  const totalBlocks = 5000
  const blockChunks = 1000
  const chainData = store.getters['chainData/getData']
  const lastBlock = chainData.blockchainLength
  const steps = Math.ceil(totalBlocks / blockChunks)

  const params = [...Array(steps).keys()].map(
    (step, i) => { return {
      startBlock: lastBlock - (step + 1) * blockChunks,
      endBlock: lastBlock - step * blockChunks,
      limit: blockChunks // needed because default limit is 100
      }
    }
  )

  // make an array of queries with selected creators
  let queries = params.map(param => JSON.stringify({
    query: `
    query MyQuery {
      blocks(
        sortBy: BLOCKHEIGHT_DESC,
        query: {canonical: true, blockHeight_gte: ${param.startBlock}, blockHeight_lt: ${param.endBlock}},
        limit: ${param.limit}
      ) {
        creator
        blockHeight
      }
    }
  `
  }))

  // make an array of fetch requests (but dont dispatch yet_)
  let requests = queries.map(query => fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: query,
  }))

  // dispatch all the requests at once
  let responses = await Promise.all(requests)
  let responses_ = await Promise.all(responses.map(res => res.json()))
  let response_ = responses_.map(response => response.data.blocks)
  response_ = response_.flat(1).reverse()

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

  // before triggering the loadData, we've to wait for the store
  // to finish fetching the data, as we rely on it.
  loading.value = true // set this, or else, there's a weird render
  await storeReady()
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
