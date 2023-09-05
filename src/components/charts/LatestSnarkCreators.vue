<script setup>
import { ref, onMounted, computed } from 'vue'
import StatsCard from '../../components/StatsCard.vue'
import AddressList from './utils/AddressList.vue'
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()

const data = ref({})
const jsonData = ref({})

const chartProps = {
  chartName: 'Latest snark creators‍ 🧑‍🏭',
  additionalValues: [
    {value: null, text: null},
    {value: null, text: null, precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    Public keys of the latest snark creators. In other words, this is a list of addresses of snark workers that created the most recent snarks.
  </p>
  <p>
    The number on the right side shows how many snarks have this worker created in total.
    If the number is small, this is a new worker. A big number indicates that the worker has been actively producing snarks for a long time.
  </p>
  <p>
    By clicking on the worker address, you can visit MINA's block explorer and explore the worker account further.
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
        snarks(limit: 30, sortBy: BLOCKHEIGHT_DESC, query: {canonical: true}) {
          prover
          blockHeight
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // filter out duplicates
  const filterUnique = (value, index, self) => {
    return self.findIndex(v => v.prover === value.prover) === index
  }
  response_ = response_.data.snarks.filter(filterUnique)

  // trim
  response_ = response_.slice(0, 7)

  // run the other query to get the number of blocks produced by each address
  // make an array of queries with selected creators
  let bodies = response_.map(i => JSON.stringify({
    query: `
    query MyQuery {
      snarks(query: {prover_in: "${i.prover}", canonical: true}, limit: 100) {
        blockHeight
        prover
      }
    }
  `
  }))

  // make an array of fetch requests (but dont dispatch yet_)
  let requests = bodies.map(body_ => fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body_,
  }))

  // dispatch all the requests at once
  let requests_ = await Promise.all(requests)
  let requests_data = await Promise.all(requests_.map(res => res.json()))

  // map each address to the number of blocks created
  let result = response_.map(item => {
    return {
      address: item.prover,
      stat: requests_data.filter(
        item_ => item_.data.snarks[0].prover == item.prover
      )[0].data.snarks.length
    }
  })

  jsonData.value = result

  // convert the number of blocks created NUMBER to STRING
  result = result.map(item => {
    return {
      address: item.address,
      stat: item.stat >= 100 ? '100+' : item.stat.toString(),
      tooltip: 'Total snarks created'
    }
  })

  data.value = result
  loading.value = false
}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData" :jsonData="jsonData">
    <AddressList :data="data"/>
  </StatsCard>
</template>

<style scoped>

</style>
