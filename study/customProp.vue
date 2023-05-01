<template>
    <h1>Props</h1>
    <!-- 받을때는 카멜케이스로 바꾸기 -->
    {{ textProp }}
  </template>
  
  <script>
  export default {
    props: {
      textProp: {
        type: String,
        required: true,
      }
    }
  }
  </script>
  
  <style></style>
  