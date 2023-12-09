<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase/index.js";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const bands = ref([]);

async function getBands() {
  const querySnapshot = await getDocs(collection(db, "bands"));
  querySnapshot.forEach((doc) => {
    const band = {
      id: doc.id,
      name: doc.data().name,
      members: doc.data().members,
    };
    bands.value.push(band);
  });
}

onMounted(async () => {
  console.log("Connecting to Firebase");
  await getBands();
});
</script>

<template>
  <div class="sidebar">
    <div class="side-title">Bands</div>
    <div v-for="band in bands" :key="band.id" class="band-card">
      <h2 class="band-name">{{ band.name }}</h2>
    </div>
  </div>
</template>

<style>
.side-title {
  background-color:white;
  font-size: 20px;
  font-family:Arial, Helvetica, sans-serif;
  padding-left: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
}

.sidebar {
  grid-area: sidebar;
  height: 100vh;
  width: 150px;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-top-width: 0;
  border-bottom-width: 0;
  border-left-width: 0;
  border-style: solid;
  border-color:gray;
}

.band-name {
  display: flex;
  padding-left: 20px;
  font-size: 15px;
}

.band-card {
  border-radius: 0.5rem;
  border-width: 1px;
  border-color: gray;
  background-color: wheat;
  margin-bottom: 1px;
}
</style>
