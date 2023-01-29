import { toRef, inject, provide, reactive, watchEffect } from 'vue'
import { useBreakpoint, useMemo } from 'vooks'

import { useStore } from 'vuex'

export function useIsMobile () {
  const breakpointRef = useBreakpoint()
  return useMemo(() => {
    return breakpointRef.value === 'xs'
  })
}


// https://stackoverflow.com/a/73468350
export const merge = (object1, object2) => {
  if (Array.isArray(object2)) {
    return [...object1, ...object2]
  } else {
    return Object.entries(object2).reduce((acc, [key, value]) => {
      if (
        Object.keys(acc).includes(key) &&
        typeof value === 'object'
      ) {
        acc[key] = merge(acc[key], value)
      } else {
        acc[key] = value
      }

      return acc
    }, { ...object1 })
  }
}

// sometimes before loading the chart data we want to make sure
// the store has finished fetching data. Can't think of a way
// to make this coincise. Not very readable but does the job.
export const storeReady = async () => {
  const store = useStore()
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  let ready = false
  while(!ready) {
    let data = store.getters['chainData/getData']
    ready = Object.keys(data).length === 0 ? false : true
    await delay(500)
  }
  return true
}
