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
       <!-- aria-label="Page navigation example" 접근성 필요없음 -->
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
import { ref, computed, /* watchEffect, */ reactive, watch } from "vue";
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
    //watch-> vue2 (구버전)
    //watchEffect(vue3에서 새로나옴) : 값의 변화가 있을 경우 작동! reactive한 요소만 추적가능 -> 원시타입은 reactive로 감싸준다.
    // watchEffect(()=>{
    //   console.log("watchEffect", currentPage.value) //숫자형
    //   console.log("totalTodos",totalTodos.value) //문자형-> 추적불가(원시타입)-> 추적가능한 값으로 바꿔줘야함
    // })
    //   //1. 이렇게 보면 아래 watchEffect안의 두 값의 자료형이 다름을 알 수 있다.
    //   console.log(currentPage, totalTodos)
    //   //2. reactive한 요소로 변경해서 watchEffect 가 추적할 수 있도록 해준 예시.
    //   const a = reactive({b : "안"});
    //   watchEffect(()=>{console.log(a.b)})
    //   a.b="녕";


      const numberOfPages=computed(()=>{
        return Math.ceil(totalTodos.value/limit);
      });
    const filteredTodos = computed(() => {
      //입력만되면 ture
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
          //속성명에 특수문자가 있을 경우 대괄호로 표기한다.
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
        //두개 사용시 배열로
        console.log(res.data,res.data.todos)
        return [
          todos.value.push(res.data),//배열로 밀어넣고
          getTodos() //조회함수다시 호출하면 새로고침안해도됨
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
    /* fetch : 부분적 수정 ,put : 전체수정 */
    const toggleTodo = (index) => {
      const id=index
      axios.post("http://localhost:8080/todos/" + id)
        .then((res) => { console.log("toggleTodo-res",res); })
        .catch((err) => console.log(err));
        getTodos();
      // console.log(index);
      // todos.value[index].completed = !todos.value[index].completed;
    };
    //화면에 나타나야하는것만 return
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