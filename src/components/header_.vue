<script setup>
import { ref, onMounted } from 'vue'
import { useThemeVars } from 'naive-ui'
import { useStore } from 'vuex'
import { useIsMobile } from '../utils'

const themeVars = useThemeVars()
const store = useStore()
const isMobile = useIsMobile()
const emits = defineEmits(['logoClick'])
const selectedNetwork = 'Mainnet'

const lookBackBlocks = ref(store.getters['settings/getBlockSpan'])

</script>

<template>
  <n-layout-header bordered>
    <n-page-header :style="isMobile ? 'padding: 0.5em 1em 0.5em 1em;': 'padding: 1em 3em 1em 3em; max-width: 125vh; margin: 0 auto;'">
      <template #title>
        <a href="/" style="text-decoration: none; color: inherit">
          <b>MINA protocol</b> <n-text depth="3"><br> Node dashboard</n-text>
        </a>
      </template>
      <template #header>
      </template>
      <template #avatar>
        <n-element>
          <n-avatar :size="64" class="logo" @click="$emit('logoClick')">
            <n-text style="font-size: 36px;">
              🛰️
            </n-text>
          </n-avatar>
        </n-element>
      </template>
      <template #extra>
        <n-space>
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

          <n-popover
            display-directive="show"
            trigger="click"
            :show-arrow="false"
          >
            <template #trigger>
              <n-button tertiary type="primary" size="large">
                <template #icon>
                  <n-icon>
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none"><path d="M12.013 2.25c.734.008 1.465.093 2.181.253a.75.75 0 0 1 .582.649l.17 1.527a1.384 1.384 0 0 0 1.928 1.116l1.4-.615a.75.75 0 0 1 .85.174a9.793 9.793 0 0 1 2.204 3.792a.75.75 0 0 1-.271.825l-1.242.916a1.38 1.38 0 0 0 .001 2.226l1.243.915a.75.75 0 0 1 .271.826a9.798 9.798 0 0 1-2.203 3.792a.75.75 0 0 1-.849.175l-1.406-.617a1.38 1.38 0 0 0-1.927 1.114l-.169 1.526a.75.75 0 0 1-.572.647a9.518 9.518 0 0 1-4.405 0a.75.75 0 0 1-.572-.647l-.17-1.524a1.382 1.382 0 0 0-1.924-1.11l-1.407.616a.75.75 0 0 1-.849-.175a9.798 9.798 0 0 1-2.203-3.796a.75.75 0 0 1 .271-.826l1.244-.916a1.38 1.38 0 0 0 0-2.226l-1.243-.914a.75.75 0 0 1-.272-.826a9.793 9.793 0 0 1 2.205-3.792a.75.75 0 0 1 .849-.174l1.4.615a1.387 1.387 0 0 0 1.93-1.118l.17-1.526a.75.75 0 0 1 .583-.65c.718-.159 1.45-.243 2.202-.252zm0 1.5a9.135 9.135 0 0 0-1.355.117l-.109.977A2.886 2.886 0 0 1 6.525 7.17l-.898-.394a8.293 8.293 0 0 0-1.348 2.317l.798.587a2.881 2.881 0 0 1 0 4.643l-.798.588c.32.842.775 1.626 1.347 2.322l.906-.397a2.882 2.882 0 0 1 4.017 2.318l.108.984c.89.15 1.799.15 2.689 0l.108-.984a2.88 2.88 0 0 1 4.02-2.322l.904.396a8.299 8.299 0 0 0 1.347-2.318l-.798-.588a2.88 2.88 0 0 1 0-4.643l.796-.587a8.293 8.293 0 0 0-1.348-2.317l-.896.393a2.884 2.884 0 0 1-4.023-2.324l-.11-.976a8.99 8.99 0 0 0-1.333-.117zM12 8.25a3.75 3.75 0 1 1 0 7.5a3.75 3.75 0 0 1 0-7.5zm0 1.5a2.25 2.25 0 1 0 0 4.5a2.25 2.25 0 0 0 0-4.5z" fill="currentColor"></path></g></svg>
                  </n-icon>
                </template>
              </n-button>
            </template>
            <div>
              <n-space vertical>
                <n-h3 type="primary">Settings</n-h3>
                <n-form>
                  <n-form-item label="Dark / light mode">
                    <n-button tertiary @click="store.dispatch('theme/changeTheme')" :style="{ width: '4em' }">
                      <template #icon>
                        <n-icon :color="themeVars.warningColor">
                          <div v-if="store.getters['theme/themeIsLight']">
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M3 12h1m8-9v1m8 8h1m-9 8v1M5.6 5.6l.7.7m12.1-.7l-.7.7m0 11.4l.7.7m-12.1-.7l-.7.7"></path></g></svg>
                          </div>
                          <div v-else>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><path d="M12 3h.393a7.5 7.5 0 0 0 7.92 12.446A9 9 0 1 1 12 2.992z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                          </div>
                        </n-icon>
                      </template>
                    </n-button>
                  </n-form-item>
                  <n-form-item>
                    <template #label>
                      Look back period in blocks <br> <n-text :depth="3" style="font-size: 80%">(applies to some charts only)</n-text>
                    </template>
                    <n-space>
                    <n-input-number v-model:value="lookBackBlocks" :min="10" :max="999" style="max-width: 8em;"/>
                    <n-tooltip trigger="hover" placement="bottom">
                      <template #trigger>
                        <n-button @click="store.dispatch('settings/setBlockSpan', lookBackBlocks)" tertiary>
                          <template #icon>
                            <n-icon :color="themeVars.warningColor">
                              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4"></path><path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"></path></g></svg>
                            </n-icon>
                          </template>
                        </n-button>
                      </template>
                      Reload the data
                    </n-tooltip>
                  </n-space>
                  </n-form-item>
                </n-form>
              </n-space>
            </div>
          </n-popover>
        </n-space>
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
