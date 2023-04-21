<template>
  <!-- 부트스트랩 navbar : a link -> router-link -->
  <nav class="navbar navbar-light bg-light">
    <div class="container-fluid justify-content-start">
      <router-link :to="{name:'Home'}" class="navbar-brand" href="#">망고노트</router-link>
      <div class="navbar-nav">
        <router-link :to="{name:'Todos'}" class="nav-link active">망고일정</router-link>
      </div>
    </div>
  </nav>
  <router-view />
</template>

<script>
export default {

}
</script>

<style>
</style>