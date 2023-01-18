<script setup>

import { ref, onMounted } from 'vue'

const data = ref([])

onMounted( async () => {
  const url = 'https://api.github.com/repos/MinaProtocol/mina/releases'
  let response = await fetch(url, {  method: 'GET' })
  response = await response.json()
  data.value = response
})


</script>

<template>
  <div class="centered-text" style="padding: 5em 5em 5em 5em">
    <n-space justify="center">
      <n-tag round :bordered="true" :size="'large'" style="padding: 20px; min-height: 130px;">
        <n-space justify="center" vertical>
          <n-h5 style="font-size: 90%">Source code</n-h5>
          <n-space justify="center">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-button tertiary circle type="info" tag="a" href="https://github.com/RaidasGrisk/mina-node-dashboard" target="_blank">
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
              UI
            </n-tooltip>
        </n-space>
        </n-space>
      </n-tag>
    </n-space>
    <br><br>
    <n-text depth="3" v-if="data.length > 0">
      <n-space justify="center">
        <n-space vertical>
          <span>
            Latest <b>Mina</b> stable release:
            <a :href="data[0].html_url" target="_blank">
              {{ data[0].tag_name }}
            </a>
          </span>
          <span>
            Released at:
            <n-time :time="new Date(data[0].published_at)" format="yyyy-MM-dd" />
          </span>
          <span>
          </span>
        </n-space>
      </n-space>
    </n-text>
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
