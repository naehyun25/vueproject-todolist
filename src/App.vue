<template>
  <div class="container">
    <h1>오늘의 할일</h1>
    <input v-model="searchText" type="text" class="form-control" placeholder="검색어를 입력하세요" />
    <TodoBasicForm @add-todo="onSubmit" />
    <div style="color:red">{{ error }}</div>
    <div v-if="!todos.length">등록된 일정이 없습니다</div>
    <div v-if="!filteredTodos.length">검색결과가 없습니다</div>
    <TodoList :todos="filteredTodos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />
  </div>
</template>

<script>
import { ref, computed } from "vue";
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
    const getTodos = () => {
      axios.get("http://localhost:8080/todos")
        .then((res) => {
          todos.value = res.data.todos;
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
      error
    };
  },
};
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}
</style>