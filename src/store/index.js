import { createStore } from 'vuex'
import chainData from './modules/chainData'

const store = createStore({
  modules:{
    chainData: chainData,
  }
});

export default store;
