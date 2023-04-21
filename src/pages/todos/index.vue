<template>
<router-view />
  <div class="container">
    <h1>오늘의 할일</h1>
    <input v-model="searchText" type="text" class="form-control" placeholder="검색어를 입력하세요" @keyup.enter="searchTodos" />
    <TodoBasicForm @add-todo="onSubmit" />
    <div style="color:red">{{ error }}</div>
    <div v-if="!todos.length">등록된 일정이 없습니다</div>
    <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />
    <nav>
      <ul class="pagination justify-content-center">
        <li v-if="currentPage !== 1" class="page-item"><a class="page-link" @click="getTodos(currentPage-1)">Previous</a></li>
        <li  v-for="btn in numberOfPages" class="page-item" :key="btn" :class="currentPage === btn ? 'active':''">
          <a class="page-link" @click="getTodos(btn)">{{btn}}</a></li>
        <li v-if="currentPage !== numberOfPages" class="page-item"><a class="page-link" @click="getTodos(currentPage+1)">Next</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, computed, watch} from "vue";
import axios from "axios";
//vue에서는  @ -> 최상위경로:src로부터 시작한다.
import TodoBasicForm from "@/components/TodoBasicForm.vue";
import TodoList from "@/components/TodoList.vue";

export default {
  components: {
    TodoBasicForm,
    TodoList,
  },
  setup() {
    let error = ref("");
    const toggle = ref(false);
    const searchText = ref("");
    const todos = ref([]);
    const totalTodos = ref(0);
    const limit = 5;
    const currentPage=ref(1);

      const numberOfPages=computed(()=>{
        return Math.ceil(totalTodos.value/limit);
      });
    
      
      let timeout=null
      watch(searchText, ()=>{timeout=setTimeout(()=>{getTodos(1)},2000)}) 
      const searchTodos=()=>{
        clearTimeout(timeout);
        getTodos(1)
      }
      console.log(searchText.value)

    const getTodos = (btn=currentPage.value) => {
      currentPage.value=btn
      axios.get(`http://localhost:8080/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${btn}&_limit=${limit}`)
        .then((res) => {
          todos.value = res.data;
          totalTodos.value = res.headers["x-total-count"];
        })
        .catch((err) => { console.log(err); error.value = "getTodos 일시적으로 오류발생." })
    }
    getTodos();
    const onSubmit = (todo) => {
      error.value = "";
      axios.post("http://localhost:8080/todos", {
        subject: todo.subject,
        completed: todo.completed,
      }).then((res) => {
        console.log(res.data,res.data.todos)
        return [
          todos.value.push(res.data),
          getTodos() 
        ]
      }).catch((err) => {
        "😋", console.log(err);
        error.value = "일시적으로 에러가 발생 잠시후 다시해주세요"
      })
    };
    const deleteTodo = (index) => {
      error.value = "";
      const id = index;
      axios.delete("http://localhost:8080/todos/" + id)
        .then(() => {
          getTodos();
        })
        .catch((err) => { console.log(err); })
    };
    const toggleTodo = (index) => {
      const id=index
      axios.post("http://localhost:8080/todos/" + id)
        .then((res) => { console.log("toggleTodo-res",res); })
        .catch((err) => console.log(err));
        getTodos();
    };
    return {
      searchText,
      onSubmit,
      todos,
      toggle,
      getTodos,
      deleteTodo,
      toggleTodo,
      error,
      numberOfPages,
      currentPage,
      searchTodos
    };
  },
};
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}
.page-item a{cursor:pointer}
</style>