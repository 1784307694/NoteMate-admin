import { createApp } from "vue"
import { createPinia } from "pinia"
import ElementPlus from "element-plus"
import * as ElementPlusIconsVue from "@element-plus/icons-vue"
import zhCn from "element-plus/es/locale/lang/zh-cn"

import App from "./App.vue"
import { setupRouter } from "./router"
import "element-plus/dist/index.css"
import "normalize.css"
import "./assets/css/index.less"
import "./assets/css/loading.css"

const app = createApp(App)

/** 初始化 Pinia */
app.use(createPinia())

/** 初始化路由 */
await setupRouter(app)

/** 导入 Element Plus */
app.use(ElementPlus, { locale: zhCn })
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.mount("#app")
