<template>
  <div>
    <h1>Home</h1>
    <p>Welcome to the Home Page of Your Vue.js App!</p>

    <div>
      <h2>All Users</h2>
      <ul>
        <li v-for="user in users" :key="user.uid">{{ user.email }}</li>

      </ul>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const users = ref([]);

onMounted(async () => {
  try {
    const response = await axios.get('/api/users');
    console.log('API Response:', response.data);
    users.value = response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
  }
});
</script>

<style>
/* You can add styles specific to the home component here */
</style>
