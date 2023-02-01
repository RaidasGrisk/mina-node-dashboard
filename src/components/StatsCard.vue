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

// other vars
const showModal = ref(false)
const props = defineProps({
  data: {type: Object, default: {
    chartName: { type: String, default: '//' },
    additionalValues: {type: Array, default: []},
    mainValue: {type: Number, default: null},
    changeValue: {type: Number, default: null},
    description: {type: String, default: null},
  }},
  loading: {type: Boolean, default: false},
  showChartOnOpenModal: {type: Boolean, default: true},
})
const emits = defineEmits(['reload'])
</script>

<template>

  <n-card
    class="gradientShadow"
    v-model="props.loading"
    :header-style="headerStyle"
    :content-style="contentStyle"
    :footer-style="footerStyle"
    style="border-radius: 8px; min-width: 20em; min-height: 16.5em;"
    hoverable
  >
    <template #header>
      <n-collapse-transition :appear="true">
        {{ props.data.chartName }}
      </n-collapse-transition>
    </template>

    <template #header-extra>
      <n-tooltip trigger="hover" :show-arrow="false">
        <template #trigger>
          <n-button tertiary circle type="primary" size="small" :disabled="loading">
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
            text-align: justify;
          "
        >
        <div v-html="props.data.description"></div>
        </div>
      </n-tooltip>
      <n-button tertiary circle type="tertiary" size="small" @click="showModal = true" :disabled="loading">
        <template #icon>
          <n-icon :size="12">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"><g fill="none"><path d="M3 5.25A2.25 2.25 0 0 1 5.25 3h1.865a.75.75 0 1 1 0 1.5H5.25a.75.75 0 0 0-.75.75v1.865a.75.75 0 1 1-1.5 0V5.25zm9.135-1.5a.75.75 0 0 1 .75-.75h1.865A2.25 2.25 0 0 1 17 5.25v1.865a.75.75 0 0 1-1.5 0V5.25a.75.75 0 0 0-.75-.75h-1.865a.75.75 0 0 1-.75-.75zM3.75 12.135a.75.75 0 0 1 .75.75v1.865c0 .414.336.75.75.75h1.865a.75.75 0 0 1 0 1.5H5.25A2.25 2.25 0 0 1 3 14.75v-1.865a.75.75 0 0 1 .75-.75zm12.5 0a.75.75 0 0 1 .75.75v1.865A2.25 2.25 0 0 1 14.75 17h-1.865a.75.75 0 0 1 0-1.5h1.865a.75.75 0 0 0 .75-.75v-1.865a.75.75 0 0 1 .75-.75z" fill="currentColor"></path></g></svg>
          </n-icon>
        </template>
      </n-button>
      <n-button tertiary circle type="info" size="small" :loading="loading" @click="$emit('reload')">
        <template #icon>
          <n-icon :size="12">
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4"></path><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path></g></svg>
          </n-icon>
        </template>
      </n-button>
    </template>
    <div v-if="props.loading">
      <n-space vertical>
        <n-space>
          <n-skeleton height="15px" width="30px" :sharp="false" />
          <n-skeleton height="15px" width="120px" :sharp="false" />
        </n-space>
        <n-space>
          <n-skeleton height="15px" width="50px" :sharp="false" />
          <n-skeleton height="15px" width="100px" :sharp="false" />
        </n-space>
        <n-skeleton height="114px" width="100%" :sharp="false" />
      </n-space>
    </div>
    <template v-else>
      <n-space size="small" v-for="obj in props.data.additionalValues">
        <template v-if="(obj.value !== null) | obj.text">
          <n-text strong>
            <n-number-animation
              :from="0"
              :to="obj.value"
              :active="true"
              :precision="obj.precision | 0"
            />
          </n-text>
          <n-collapse-transition :appear="true">
            <n-text depth="3">
              {{ obj.text }}
            </n-text>
          </n-collapse-transition>
          <br>
        </template>
      </n-space>
      <slot v-if="props.showChartOnOpenModal ? true: !showModal"></slot>
    </template>
  </n-card>

  <!-- Below is the modal
  Same as the card itself, but slightly diffrerent layout. -->
  <template>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        :bordered="true"
        size="huge"
        :segmented="{
          content: true,
          footer: 'soft'
        }"
      >
      <template #header>
        {{ props.data.chartName }}
      </template>
        <template #default>
          <!-- this is just copy pasted from above.
          Not very good architecture but oh well :// -->
          <n-space size="small" v-for="obj in props.data.additionalValues">
            <template v-if="(obj.value !== null) | obj.text">
              <n-text strong>
                <n-number-animation
                  :from="0"
                  :to="obj.value"
                  :active="true"
                  :precision="obj.precision | 0"
                />
              </n-text>
              <n-collapse-transition :appear="true">
                <n-text depth="3">
                  {{ obj.text }}
                </n-text>
              </n-collapse-transition>
              <br>
            </template>
          </n-space>
          <slot></slot>
        </template>
        <template #footer>
          <n-text depth="3" style="font-size: 80%">
            <div v-html="props.data.description" style="text-align: justify; text-justify: inter-word;"></div>
          </n-text>
        </template>
      </n-card>
    </n-modal>
  </template>

</template>

<style scoped>

.gradientShadow {
  transform: translate3d(0, 0, 0) scale(1);
  transition: transform .6s ease-out;
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
  transform: translate3d(0, 25px, 0) scale(0.7);
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

.gradientShadow:hover {
  /* transform: scale(1.01); */
}

</style>
