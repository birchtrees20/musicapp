<template>
  <div>
    <h1>All Members</h1>

    <div>
      <label for="nameSort">Name:</label>
      <select id="nameSort" v-model="nameSort" @change="sortUsers">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <div>
      <label for="instrumentFilter">Instrument:</label>
      <select id="instrumentFilter" v-model="instrumentFilter" @change="filterUsers">
        <option value="">All Instruments</option>
        <option v-for="instrument in sortedInstruments" :key="instrument" :value="instrument">
          {{ instrument }}
        </option>
      </select>
    </div>

    <div class="member-tiles">
      <router-link
        v-for="user in displayedUsers"
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

const allUsers = ref([]);
const displayedUsers = ref([]);
const allInstruments = ref([]);
const sortedInstruments = ref([]);
let nameSort = ref('asc'); // Default sorting is ascending
let instrumentFilter = ref('');

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

    //collect all unique instruments for filtering
    allInstruments.value = [...new Set([...allInstruments.value, ...userInstruments])];
  });

  //sort instruments lexicographically by ascending order
  sortedInstruments.value = allInstruments.value.sort();

  //initial sorting and filtering
  sortUsers();
  filterUsers();
});

const sortUsers = () => {
  displayedUsers.value = [...allUsers.value];

  //sort members based on name
  displayedUsers.value.sort((a, b) => {
    const nameA = a.firstName + ' ' + a.lastName;
    const nameB = b.firstName + ' ' + b.lastName;

    if (nameSort.value === 'asc') {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });
};

const filterUsers = () => {
  if (instrumentFilter.value) {
    displayedUsers.value = allUsers.value.filter((user) =>
      user.instruments.includes(instrumentFilter.value)
    );
  } else {
    displayedUsers.value = [...allUsers.value];
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
  cursor: pointer;
}
</style>
