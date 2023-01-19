<script setup>
import { ref, onMounted } from 'vue'
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()
const emits = defineEmits(['logoClick'])
const selectedNetwork = 'Mainnet'

</script>

<template>
  <n-layout-header bordered>
    <n-page-header subtitle="">
      <template #title>
        <a href="/" style="text-decoration: none; color: inherit">
          <b>MINA protocol</b> <n-text depth="3"><br> Node dashboard</n-text>
        </a>
      </template>
      <template #header>

      </template>
      <template #avatar>
        <n-element>
          <n-avatar :size="64" style="margin-left: 1.7em;" class="logo" @click="$emit('logoClick')">
            <n-text style="font-size: 36px;">
              🛰️
            </n-text>
          </n-avatar>
        </n-element>
      </template>
      <template #extra>
        <n-dropdown trigger="hover" :options="[{label: 'Mainnet'}, {label: 'Berkeley', disabled: true}]" @select="">
          <n-button tertiary type="info" size="large">
            <template #icon>
              <n-icon :color="themeVars.primaryColor">
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path fill-opacity=".3" d="M23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7L12 21.5L23.64 7z" fill="currentColor"></path><path d="M3.53 10.95L12 21.5l8.47-10.55C20.04 10.62 16.81 8 12 8s-8.04 2.62-8.47 2.95z" fill="currentColor"></path></svg>
              </n-icon>
            </template>
            <template #default>
              <n-text type="primary"> {{ selectedNetwork }} </n-text>
            </template>
          </n-button>
        </n-dropdown>
      </template>
      <template #footer>
      </template>
    </n-page-header>
  </n-layout-header>
</template>

<style scoped>

.logo {
  will-change: filter;
  transition: filter .9s ease-out;
  transition: transform .6s ease-out;
  cursor: pointer;
}
.logo:hover {
  filter: drop-shadow(0 0 0.3em var(--info-color));
  transform: scale(1.1);
}

</style>
