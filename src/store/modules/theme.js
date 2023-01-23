import { darkTheme, lightTheme } from 'naive-ui'
import { useThemeVars } from 'naive-ui'

const state = () => ({
  themeIsLight: JSON.parse(localStorage.getItem('themeIsLight')),
  lightTheme: lightTheme,
  darkTheme: darkTheme,
  themeOverrides: {
    LoadingBar: {
      colorLoading: '#2081f0', // cant get ThemeVars to work here, so hardcoding
      height: '10px'
    },
    common: {
      infoColor: '#2080f0' // keep same for light and dark
    }
  }
})

const getters = {
  getTheme(state) {
    return state.themeIsLight ? state.lightTheme : state.darkTheme
  },
  getThemeOverrides(state) {
    return state.themeOverrides
  },
  themeIsLight(state) {
    return state.themeIsLight
  }
}

const actions = {
  async changeTheme({ commit }) {
    commit('changeTheme')
  }
}

const mutations = {
  changeTheme(state) {
    localStorage.setItem('themeIsLight', !state.themeIsLight)
    state.themeIsLight = !state.themeIsLight
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
