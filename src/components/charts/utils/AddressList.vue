<script setup>
import { ref, defineProps } from 'vue'
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()

const props = defineProps({
  data: {
    address: { type: String, default: '//' },
    stat: {type: String, default: '//'},
  },
})

</script>

<template>
  <n-collapse-transition :appear="true">
    <n-space v-for="item in data" justify="space-between">
      <div class="flex-parent">
        <n-text depth="2" type="success" code tag="div" class="flex-child long-and-truncated" style="font-size: 0.8em">
          <a :href="'https://minaexplorer.com/wallet/' + item.address" target="_blank">
            {{ item.address.slice(0, 35) + ' ... ' + item.address.slice(-5) }}
          </a>
        </n-text>
        <div class="flex-child short-and-fixed" style="padding-bottom: 2px;">
          <div>
            <n-divider vertical style="height: 14px; width: 2px; margin-left: 16px;"/>
          </div>
          <div>
            <n-tooltip trigger="hover" placement="right" style="font-size: 70%;">
              <template #trigger>
                <n-text depth="3" style="font-size: 0.90em; cursor: pointer;">
                  {{ item.stat }}
                </n-text>
              </template>
              {{ item.tooltip }}
            </n-tooltip>
          </div>
        </div>
      </div>
    </n-space>
  </n-collapse-transition>
</template>

<style scoped>

.flex-parent {
  display: flex;
  align-items: center;
}

.long-and-truncated {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.short-and-fixed {
  white-space: nowrap;
}

.short-and-fixed div {
  width: 30px;
  display: inline-block;
  padding-bottom: 0px;
}

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
