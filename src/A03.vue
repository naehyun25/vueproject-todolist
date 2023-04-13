<template>
  <div>
    <h1 :class="red">{{ name }}</h1>
  </div>
  <!-- <input type="text" :value="name" @:input="updateName"/> -->
  <!-- v-model 양방향바인딩을 쉽게 해줌  -->
  <input type="text" v-model="name"/> 
  <button class="btn btn-primary" @:click="onSubmit">버튼</button>
</template>

<script>
//원시타입 임포트
import { ref } from "vue";
export default {
  setup() {
    let red = ref("red");
    const name = ref("김망고");
    const onSubmit =() => {
      console.log(name.value);
    }
    const updateName =(e) => {
      console.log(e.target.value)
      
    }
    return { name, onSubmit, red, updateName };
  },
};
</script>

<style>
.red {
  background-color: red;
}
.green {
  background-color: green;
}
</style>