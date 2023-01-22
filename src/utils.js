import { toRef, inject, provide, reactive, watchEffect } from 'vue'
import { useBreakpoint, useMemo } from 'vooks'

export function useIsMobile () {
  const breakpointRef = useBreakpoint()
  return useMemo(() => {
    return breakpointRef.value === 'xs'
  })
}
