<template>
    <main>
      <h1>Profile {{ userID }}</h1>
      <ul>
        <li v-for="instrument in filteredInstruments" :key="instrument.id">
          <h2>Instruments:</h2>
          <ul>
            <li v-for="item in instrument.instruments" :key="item">
              {{ item }}
              <button v-if="isCurrentUserProfile(instrument.userID)" @click="removeInstrument(instrument.userID, item)" class="remove-button">-</button>
            </li>
          </ul>
        </li>
      </ul>
  
      <!-- Add instruments section -->
      <div v-if="isCurrentUserProfile(userID)">
        <h2>Add Instruments:</h2>
        <input v-model="newInstrument" type="text" placeholder="Instrument name">
        <button @click="addInstrument">Add</button>
      </div>
    </main>
  </template>
  
  <script setup>
  import { collection, onSnapshot, doc, updateDoc, arrayRemove, arrayUnion } from "firebase/firestore";
  import { db } from "@/firebase/index.js";
  import { ref, watchEffect, onUnmounted } from "vue";
  import { defineProps, defineEmits } from 'vue';
  import { auth } from "@/firebase/index.js";
  
  const props = defineProps(['userID']);
  const emit = defineEmits();
  
  const instruments = ref([]);
  const filteredInstruments = ref([]);
  const currentUserID = ref('');
  const newInstrument = ref('');
  const allUsers = ref([]);
  
  // Get the current user's ID
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUserID.value = user.uid;
    } else {
      currentUserID.value = '';
    }
  });
  
  onSnapshot(collection(db, 'users'), (querySnapshot) => {  
    allUsers.value = []; 
    querySnapshot.forEach((doc) => {
      const userInstruments = doc.data().instruments || [];
      let user = {  
        "userID": doc.data().userID,
        "instruments": userInstruments
      };
      allUsers.value.push(user);  
    });
  });
  
  const isCurrentUserProfile = (profileUserID) => {
    return currentUserID.value === profileUserID;
  };
  
  const removeInstrument = async (profileUserID, instrument) => {
    // Check if the profile matches the logged-in user's profile
    const userDoc = allUsers.value.find(user => user.userID === profileUserID);
  
    if (userDoc && isCurrentUserProfile(userDoc.userID)) {
      // Remove the instrument from the array
      userDoc.instruments = userDoc.instruments.filter(item => item !== instrument);
  
      // Update the Firestore document
      const docRef = doc(db, 'users', profileUserID);
      await updateDoc(docRef, {
        instruments: arrayRemove(instrument)
      });
  
      // Emit the instrument name
      emit('instrumentRemoved', instrument);
    }
  };
  
  const addInstrument = async () => {
    if (newInstrument.value.trim() !== '') {
      // Find the current user's document in allUsers
      const currentUserDoc = allUsers.value.find(user => user.userID === currentUserID.value);
  
      if (currentUserDoc) {
        // Update the Firestore document
        const docRef = doc(db, 'users', currentUserID.value);
        await updateDoc(docRef, {
          instruments: arrayUnion(newInstrument.value)
        });
  
        // Clear the input field
        newInstrument.value = '';
      }
    }
  };
  
  watchEffect(() => {
    // Update filteredInstruments based on userID
    filteredInstruments.value = allUsers.value.filter(user => user.userID === props.userID);
  });
  
  // Unsubscribe from the snapshot listener when the component is unmounted
  onUnmounted(() => {
    // Your cleanup code, if any
  });
  </script>
  
  <style>
  main {
    max-width: 600px;
    margin: 0 auto;
  }
  
  h1 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    margin-bottom: 16px;
    position: relative; /* Added for positioning */
  }
  
  .remove-button, .add-button {
    background-color: #ff6347; /* Tomato color */
    color: #fff;
    padding: 8px 12px;
    border: none;
    cursor: pointer;
  }
  
  .remove-button:hover, .add-button:hover {
    background-color: #d2361e; /* Slightly darker shade on hover */
  }
  
  .remove-button {
    position: absolute; /* Positioned relative to the parent li */
    right: 0; /* Fixed position at the right edge of the parent li */
  }
  
  input {
    padding: 8px;
    margin-right: 8px;
  }
  
  h2 {
    font-size: 20px;
    margin-bottom: 8px;
  }
  
  /* Add some spacing between elements */
  main > * {
    margin-bottom: 16px;
  }
  </style>
  