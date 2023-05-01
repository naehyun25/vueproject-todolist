<template>
  <div class="container">
    <h1>오늘의 할일</h1>
    <input v-model="searchText" type="text" class="form-control" placeholder="검색어를 입력하세요" @keyup.enter="searchTodos" />
    <TodoBasicForm @add-todo="onSubmit" />
    <div style="color:red">{{ error }}</div>
    <div v-if="!todos.length">등록된 일정이 없습니다</div>
    <!-- <div v-if="!filteredTodos.length">검색결과가 없습니다</div> -->
    <!-- :todos="filterTodos"-> todos 로변경 화면단이 아닌 db단에서 필터링 할 예정 -->
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

      const numberOfPages=computed(()=>{
        return Math.ceil(totalTodos.value/limit);
      });
      
      //watch 할 대상이 2개이상이 아니라 1개만 추적해야하면 추적할 값만 쓰면 되는데 그럴때는 searchText.value 가 아닌 searchText 만 쓰면 된다.
      //ex1. 2개이상일때  -> watch(()=>{return searchText.value}, (current,prev)=>{console.log(current,prev)})
      //ex2. 대상이 1개일때 watch(searchText, (current,prev)=>{console.log(current,prev)})
      
      let timeout=null
      watch(searchText, ()=>{timeout=setTimeout(()=>{getTodos(1)},2000)}) //값이 변경되면 getTodos호출하면서 매개변수인 btn에 1을 전달.
      const searchTodos=()=>{
        clearTimeout(timeout);
        getTodos(1)
      }
      console.log(searchText.value)
    // const filteredTodos = 삭제함
       //searchText의 값이 바뀌면 그 값을 추적하도록한다. 이전에는 바뀌는 안바뀌든 무조건 비교하고 있음. (해당부분 수정)
       //현재 페이지에서만 검색이 된다.(db 전체가 아닌 현재페이지에 있는 데이터만 필터링하고 있다. 실제 db랑 연동이 되지 않은것!)

    const getTodos = (btn=currentPage.value) => {
      currentPage.value=btn
      //전체 db를 필터링 하기 위해 이 부분을 수정 (filteredTodos삭제하고: 쿼리문사용으로 바꿔야함!)
      //유사단어 검색 라우터: _like
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
      // filteredTodos,
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