<script setup>
import { RouterLink, RouterView } from "vue-router";
import SearchBar from "./components/SearchBar.vue";
</script>

<template>
  <header>
    <nav>
      <div class="logo">
        Project name
      </div>
      <SearchBar class="search" />
      <div class="nav-routes">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/bands">Bands</RouterLink>
      </div>
    </nav>
  </header>
  <RouterView />
</template>

<style scoped>
nav {
  font-size: 12px;
  justify-content: space-between;
  padding-top: 5px;
  padding-bottom: 10px;
  padding-right: 15px;
  padding-left: 15px;
  display: flex;
  align-items: center;
  border-top-width: 0;
  border-right-width: 0;
  border-left-width: 0;
  border-style: solid;
  border-color:gray;
}
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
