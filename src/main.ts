/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'
import { createPinia } from 'pinia';

// Styles
import 'unfonts.css'

const pinia = createPinia();
const app = createApp(App).use(pinia);

registerPlugins(app)

app.mount('#app')
