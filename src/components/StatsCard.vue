<script setup>
import { ref, onMounted } from 'vue'

// basic styles
const headerStyle = {
  'padding-bottom': '0.5em',
  'font-size': '1em'
}

const contentStyle = {
  'font-size': '0.9em'
}

const footerStyle = {
  'font-size': '0.9em'
}

// gradient shadow
const randColor = Math.floor(Math.random()*16777215).toString(16)
const color = `linear-gradient(-45deg, #${randColor} 0%, #00ff87 100% )`

const loading = ref(true)

const reload = async () => {
  loading.value = true
  await new Promise(r => setTimeout(r, 2000))
  loading.value = false
}

const showModal = ref(false)

onMounted( async () => {
  await new Promise(r => setTimeout(r, 2000))
  loading.value = false
})



</script>

<template>

  <n-card
    class="gradientShadow"
    v-model:value="loading"
    :header-style="headerStyle"
    :content-style="contentStyle"
    :footer-style="footerStyle"
    style="border-radius: 8px; min-width: 15em; min-height: 12em;"
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
      <n-button tertiary circle type="tertiary" size="small" @click="showModal = true">
        <template #icon>
          <n-icon :size="12">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h1.865a.75.75 0 1 1 0 1.5H5.25a.75.75 0 0 0-.75.75v1.865a.75.75 0 1 1-1.5 0V5.25zm9.135-1.5a.75.75 0 0 1 .75-.75h1.865A2.25 2.25 0 0 1 17 5.25v1.865a.75.75 0 0 1-1.5 0V5.25a.75.75 0 0 0-.75-.75h-1.865a.75.75 0 0 1-.75-.75zM3.75 12.135a.75.75 0 0 1 .75.75v1.865c0 .414.336.75.75.75h1.865a.75.75 0 0 1 0 1.5H5.25A2.25 2.25 0 0 1 3 14.75v-1.865a.75.75 0 0 1 .75-.75zm12.5 0a.75.75 0 0 1 .75.75v1.865A2.25 2.25 0 0 1 14.75 17h-1.865a.75.75 0 0 1 0-1.5h1.865a.75.75 0 0 0 .75-.75v-1.865a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>
          </n-icon>
        </template>
      </n-button>
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
        <n-skeleton height="50px" width="100%" :sharp="false" />
      </n-space>
    </div>
    <template v-else>
    Card Content
    </template>
    <template #footer>
      #footer
    </template>
  </n-card>

  <template>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="Modal"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        <template #header-extra>
          Oops!
        </template>
        Content
        <template #footer>
          Footer
        </template>
      </n-card>
    </n-modal>
  </template>

</template>

<style scoped>

.gradientShadow {
  transform: translate3d(0, 0, 0) scale(1);
}

.gradientShadow:before {
  content: "";
  z-index: -1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: v-bind(color);
  transform: translate3d(25px, 0, 0) scale(0.7);
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
.gradientShadow::after {
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
