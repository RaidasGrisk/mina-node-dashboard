<script setup>
import { ref, onMounted, computed } from 'vue'
import StatsCard from '../../components/StatsCard.vue'
import AddressList from './utils/AddressList.vue'
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()

const data = ref({})

const chartProps = {
  chartName: 'Latest block creators‍ 📦',
  additionalValues: [
    {value: null, text: null},
    {value: null, text: null, precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: `
  <p>
    Public keys of the latest block creators. In other words, this is a list of addresses of validators that created the most recent blocks.
  </p>
  <p>
    The number on the right side shows how many blocks have this validator created in total. So if the number is small, this is a new validator.
    Big number indicate that the validator has been actively producing blocks for a long time.
  </p>
  <p>
    By clicking on validator address, you can visit MINA's block explorer and explore the validator account further.
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
        blocks(limit: 30, sortBy: BLOCKHEIGHT_DESC, query: {canonical: true}) {
          creator
          blockHeight
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // trim
  response_ = response_.data.blocks.slice(0, 7)

  // run the other query to get the number of blocks produced by each address
  // make an array of queries with selected creators
  let bodies = response_.map(i => JSON.stringify({
    query: `
    query MyQuery {
      blocks(query: {creator_in: "${i.creator}", canonical: true}, limit: 100) {
        blockHeight
        creator
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
      address: item.creator,
      stat: requests_data.filter(
        item_ => item_.data.blocks[0].creator == item.creator
      )[0].data.blocks.length
    }
  })

  // convert the number of blocks created NUMBER to STRING
  result = result.map(item => {
    return {
      address: item.address,
      stat: item.stat >= 100 ? '+100' : item.stat.toString(),
      tooltip: 'Total blocks created'
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
  <StatsCard :data="chartProps" :loading="loading" :showChartOnOpenModal="true" @reload="loadData">
    <AddressList :data="data"/>
  </StatsCard>
</template>

<style scoped>

</style>
