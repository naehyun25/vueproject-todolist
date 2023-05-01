<template>
  <div>
    <h1>오늘의 할일</h1>
    <input v-model="searchText" type="text" class="form-control" placeholder="검색어를 입력하세요" @keyup.enter="searchTodos" />
    <TodoBasicForm @add-todo="onSubmit" />
    <div style="color: red">{{ error }}</div>
    <div v-if="!todos.length">등록된 일정이 없습니다</div>
    <TodoList :todos="todos" @toggle-todo="toggleTodo" @delete-todo="deleteTodo" />
    <nav>
      <ul class="pagination justify-content-center">
        <li v-if="currentPage !== 1" class="page-item"><a class="page-link"
            @click="getTodos(currentPage - 1)">Previous</a>
        </li>
        <li v-for="btn in numberOfPages" class="page-item" :key="btn" :class="currentPage === btn ? 'active' : ''">
          <a class="page-link" @click="getTodos(btn)">{{ btn }}</a>
        </li>
        <li v-if="currentPage !== numberOfPages" class="page-item"><a class="page-link"
            @click="getTodos(currentPage + 1)">Next</a></li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import axios from "axios";
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
    const currentPage = ref(1);

    const numberOfPages = computed(() => {
      return Math.ceil(totalTodos.value / limit);
    });
    let timeout = null;

    watch(searchText, () => { timeout = setTimeout(() => { getTodos(1) }, 2000) })
    const searchTodos = () => {
      clearTimeout(timeout);
      getTodos(1)
    }

    const getTodos = (btn = currentPage.value) => {
      currentPage.value = btn;
      axios
        .get(`http://localhost:8080/todos?_sort=id&_order=desc&subject_like=${searchText.value}&_page=${btn}&_limit=${limit}`)
        .then((res) => {
          totalTodos.value = res.headers["x-total-count"];
          todos.value = res.data;
        })
        .catch((err) => {
          console.log(err);
          error.value = "일시적으로 오류가 발생했습니다 잠시후 이용해쥬새요";
        });
    };
    getTodos();
    const onSubmit = (todo) => {
      error.value = "";
      axios
        .post("http://localhost:8080/todos", {
          subject: todo.subject,
          completed: todo.completed,
        })
        .then((res) => {
          todos.value.push(res.data.todos);
          getTodos();
        })
        .catch((err) => {
          console.log(err);
          error.value = "일시적으로 오류가 발생했습니다. 잠시후 이용해주세요";
        });
    };

    const deleteTodo = (index) => {
      error.value = "";
      const id = index;
      axios
        .delete("http://localhost:8080/todos/" + id)
        .then(() => {
          getTodos();
        })
        .catch((err) => {
          console.log(err);
        });
    };

    const toggleTodo = (index, checked) => {
      console.log("toggleTodo", checked, index)
      const id = index;
      axios
        // 수정
        .patch("http://localhost:8080/todos/" + id, {
          completed: checked,
        })
        .then(() => {
          // 수정
          getTodos();
          //todos.value[id].completed = checked;
          //console.log("then", todos.value[id].completed)
        })
        .catch((err) => {
          console.log(err);
        });
    };

    return {
      searchTodos,
      getTodos,
      currentPage,
      error,
      numberOfPages,
      searchText,
      onSubmit,
      todos,
      toggle,
      deleteTodo,
      toggleTodo,
    };
  },
};
</script>

<style>
.todo {
  color: gray;
  text-decoration: line-through;
}

.page-item a {
  cursor: pointer;
}
</style>
