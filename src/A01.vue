<template>
  <h1 class="app">App</h1>
  <button type="button" class="btn btn-primary" v-on:click="updateName">
    클릭해봐요
  </button>
  <ul class="list text-primary">
    <li>{{ greeting("이영범") }}</li>
    <li>{{ name }}</li>
    <li>{{ cats }}🐱</li>
    <li>{{ cats }}🐱</li>
    <li>{{ cats }}🐱</li>
  </ul>
  <button type="button" class="btn btn-warning" v-on:click="updateCat">
    야옹
  </button>
  <!-- html 주석 -->
</template>

<script>
import { ref, reactive } from "vue";
export default {
  //자바스크립트 주석
  setup() {
    let name = ref("김민정");
    let cats = reactive({
      name: "마리",
      age: 100,
      weight: 100,
    });
    console.log(name.value);
    const greeting = (name) => {
      return "일어나라" + name;
    };
   const updateCat=()=>{
    cats.name='나기',
    cats.age=5,
    cats.weight=5
   }
    const updateName = () => {
      name.value = "김경아";
      console.log(name);
    };
    const consoleLog = () => {
      console.log("문자열 출력");
    };
    return { name, greeting, consoleLog, updateName, cats, updateCat };
  },
};
</script>

<style>
/*css주석 */

.app {
  color: red;
}
.list {
  color: green;
  font-size: 20px;
}
</style>