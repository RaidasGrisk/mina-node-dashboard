<script setup>
import { ref, onMounted } from 'vue'
import { useThemeVars } from 'naive-ui'

const data = ref([])
const loading = ref(false)
const showModal = ref(false)
const themeVars = useThemeVars()

const getLatestMinaReleaseData = async () => {

  loading.value = true

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))
  await sleep(1000)

  const url = 'https://api.github.com/repos/MinaProtocol/mina/releases'
  let response = await fetch(url, {  method: 'GET' })
  response = await response.json()

  // filter out only mainnet releases (drop testnets)
  response = response.filter(item => item.name.toLowerCase().includes('mainnet'))

  data.value = response
  loading.value = false
}

const copyToClipboard = () => {
  navigator.clipboard.writeText('ioWxss6#6308')
}

onMounted( async () => {
  getLatestMinaReleaseData()
})


</script>

<template>

  <n-modal v-model:show="showModal">
    <n-card style="width: 400px" :bordered="false" size="huge">
      <n-text depth="3">
        <n-space>
          <span>
            <b>Discord:</b> ioWxss6#6308
            <n-tooltip placement="right" trigger="click" :show-arrow="false">
              <template #trigger>
                <n-button tertiary type="info" size="small" @click="copyToClipboard()">
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path opacity=".3" d="M8 7h11v14H8z" fill="currentColor"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"></path></svg>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              <span> Copied! </span>
            </n-tooltip>
          </span>
          <span>
            <b>Github: </b>
            <n-button text type="info" tag="a" href="https://github.com/RaidasGrisk" target="_blank">github.com/RaidasGrisk</n-button>
          </span>
      </n-space>
    </n-text>
    </n-card>
  </n-modal>

  <div class="centered-text" style="padding: 5em 5em 5em 5em">
    <n-space :size="30" justify="center" vertical>

      <n-button @click="showModal = true" size="medium" strong secondary round type="info">
        Contacts
      </n-button>

      <n-tag round :bordered="true" :size="'large'" style="padding: 20px; min-height: 130px;">
        <n-space justify="center" vertical>
          <n-text depth="3">Dashboard source code</n-text><br>
          <n-space justify="center">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button tertiary circle type="warning" tag="a" href="https://github.com/RaidasGrisk/mina-node-dashboard" target="_blank">
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 496 512">
                          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9c1.6 2.3 4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2z" fill="currentColor">
                        </path>
                      </svg>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              Frontend
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button tertiary circle type="warning" tag="a" href="https://github.com/RaidasGrisk/mina-node-dashboard-backend" target="_blank">
                  <template #icon>
                    <n-icon>
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 496 512">
                          <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6c-3.3.3-5.6-1.3-5.6-3.6c0-2 2.3-3.6 5.2-3.6c3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9c2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9c.3 2 2.9 3.3 5.9 2.6c2.9-.7 4.9-2.6 4.6-4.6c-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2c12.8 2.3 17.3-5.6 17.3-12.1c0-6.2-.3-40.4-.3-61.4c0 0-70 15-84.7-29.8c0 0-11.4-29.1-27.8-36.6c0 0-22.9-15.7 1.6-15.4c0 0 24.9 2 38.6 25.8c21.9 38.6 58.6 27.5 72.9 20.9c2.3-16 8.8-27.1 16-33.7c-55.9-6.2-112.3-14.3-112.3-110.5c0-27.5 7.6-41.3 23.6-58.9c-2.6-6.5-11.1-33.3 2.6-67.9c20.9-6.5 69 27 69 27c20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27c13.7 34.7 5.2 61.4 2.6 67.9c16 17.7 25.8 31.5 25.8 58.9c0 96.5-58.9 104.2-114.8 110.5c9.2 7.9 17 22.9 17 46.4c0 33.7-.3 75.4-.3 83.6c0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252C496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2c1.6 1.6 3.9 2.3 5.2 1c1.3-1 1-3.3-.7-5.2c-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9c1.6 1 3.6.7 4.3-.7c.7-1.3-.3-2.9-2.3-3.9c-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2c2.3 2.3 5.2 2.6 6.5 1c1.3-1.3.7-4.3-1.3-6.2c-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9c1.6 2.3 4.3 3.3 5.6 2.3c1.6-1.3 1.6-3.9 0-6.2c-1.4-2.3-4-3.3-5.6-2z" fill="currentColor">
                        </path>
                      </svg>
                    </n-icon>
                  </template>
                </n-button>
              </template>
              Backend to run BigQuery queries
            </n-tooltip>
          </n-space>
        </n-space>
      </n-tag>

      <n-text depth="3">
        <n-space v-if="loading" vertical justify="center">
          <n-skeleton :sharp="false" size="small" :width="164" :height="20" class="centered-text"></n-skeleton>
          <n-skeleton :sharp="false" size="small" :width="64" :height="20" class="centered-text"></n-skeleton>
        </n-space>
        <div v-else>
          <div v-if="data.length>0">
            <n-space justify="center" vertical :size="3">
              <span>
                Latest <b>Mina</b> stable release:
                <n-button text type="info" tag="a" :href="data[0].html_url" target="_blank">{{ data[0].tag_name }}</n-button>
              </span>
              <span>
                Released:
                <n-time :time="new Date(data[0].published_at)" format="yyyy-MM-dd" />
              </span>
            </n-space>
          </div>
        </div>
        <n-button size="small" type="text" circle ghost :loading="loading" @click="getLatestMinaReleaseData()">
          <template #icon>
            <n-icon>
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve"><path d="M433,288.8c-7.7,0-14.3,5.9-14.9,13.6c-6.9,83.1-76.8,147.9-161.8,147.9c-89.5,0-162.4-72.4-162.4-161.4
                c0-87.6,70.6-159.2,158.2-161.4c2.3-0.1,4.1,1.7,4.1,4v50.3c0,12.6,13.9,20.2,24.6,13.5L377,128c10-6.3,10-20.8,0-27.1l-96.1-66.4
                c-10.7-6.7-24.6,0.9-24.6,13.5v45.7c0,2.2-1.7,4-3.9,4C148,99.8,64,184.6,64,288.9C64,394.5,150.1,480,256.3,480
                c100.8,0,183.4-76.7,191.6-175.1C448.7,296.2,441.7,288.8,433,288.8L433,288.8z"></path></svg>
            </n-icon>
          </template>
        </n-button>
      </n-text>

      <n-space vertical>
        <n-text depth="3">Data sources:</n-text>
        <n-space size="small" justify="center">
          <n-tag round :bordered="false" v-for="item in [
            { name: 'GraphQL', url: 'https://graphql.minaexplorer.com/' },
            { name: 'BigQuery', url: 'https://docs.minaexplorer.com/minaexplorer/bigquery-public-dataset' },
            { name: 'REST API', url: 'https://docs.minaexplorer.com/rest-api/' },
          ]">
            <n-button text type="info" tag="a" :href="item.url" target="_blank">{{ item.name }}</n-button>
          </n-tag>
        </n-space>
      </n-space>

    </n-space>
  </div>
</template>

<style scoped>
  .centered-text {
    display: block;
    margin-left: auto;
    margin-right: auto;
    text-align: center;
  }
</style>
