<template>
  <div class="container">
    <h1>오늘의 할일</h1>
    <input v-model="searchText" type="text" class="form-control" placeholder="검색어를 입력하세요" />
    <TodoBasicForm @add-todo="onSubmit" />
    <div style="color:red">{{ error }}</div>
    <div v-if="!todos.length">등록된 일정이 없습니다</div>
    <div v-if="!filteredTodos.length">검색결과가 없습니다</div>
    <TodoList :todos="filteredTodos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />
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
import { ref, computed, reactive, watch } from "vue";
import axios from "axios";
import TodoBasicForm from "./components/TodoBasicForm.vue";
import TodoList from "./components/TodoList.vue";

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
    const a = reactive({b:"안", c:"잘"});
    //watch(=watchEffect) : vue2 -구버전에서 사용함
    //watch는 인자로 2개의 콜백함수를 작성한다.(문법)
    //1번째 함수에는 추적할 대상의 값을 리턴문안에 넣어준다.(값이 바뀔때 반환받아야 하므로 리턴문안에 넣는다.)
    //2번째 함수에는 매개변수로 추적대상의 새값, 이전값을 넣어주면 watch가 자동으로 인식한다.  
    watch(
      ()=>{return[a.b, a.c]}, //1. 추적할 값을 넣음  //2개 리턴하려면 [배열로] 쓰는거 잊지말자 !!!!!!!
      (current, prev)=>{console.log(current,prev)} //2. 현재값과 이전값을 출력
      )
    a.b="녕";

    


      const numberOfPages=computed(()=>{
        return Math.ceil(totalTodos.value/limit);
      });
    const filteredTodos = computed(() => {
      if (searchText.value) {
        return todos.value.filter((todo) => {
          console.log(todo)
          console.log(todos.value, todo);
          return todo.subject.includes(searchText.value);
        });
      }
      return todos.value;
    });
    const getTodos = (btn=currentPage.value) => {
      currentPage.value=btn
      axios.get(`http://localhost:8080/todos?_page=${btn}&_limit=${limit}`)
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
      filteredTodos,
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
      a
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