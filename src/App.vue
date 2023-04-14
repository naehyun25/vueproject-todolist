<template>
  <div class="container">
    <h1>오늘의 할일 (좀 하자 ...)</h1>
    <TodoBasicForm @add-todo="onAdd"/>
    <div v-if="!todos.length">등록된 일정이 없습니다.</div>
    <TodoList :todos="todos"/>
    {{TodoList}}
  
  </div> 
</template>

<script>
import { ref } from "vue";
import TodoBasicForm from './TodoBasicForm.vue';
import TodoList from './TodoList.vue';
export default {
  components:{TodoBasicForm, TodoList},
  setup() {
  let todos = ref([]);

    const todoStyle={
        color:"gray",
        textDecoration : "line-through",
    }
    const deleteTodo=(data) => {
        todos.value.splice(data,1)
    }
    const onAdd=(todo) => {
      console.log(todo)
      todos.value.push(todo)
    }
    // 퀴즈
    const onalert=(data)=>{
      alert(data.msg)
    }
    return {
      todos,
      todoStyle,
      deleteTodo,
      onAdd,
      onalert
    };
  },
};
</script>

<style>
.red {
  color: red;
}
.todo{
  color:gray;
  text-decoration: line-through;
}
</style>