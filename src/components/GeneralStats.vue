<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useThemeVars, useLoadingBar } from 'naive-ui'

// hljs stuff
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
hljs.registerLanguage('json', json)

const data = ref(null)
const themeVars = useThemeVars()

const loadingBar = useLoadingBar()
const store = useStore()
const showJsonModal = ref(false)

const getData = async () => {
  data.value = null // to trigger animation
  loadingBar.start()
  const chainData = await store.dispatch('chainData/getData')
  data.value = chainData
  loadingBar.finish()
}

onMounted(() => {
  getData()
})

defineExpose({
  getData,
});

</script>

<template>
  <n-collapse-transition :appear="true">
    <div style="text-align: center; padding: 1em 0em 1em 0em;">
      <n-space justify="center" :size="[150, 50]">

        <n-statistic style="min-width: 10em;">
          <template #label>
            <n-badge :color="themeVars.tagColor" :offset="[8, 0]">
              <n-text depth="3">
                Epoch
              </n-text>
              <template #value>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-icon :depth="2" :color="themeVars.infoColor">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"></path></svg>
                    </n-icon>
                  </template>
                  <div class="tooltip">
                    <p>
                      An epoch is a unit of time equal to 7140 slots. An epoch is divided into slots of 3 minutes each.
                      Epoch duration is 14 days and 21 hours.
                    </p>
                    <p>
                      An epoch is used to mark changes in the set of validators to quantify important events in the network.
                    </p>
                  </div>
                </n-tooltip>
              </template>
            </n-badge>
          </template>
          <template #prefix>
            <n-icon :color="themeVars.infoColor">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 32 32"><path d="M6 24H4V8h2zM28 8h-2v16h2zm-4-2V4H8v2zm0 22v-2H8v2z" fill="currentColor"></path></svg>
            </n-icon>
          </template>
          <template #suffix>
            <n-spin v-if="!data" :size="20" :stroke="themeVars.infoColor"/>
            <n-number-animation
              v-else
              :from="0"
              :to="data ? data.epoch : 0"
              show-separator
              :active="true"
              :precision="0"
            />
          </template>
        </n-statistic>

        <n-statistic style="min-width: 10em;">
          <template #label>
            <n-badge :color="themeVars.tagColor" :offset="[8, 0]">
              <n-text depth="3">
                Slot
              </n-text>
              <template #value>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-icon :depth="2" :color="themeVars.warningColor">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"></path></svg>
                    </n-icon>
                  </template>
                  <div class="tooltip">
                    <p>
                      Slot is a unit of time. A slot is 3 minutes long. An epoch is divided into 7140 slots.
                    </p>
                    <p>
                      Each slot is a time window, during which a block can be created and added to the blockchain.
                    </p>
                  </div>
                </n-tooltip>
              </template>
            </n-badge>
          </template>
          <template #prefix>
            <n-icon :color="themeVars.warningColor">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 28 28"><g fill="none"><path d="M3 9.5v11.75A3.75 3.75 0 0 0 6.75 25h14.5A3.75 3.75 0 0 0 25 21.25V6.75A3.75 3.75 0 0 0 21.25 3H9.5v6.5H3zm1.5 11.75V18.5h5v5H6.75a2.25 2.25 0 0 1-2.25-2.25zM9.5 11v6h-5v-6h5zM11 23.5v-5h6v5h-6zM17 11v6h-6v-6h6zm1.5 12.5v-5h5v2.75a2.25 2.25 0 0 1-2.25 2.25H18.5zm5-12.5v6h-5v-6h5zm-2.25-6.5a2.25 2.25 0 0 1 2.25 2.25V9.5h-5v-5h2.75zM11 4.5h6v5h-6v-5z" fill="currentColor"></path></g></svg>
            </n-icon>
          </template>
          <template #suffix>
            <n-spin v-if="!data" :size="20" :stroke="themeVars.warningColor"/>
            <n-number-animation
              v-else
              :from="0"
              :to="data ? data.slot : 0"
              show-separator
              :active="true"
              :precision="0"
            />
            / 7140
          </template>
        </n-statistic>

        <n-statistic style="min-width: 10em;">
          <template #label>
            <n-badge :color="themeVars.tagColor" :offset="[8, 0]">
              <n-text depth="3">
                Block
              </n-text>
              <template #value>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-icon :depth="2" :color="themeVars.successColor">
                      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor"></path></svg>
                    </n-icon>
                  </template>
                  <div class="tooltip">
                    <p>
                      Block is an abstraction that batches transactions and state changes together in a distributed ledger maintained by a network.
                      Block is a collection of transaction data that is added to the blockchain in a linear, chronological order.
                    </p>
                    <p>
                      Blocks contain a set of transactions and consensus information that extend the state of the network.
                      It also includes a proof that the current state of the network is fully valid.
                    </p>
                  </div>
                </n-tooltip>
              </template>
            </n-badge>
          </template>
          <template #prefix>
            <n-icon :color="themeVars.primaryColor">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><path d="M440.9 136.3a4 4 0 0 0 0-6.91L288.16 40.65a64.14 64.14 0 0 0-64.33 0L71.12 129.39a4 4 0 0 0 0 6.91L254 243.88a4 4 0 0 0 4.06 0z" fill="currentColor"></path><path d="M54 163.51a4 4 0 0 0-6 3.49v173.89a48 48 0 0 0 23.84 41.39L234 479.51a4 4 0 0 0 6-3.46V274.3a4 4 0 0 0-2-3.46z" fill="currentColor"></path><path d="M272 275v201a4 4 0 0 0 6 3.46l162.15-97.23A48 48 0 0 0 464 340.89V167a4 4 0 0 0-6-3.45l-184 108a4 4 0 0 0-2 3.45z" fill="currentColor"></path></svg>
            </n-icon>
          </template>
          <template #suffix>
            <n-spin v-if="!data" :size="20" :stroke="themeVars.primaryColor"/>
            <n-number-animation
              v-else
              :from="0"
              :to="data ? data.blockchainLength : 0"
              show-separator
              :active="true"
              :precision="0"
            />
          </template>
        </n-statistic>

      </n-space>
    </div>
  </n-collapse-transition>

  <!-- divider with button to show JSON data -->
  <div style="width: 70%; display: block; margin-left: auto; margin-right: auto;">
    <n-divider>
      <n-button quaternary type="info" @click="showJsonModal = true" size="small">
        <n-icon size="20" :depth="4">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M4 7v2c0 .55-.45 1-1 1s-1 .45-1 1v2c0 .55.45 1 1 1s1 .45 1 1v2c0 1.66 1.34 3 3 3h2c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1-.45-1-1v-2c0-1.3-.84-2.42-2-2.83v-.34C5.16 11.42 6 10.3 6 9V7c0-.55.45-1 1-1h2c.55 0 1-.45 1-1s-.45-1-1-1H7C5.34 4 4 5.34 4 7zm17 3c-.55 0-1-.45-1-1V7c0-1.66-1.34-3-3-3h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c.55 0 1 .45 1 1v2c0 1.3.84 2.42 2 2.83v.34c-1.16.41-2 1.52-2 2.83v2c0 .55-.45 1-1 1h-2c-.55 0-1 .45-1 1s.45 1 1 1h2c1.66 0 3-1.34 3-3v-2c0-.55.45-1 1-1s1-.45 1-1v-2c0-.55-.45-1-1-1z" fill="currentColor"></path></svg>
        </n-icon>
      </n-button>
    </n-divider>
  </div>
  <n-modal v-model:show="showJsonModal">
    <n-card style="max-width: 43em; padding: 1em 1em 1em 1em" :bordered="false" size="medium">
      <n-scrollbar style="max-height: 50em;">
        <n-text code style="min-width: 100%; padding: 1em;">
          <n-code :code="JSON.stringify(data, null, 2)" style="font-size: 10px;" :hljs="hljs" language="json"/>
        </n-text>
      </n-scrollbar>
    </n-card>
  </n-modal>

</template>

<style>
.tooltip {
  max-width: 30em;
  transform-origin: inherit;
  font-size: 70%;
  padding: 2em 2em 2em 2em;
  text-align: justify;
}

.hljs-attr {
  /* this is not working v-bind does not work in this case :/ */
  color: v-bind(themeVars.infoColorHover) !important;
}
.hljs-number {
  color: #18a058 !important;
}
.hljs-string {
  color: #2080f0 !important;
}

</style>
