import { createStore } from 'vuex'
import chainData from './modules/chainData'
import theme from './modules/theme'
import settings from './modules/settings'

const store = createStore({
  modules:{
    chainData: chainData,
    theme: theme,
    settings: settings,
  }
});

export default store;
