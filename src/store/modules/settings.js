const state = () => ({
  blockSpan: JSON.parse(localStorage.getItem('blockSpan')) || 120 // 12 hours
})

const getters = {
  getBlockSpan(state) { return state.blockSpan }
}

const actions = {
  async setBlockSpan({ commit }, value) {
    commit('setBlockSpan', value)
  }
}

const mutations = {
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
