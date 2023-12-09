<template>
    <div>
      <h1>All Members</h1>
      <div class="member-tiles">
        <router-link v-for="user in allUsers" :key="user.userID" :to="{ name: 'profile', params: { userID: user.userID } }" class="member-tile">
          <h2>{{ emailToName(user.email) }}</h2>
          <ul>
            <li v-for="instrument in user.instruments" :key="instrument">{{ instrument }}</li>
          </ul>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onUnmounted } from 'vue';
  import { onSnapshot, collection } from 'firebase/firestore';
  import { db } from '@/firebase/index.js';
  import { emailToName } from '@/helpers/emailFormat';
  
  const allUsers = ref([]);
  onSnapshot(collection(db, 'users'), (querySnapshot) => {
    allUsers.value = [];
    querySnapshot.forEach((doc) => {
      const userInstruments = doc.data().instruments || [];
      let user = {
        "userID": doc.data().userID,
        "email": doc.data().email,
        "firstName": doc.data().firstName,
        "lastName": doc.data().lastName,
        "instruments": userInstruments
      };
      allUsers.value.push(user);
    });
  });
  
  onUnmounted(() => {
    // Your cleanup code, if any
  });
  </script>
  
  <style scoped>
  .member-tiles {
    display: flex;
    flex-wrap: wrap;
  }
  
  .member-tile {
    border: 1px solid #ddd;
    padding: 16px;
    margin: 8px;
    width: 200px;
    cursor: pointer; /* Add this line to show the tiles are clickable */
  }
  
  /* Add any additional styling for member tiles here */
  </style>
  