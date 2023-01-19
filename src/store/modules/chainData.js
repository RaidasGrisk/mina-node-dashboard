const state = () => ({
  url: 'https://graphql.minaexplorer.com/',
  data: {}
})

const getters = {
  getData(state) { return state.data },
  getURL(state) { return state.url }
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
  }
}

const mutations = {
  setData(state, value) {
    state.data = value
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
