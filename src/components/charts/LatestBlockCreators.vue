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
  chartName: 'Latest block creators‍',
  additionalValues: [
    {value: null, text: null},
    {value: null, text: null, precision: 0}
  ],
  mainValue: null,
  changeValue: null,
  description: 'Public keys of the latest block creators.'
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
          stateHash
        }
      }
        `
    }),
  })

  let response_ = await response.json()

  // helper functions
  const filterUnique = (value, index, self) => {
    return self.findIndex(v => v.blockHeight === value.blockHeight) === index
  }

  // reverse
  response_ = response_.data.blocks

  // filter out duplicates
  response_ = response_.filter(filterUnique)

  // trim
  response_ = response_.slice(0, 6)

  // set data element values
  data.value = response_.map(i => i.creator)

  // run the other query to get the number of blocks produced by each address
  // start of by mapping address to number of blocks produced
  const address_mapping = {}

  // https://dev.to/viricruz/fetch-with-promise-all-and-async-await-4ioe
  // modify to count the blocks made this epoch only..?
  // filter out unique blockheight
  for (const index in response_) {
    let response_addr = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
        query MyQuery {
          blocks(query: {creator_in: "${response_[index].creator}", canonical: true}, limit: 100) {
            blockHeight
          }
        }
          `
      }),
    })

    // add the result to mapping
    let response_addr_ = await response_addr.json()
    address_mapping[response_[index].creator] = response_addr_.data.blocks.length

  }

  addressMapping.value = address_mapping

  loading.value = false
}

onMounted( async () => {
  loadData()
})

</script>

<template>
  <StatsCard :data="chartProps" :loading="loading" @reload="loadData">
    <n-collapse-transition :appear="true">
      <div ref="statscard_width_ref" style="width: 100%;" />
      <n-space v-for="address in data" justify="space-between">
        <n-space :size="20">
          <n-text code class="codeStyles">
            <n-text depth="2" type="success">
              <a :href="'https://minaexplorer.com/wallet/' + address" target="_blank">
                {{ address.slice(0, Math.round(width / 20)) + '...' + address.slice(-Math.round(width / 20)) }}
              </a>
            </n-text>
          </n-text>
          <n-divider vertical style="height: 12px;"/>
        </n-space>
        <n-tooltip trigger="hover" placement="right" style="font-size: 70%;">
          <template #trigger>
            <n-text depth="3" style="margin-top: 30px; font-size: 0.90em">
              {{ addressMapping[address] == 100 ? addressMapping[address].toString() + '+' : addressMapping[address] }}
            </n-text>
          </template>
          Total blocks created
        </n-tooltip>
      </n-space>
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
