<script setup>
import { ref, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useThemeVars, useLoadingBar } from 'naive-ui'

const data = ref(null)
const themeVars = useThemeVars()

const loadingBar = useLoadingBar()
const store = useStore()

const getData = async () => {
  data.value = null // to trigger animation
  loadingBar.start()
  const chainData = await store.dispatch('chainData/getData')
  data.value = chainData
  loadingBar.finish()
}

onMounted(() => {
  getData()

  // loading bar config
  loadingBar.loadingBarRef.value.cssVars['--n-height'] = "10px"
  loadingBar.loadingBarRef.value.cssVars['--n-color-loading'] = themeVars.value.infoColor

})

defineExpose({
  getData,
});

</script>

<template>
  <n-collapse-transition :appear="true">
    <div style="text-align: center; padding: 1em 0em 1em 0em;">
      <n-space justify="center" :size="[150, 50]">

        <n-statistic label="Epoch" style="min-width: 10em;">
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
          <template #label>

          </template>
        </n-statistic>

        <n-statistic label="Block" style="min-width: 10em;">
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

        <n-statistic label="Slot" style="min-width: 10em;">
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

      </n-space>
    </div>
  </n-collapse-transition>
  <n-divider style="max-width: 45em; display: block; margin-left: auto; margin-right: auto;"/>

</template>

<style scoped>

</style>
