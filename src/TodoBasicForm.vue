<template>
    <form action="#" class="d-flex" @:submit.prevent="onSubmit">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="일정 추가하기" v-model="todo">
      <button class="btn btn-primary" type="submit">추가</button>
      </div>
      <div v-if="errMsg" class ="alert alert-danger">할일을 입력해주세요</div>
    </form>
</template>

<script>
import { ref } from "vue";
export default {
  //emit -> 애미에게 전달 
  setup(props,{emit}) {
    const todo = ref("");
    const errMsg = ref(false);

    const onSubmit = () => {
      if(todo.value===""){
        errMsg.value=true;

      }else{
        //emit('이벤트명',{전달할데이터})
        emit("add-todo",{
            id:Date.now(),
            subject:todo.value,
            complated:false,
        })
        // todos.value.push({
        //   id:Date.now(),
        //   subject:todo.value,
        //   complated:false,
        //   });
           errMsg.value=false;
           todo.value="";
      }
    };
    return{
        todo,
        onSubmit,
        errMsg,

    };
  },
};
</script>

<style>

</style>