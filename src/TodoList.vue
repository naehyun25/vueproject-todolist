<template>
  <h3>TodoList</h3>
  <div class="card mb-2" v-for="todo in todos" :key="todo.id">
    <div class="card-body p-2 d-flex">
      <div class="form-check flex-grow-1">
        <label class="form-check-label" :class="{ todo: todo.complated }">
          <input
            type="checkbox"
            class="form-check-input"
            v-model="todo.complated"
          />
          {{ todo.subject }}
        </label>
      </div>
      <div>
        <button class="btn btn-danger btn-sm" @click="deleteTodo(todo)">
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    todos:{
    type: Array,
    required: true,
    }
},
  // setup(){

  //     return{

  //     }
  // }
};
</script>
<style>
</style>