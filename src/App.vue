<template>
  <div class="container">
    <h1>오늘의 할일 (좀 하자 ...)</h1>

    <form action="#" class="d-flex" @:submit.prevent="onSubmit">
    <!-- <form action="#" class="d-flex" @:click="onSubmit"> -->
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="일정 추가하기" v-model="todo">
      <!-- <button class="btn btn-primary" @:click="onSubmit">추가</button> -->
      <button class="btn btn-primary" type="submit">추가</button>
      <!-- submit.prevent // type="submit" ==e.preventdefault -->
      </div>
    </form>
    <div class="card">
      <div class="card-body p-2">
        {{todos[0].subject}}
      </div>
    </div>
    <!-- <div class="card">
      <div class="card-body p-2">
        <span v-for="todo in todos" :key="todo.id">{{todo.subject}}</span>
      </div>
    </div> -->
    <div class="card" v-for="todo in todos" :key="todo.id">
      <div class="card-body p-2">
        <span >{{todo.subject}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
//ref로 (감싸야 vue스크립트와 인스턴트간 통신가능 )는 원시값 / reactive는 배열,객체값
  const todo = ref("");
  let todos = ref([
        {
          id:"1",
          subject:"리액트복습",
        },
        {
          id:"2",
          subject:"냥빨",
        }
  ]);  
    const onSubmit = () => {
      console.log(todo.value);
      //전개연산자로 써도되고
      //[...todos]
      //(하는중)todos.value = [...todos, { id: "1", subject: todo.value }];
      //push 라는 함수 사용해도됨 (배열뒤에 값을 추가함)
      todos.value.push({
        id:Date.now,
        subject:todo.value,
        }
      )
    };

    return {
      todo,
      onSubmit,
      todos,
    };
  },
};
</script>

<style>
.red {
  color: red;
}
</style>