<script setup>
import { ref, onMounted, computed } from 'vue'
import { useElementSize } from '@vueuse/core'
import StatsCard from '../../components/StatsCard.vue'
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()

const data = ref({})
const addressMapping = ref({})

// make responsive width
const statscard_width_ref = ref(null)
const { width, height } = useElementSize(statscard_width_ref)

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
    So if the number is small, this is a new worker. Big number indicate that the worker has been actively producing snarks for a long time.
  </p>
  <p>
    By clicking on worker address, you can visit MINA's block explorer and explore the worker account further.
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

  // helper functions
  const filterUnique = (value, index, self) => {
    return self.findIndex(v => v.prover === value.prover) === index
  }

  // reverse
  response_ = response_.data.snarks

  // filter out duplicates
  response_ = response_.filter(filterUnique)

  // trim
  response_ = response_.slice(0, 7)

  // set data element values
  data.value = response_.map(i => i.prover)

  // run the other query to get the number of snarks produced by each address
  // start of by mapping address to number of snarks produced
  const address_mapping = {}

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

  // add the result to mapping
  for (const index in requests_data) {
    let prover = requests_data[index].data.snarks[0].prover
    address_mapping[prover] = requests_data[index].data.snarks.length
  }
  addressMapping.value = address_mapping

  loading.value = false
}

const addressCharCrop = () => {

  // if modal is brought up, this width becomes 0,
  // this messes up the rendering, hence this exception
  if (width.value == 0) {
    return 20
  }
  return Math.round(width.value / 19)

}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <div style="height: 12px;"/>
    <n-collapse-transition :appear="true">
      <div ref="statscard_width_ref" style="width: 100%;" />
      <n-row>
        <n-space v-for="address in data" justify="space-between" style="white-space: nowrap;">
          <n-text code class="codeStyles">
            <n-text depth="2" type="success">
              <a :href="'https://minaexplorer.com/wallet/' + address" target="_blank">
                {{ address.slice(0, addressCharCrop()) + '...' + address.slice(-addressCharCrop()) }}
              </a>
            </n-text>
          </n-text>
          <n-divider vertical style="height: 12px;"/>
          <n-tooltip trigger="hover" placement="right" style="font-size: 70%;">
            <template #trigger>
              <n-text depth="3" style="font-size: 0.90em">
                {{ addressMapping[address] == 100 ? addressMapping[address].toString() + '+' : addressMapping[address] }}
              </n-text>
            </template>
            Total snarks created
          </n-tooltip>
        </n-space>
      </n-row>
    </n-collapse-transition>
  </StatsCard>
</template>

<style scoped>

.codeStyles {
  font-size: 0.8em
}

a {
  color: v-bind(themeVars.infoColor);
  text-decoration: inherit;
}

a:hover {
  color: v-bind(themeVars.infoColorHover);
}

a:link:active, a:visited {
  color: v-bind(themeVars.successColor);;
}

</style>
