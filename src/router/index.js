//라우터 설정!
import {createRouter, createWebHistory} from "vue-router";
//js 라 경로에 @ 안됨!
import Home from "../pages/index.vue"; //index여도 확장자.vue 면 써야함
import Todos from "../pages/todos/index.vue"; 
import Todo from "../pages/todos/_id.vue"; 

const router = createRouter({
    history:createWebHistory(),
    routes:[//객체형태로 입력
        {
            path:"/",
            name:"Home", //이름설정
            component:Home
        },
        {
            path:"/todos",
            name:"Todos", 
            component:Todos
        },
        {
            path:"/todos/:id",
            name:"Todo", 
            component:Todo
        }
    ],

});

export default router;