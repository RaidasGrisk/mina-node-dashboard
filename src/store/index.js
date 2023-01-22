import { createStore } from 'vuex'
import chainData from './modules/chainData'
import theme from './modules/theme'

const store = createStore({
  modules:{
    chainData: chainData,
    theme: theme,
  }
});

export default store;
