<script setup>
import { RouterLink } from "vue-router";
import SearchBar from "./SearchBar.vue";


</script>

<template>
  <div class="logo">Project name</div>
  <SearchBar class="search" />
  <div class="nav-routes">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/bands">Bands</RouterLink>
  </div>
</template>

<style>
.logo {
  font-size: 20px;
  font-weight: bold;
  width: 33%;
  display: flex;
  justify-content: start;
}

.search {
  display: flex;
  width: 33%;
}

.nav-routes {
  display: flex;
  width: 33%;
  justify-content: end;
}

.nav-routes a {
  text-decoration: none;
  font-size: 20px;
  font-weight: bold;
  margin-left: 15px;
}
</style>
