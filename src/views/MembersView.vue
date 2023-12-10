<template>
  <div>
    <h1>All Members</h1>

    <!-- Sorting Options -->
    <div>
      <label for="nameSort">Name:</label>
      <select id="nameSort" v-model="nameSort" @change="sortUsers">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <!-- Filtering Options -->
    <div>
      <label for="instrumentFilter">Instrument:</label>
      <select id="instrumentFilter" v-model="instrumentFilter" @change="filterUsers">
        <option value="">All Instruments</option>
        <option v-for="instrument in allInstruments" :key="instrument" :value="instrument">
          {{ instrument }}
        </option>
      </select>
    </div>

    <!-- Member Tiles -->
    <div class="member-tiles">
      <router-link
        v-for="user in filteredUsers"
        :key="user.userID"
        :to="{ name: 'profile', params: { userID: user.userID } }"
        class="member-tile"
      >
        <h2>{{ user.firstName + " " + user.lastName }}</h2>
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
import { emailToName } from '@/helpers/scripts.js';

const allUsers = ref([]);
const allInstruments = ref([]);
const filteredUsers = ref([]);

const nameSort = ref('asc'); // Default sorting order for Name
const instrumentFilter = ref('');

// Fetch users and instruments
onSnapshot(collection(db, 'users'), (querySnapshot) => {
  allUsers.value = [];
  allInstruments.value = [];

  querySnapshot.forEach((doc) => {
    const userInstruments = doc.data().instruments || [];
    const user = {
      userID: doc.data().userID,
      email: doc.data().email,
      firstName: doc.data().firstName,
      lastName: doc.data().lastName,
      instruments: userInstruments,
    };
    allUsers.value.push(user);

    // Collect all unique instruments for filtering
    allInstruments.value = [...new Set([...allInstruments.value, ...userInstruments])];
  });

  // Initial sorting and filtering
  sortUsers();
  filterUsers();
});

const sortUsers = () => {
  const compareFunction = (a, b) => {
    const nameA = a.firstName + a.lastName;
    const nameB = b.firstName + b.lastName;

    return nameSort.value === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  };

  allUsers.value.sort(compareFunction);

  // Trigger filtering after sorting
  filterUsers();
};

const filterUsers = () => {
  if (!instrumentFilter.value) {
    // No filter selected, display all users
    filteredUsers.value = [...allUsers.value];
  } else {
    // Filter users based on the selected instrument
    filteredUsers.value = allUsers.value.filter((user) => user.instruments.includes(instrumentFilter.value));
  }
};
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
</style>
