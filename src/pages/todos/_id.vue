<template>
  <h1>일정내용</h1>
  <div v-if="loading">Loading...</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
          <div class="form-group">
            <label>일정명: </label>
            <input type="text" class="form-control" v-model="todo.subject">
          </div>
      </div>
      <div class="col-6">
          <div class="form-group">
            <label>진행상황: </label>
            <button class="btn" :class="todo.completed? 'btn-success' : 'btn-danger'" type="button">{{todo.completed ? "완료":"미완료"}}</button>
          </div>
      </div>
    </div>
    <button class="btn btn-primary" :disabled="!todoUpdate" >저장</button>
    <button class="btn btn-outline-dark ms-2" @click="moveToTodoListPage">취소</button>
  </form>
</template>
<script>
import { useRoute,useRouter } from "vue-router";
import axios from "axios";
import { ref,computed } from 'vue';
import _ from "lodash";
export default {
  setup() {
    const originalTodo=ref(null);
    const route = useRoute();
    const router = useRouter();
    const todo = ref(null);
    const loading=ref(true);

    const url="http://localhost:8080/todos/";
    const todoId=route.params.id;
    const todoUpdate=computed(()=>{
      //2개가 같으면 true, 다르면 false 를 반환함
      //다르면 update가 된걸로 추정해야함 
      return !_.isEqual(todo.value, originalTodo.value)
    })

    const onSave=()=>{
      axios.put(`${url}${todoId}`,{
        subject:todo.value.subject,
        completed: todo.value.completed,
        })
        .then((res) => { console.log("onSave",res);
          originalTodo.value={...res.data}
        })
        .catch((err) => { console.log(err); })
    }
    const getTodo = () => {
      axios.get(`${url}${todoId}`)
        .then((res) => { 
          todo.value = {...res.data}; 
          originalTodo.value={...res.data};
          /*  console.log(todo.value); */ 
          loading.value = false; 
          })
        .catch((err) => { console.log(err); })
    }
    getTodo();
    const moveToTodoListPage=()=>{
      router.push({name:"Todos"})
    }
    return {
      onSave,
      todo,
      loading,
      moveToTodoListPage,
      todoUpdate
    }
  }
}
</script>
<style></style>