<template>
  <h1>일정내용</h1>
  <div v-if="loading">Loading...</div>
  <form v-else @submit.prevent="onSave">
    <div class="row">
      <div class="col-6">
        <div class="form-group"><label>일정명: </label><input type="text" class="form-control" v-model="todo.subject"></div>
      </div>
      <div class="col-6">
        <div class="form-group"><label>수행상태: </label>
          <button class="btn" 
          :class="(todo.completed) ? ('btn-success') : ('btn-danger')" type="button"
          @click="toggleTodoStatus"
          >
            {{ todo.completed ? ("완료") : ("미완료") }}
          </button>
        </div>
      </div>
    </div>
    <button class="btn btn-primary" :disabled="!todoUpdate">저장</button>
    <button class="btn btn-outline-dark ms-2" @click="moveToTodoListPage">취소</button>
  </form>
</template>
<script>
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { ref, computed } from "vue";
import _ from "lodash";

export default {
  setup() {
    const originalTodo = ref(null);
    const route = useRoute();
    const routers = useRouter();
    const todo = ref(null);
    const loading = ref(true);
    const todoId = route.params.id
    const url = "http://localhost:8080/todos/"

    const todoUpdate = computed(() => {
      //isEqual 같음 true 다르면false
      return !_.isEqual(todo.value, originalTodo.value)
    })
    const toggleTodoStatus = ()=>{
      todo.value.completed=!todo.value.completed;
    }
    const onSave = () => {
      axios.put(`${url}${todoId}`, {
        subject: todo.value.subject,
        complete: todo.value.completed,
      }).then((res) => {
        originalTodo.value = { ...res.data }
      }).catch((err) => { console.error(err) })
    }
    const getTodo = () => {
      axios.get(`${url}${todoId}`).then((res) => {
        todo.value = { ...res.data };
        originalTodo.value = { ...res.data };
        loading.value = false;
      }).catch((err) => { console.error(err) })
    }
    getTodo();
    const moveToTodoListPage = () => {
      routers.push({
        name: "Todos"
      })
    }
    return {
      onSave,
      todo,
      loading,
      moveToTodoListPage,
      todoUpdate,
      toggleTodoStatus
    }
  }
}
</script>
<style></style>