<template>
  <div class="container">
    <h1>오늘의 할일 (좀 하자 ...)</h1>
      <form action="#" class="d-flex" @:submit.prevent="onSubmit">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="일정 추가하기" v-model="todo">
      <button class="btn btn-primary" type="submit">추가</button>
      </div>
      <div v-if="errMsg" class ="alert alert-danger">할일을 입력해주세요</div>
    </form>
    <div v-if="!todos.length">등록된 일정이 없습니다.</div>
    <div class="card mb-2" v-for="todo in todos" :key="todo.id">
      <div class="card-body p-2 d-flex">
          <div class="form-check flex-grow-1">
            <!-- 1. 클래스바인딩 하는 방법<label class="form-check-label" :class={todo:todo.complated}> -->
              <!-- 2. 데이터로바인딩 (대상은 스타일) 하는방법 -->
              <!-- <label class="form-check-label" :style="todo.complated? true:false"> -->
              <label class="form-check-label" :style="todo.complated? todoStyle:{}">
              <!-- :class = vue 인스턴스와 클래스 바인딩을 하려면 todoStyle의 값을 setup 함수에 넣어야합니다. -->
              <!-- 체크박스에는 체크 되면 true. 아니면 false 값을 반환하는데 그걸 v-model로 바인딩해서 todo.complated 한테 true, false 값을 전달한다.
              input태그의 기능이다. 똑똑하네 -->
              <input type="checkbox" class="form-check-input" v-model="todo.complated">
                {{todo.subject}}
            </label>
          </div>
          <div><button class="btn btn-danger btn-sm" @click="deleteTodo(todo)">삭제</button></div>
        </div>
    </div>
    <!-- 
      <div class="card" v-for="todo in todos" :key="todo.id">
      <div class="card-body p-2">
        <span >{{todo.subject}}</span>
      </div>
    </div>-->
  </div> 
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const todo = ref("");
    const errMsg = ref(false);
    let todos = ref([]);

    const onSubmit = () => {
      if(todo.value===""){
        errMsg.value=true;

      }else{  
         todos.value.push({
           id:Date.now(),
           subject:todo.value,
           complated:false,
           });
          errMsg.value=false;
          todo.value="";
      }};

    const todoStyle={
        color:"gray",
        textDecoration : "line-through",
    }
    const deleteTodo=(data) => {
        todos.value.splice(data,1)
    }
    return {
      todos,
      todoStyle,
      deleteTodo,
      todo,
        onSubmit,
        errMsg,
    };
  },
};
</script>

<style>
.red {
  color: red;
}
.todo{
  color:gray;
  text-decoration: line-through;
}
</style>

