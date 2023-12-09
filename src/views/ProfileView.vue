<template>
    <main>
      <h1>Profile {{ userID }}</h1>
      <ul>
        <li v-for="instrument in filteredInstruments" :key="instrument.id">
          <h2>Instruments:</h2>
          <ul>
            <li v-for="item in instrument.instruments" :key="item">
              {{ item }}
              <button v-if="isCurrentUserProfile(instrument.userID)" @click="removeInstrument(instrument.id, item)">-</button>
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
  
  // Get the current user's ID
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUserID.value = user.uid;
    } else {
      currentUserID.value = '';
    }
  });
  
  onSnapshot(collection(db, 'instruments'), (querySnapshot) => {
    instruments.value = [];
    querySnapshot.forEach((doc) => {
      let instrument = {
        "id": doc.id, // Document ID
        "userID": doc.data().userID,
        "instruments": doc.data().instruments
      }
      instruments.value.push(instrument);
    });
  });
  
  const isCurrentUserProfile = (profileUserID) => {
    return currentUserID.value === profileUserID;
  };
  
  const removeInstrument = async (docID, instrument) => {
    // Check if the profile matches the logged-in user's profile
    const instrumentDoc = instruments.value.find(item => item.id === docID);
  
    if (instrumentDoc && isCurrentUserProfile(instrumentDoc.userID)) {
      // Remove the instrument from the array
      instrumentDoc.instruments = instrumentDoc.instruments.filter(item => item !== instrument);
  
      // Update the Firestore document
      const docRef = doc(db, 'instruments', docID);
      await updateDoc(docRef, {
        instruments: arrayRemove(instrument)
      });
  
      // Emit the instrument name
      emit('instrumentRemoved', instrument);
    }
  };
  
  const addInstrument = async () => {
    if (newInstrument.value.trim() !== '') {
      // Find the document ID for the current user's instruments
      const userInstrumentDoc = instruments.value.find(item => item.userID === currentUserID.value);
  
      if (userInstrumentDoc) {
        // Update the Firestore document
        const docRef = doc(db, 'instruments', userInstrumentDoc.id);
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
    filteredInstruments.value = instruments.value.filter(item => item.userID === props.userID);
  });
  
  // Unsubscribe from the snapshot listener when the component is unmounted
  onUnmounted(() => {
    // Your cleanup code, if any
  });
  
  </script>
  
  <style>
  </style>
  