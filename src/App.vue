<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { onBeforeMount } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

onBeforeMount(() => {
  store.dispatch('fetchUser');
});

const user = store.state.user;

</script>

<template>
  <header>
    <div class="wrapper">

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <button v-if="$store.state.user" @click="$store.dispatch('logout')">Logout</button>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
</style>
