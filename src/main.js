//라우터 설치
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'; //파일명 index.js라 뒤에 파일명 안써도됨


createApp(App).use(router).mount('#app')
