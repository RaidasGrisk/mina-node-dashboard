import { createApp } from 'vue'
import store from './store/index'
import './style.css'
import App from './App.vue'

// naive-ui
import naive from 'naive-ui'

// vercel analytics
import { inject } from '@vercel/analytics'
inject()

const app = createApp(App)
app.use(naive)
app.use(store)

app.mount('#app')
