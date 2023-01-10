<script setup>
import { ref, onMounted } from 'vue'

const headerStyle = {
  'padding-bottom': '0em',
}

const contentStyle = {
  // padding: '1em 2em 1em 2.7em',
}

const footerStyle = {
  // padding: '1em 2em 1em 2em',
}

const randColor = Math.floor(Math.random()*16777215).toString(16)
const color = `linear-gradient(-45deg, #${randColor} 0%, #00ff87 100% )`

const loading = ref(true)

const reload = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 2000))
  loading.value = false
}

onMounted( async () => {
  await new Promise(r => setTimeout(r, 2000))
  loading.value = false
})



</script>

<template>

  <n-card
    v-model:value="loading"
    :header-style="headerStyle"
    :content-style="contentStyle"
    :footer-style="footerStyle"
    style="border-radius: 8px; min-width: 15em;"
    hoverable
  >
    <template #header>
      <n-skeleton v-if="loading" text width="60%" :sharp="false"/>
      <template v-else>
        chart name
      </template>
    </template>

    <template #header-extra>
      <n-tooltip trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-button tertiary circle type="primary" size="small">
            <n-icon :size="14">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 12 12"><g fill="none"><path d="M5.5 6.5a.5.5 0 0 1 1 0V8a.5.5 0 0 1-1 0V6.5zM6 3.75a.75.75 0 1 0 0 1.5a.75.75 0 0 0 0-1.5zM1 6a5 5 0 1 1 10 0A5 5 0 0 1 1 6zm5-4a4 4 0 1 0 0 8a4 4 0 0 0 0-8z" fill="currentColor"></path></g></svg>
            </n-icon>
          </n-button>
        </template>
        <div
          style="
            max-width: 30em;
            transform-origin: inherit;
            font-size: 70%;
            padding: 2em 2em 2em 2em;
          "
        >
          Who kicks a hole in the sky so the heaven cry over me.
        </div>
      </n-tooltip>
      <n-button tertiary circle type="info" size="small" :loading="loading" @click="reload">
        <template #icon>
          <n-icon :size="12">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4"></path><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path></g></svg>
          </n-icon>
        </template>
      </n-button>
    </template>
    <div v-if="loading">
      <n-space vertical>
        <n-space>
          <n-skeleton height="20px" width="50px" :sharp="false" />
          <n-skeleton height="20px" width="100px" :sharp="false" />
        </n-space>
        <n-skeleton height="80px" width="100%" :sharp="false" />
      </n-space>
    </div>
    <template v-else>
    Card Content
    </template>
    <template #footer>
      #footer
    </template>
  </n-card>
</template>

<style scoped>

.n-card:before {
  content: "";
  z-index: -1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: v-bind(color);
  transform: translate3d(25px, 0, 0) scale(0.675);
  filter: blur(20px);
  opacity: var(0.7);
  transition: opacity 0.3s;
  border-radius: inherit;
}

/*
* Prevents issues when the parent creates a
* stacking context. (For example, using the transform
* property )
*/
.n-card::after {
  content: "";
  z-index: -1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: inherit;
  border-radius: inherit;
}

</style>
