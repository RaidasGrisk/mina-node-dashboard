const state = () => ({
  url: 'https://graphql.minaexplorer.com/',
  data: {},
  blockSpan: JSON.parse(localStorage.getItem('blockSpan')) || 120 // 12 hours
})

const getters = {
  getData(state) { return state.data },
  getURL(state) { return state.url },
  getBlockSpan(state) { return state.blockSpan }
}

const actions = {
  async getData({ commit }) {
    try {
      const url = 'https://api.minaexplorer.com/summary'
      let response = await fetch(url, { method: 'GET' })
      response = await response.json()
      commit('setData', response)
      return response
    } catch (error) {
      console.log(`${url} call returned error`, error)
    }
  },
  async setBlockSpan({ commit }, value) {
    commit('setBlockSpan', value)
  }
}

const mutations = {
  setData(state, value) {
    state.data = value
  },
  setBlockSpan(state, value) {
    state.blockSpan = value
    localStorage.setItem('blockSpan', value)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
