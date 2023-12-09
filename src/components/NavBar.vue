<script setup>
import { RouterLink } from "vue-router";
import SearchBar from "./SearchBar.vue";
import { onBeforeMount } from 'vue';
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { auth } from '../firebase';

const store = useStore();
const userID= ref('');

onBeforeMount(() => {
  store.dispatch('fetchUser');
});



onMounted(() => {
  // Add an authentication state observer
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      userID.value = user.uid;
    } else {
      // User is signed out
      userID.value = '';
    }
  });
});

//console.log(userID)

</script>

<template>
  <div class="logo">Project name</div>
  <SearchBar class="search" />
  <div class="nav-routes">
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/members">Members</RouterLink>
    <RouterLink to="/bands">Bands</RouterLink>
    <RouterLink to="/instruments">Instruments</RouterLink>
    <RouterLink v-if="$store.state.user" :to="`/profile/${userID}`">Profile</RouterLink>
    <RouterLink v-if="$store.state.user" to="/" @click="$store.dispatch('logout')">Logout</RouterLink>
    <RouterLink v-else to="/login">Login</RouterLink>
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
