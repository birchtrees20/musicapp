<template>
  <div class="dimensions">
    <section class="layout">
      <div class="sidebar">
        <div v-for="band in bands" :key="band.id" class="band-card">
          <h2 class="band-name">{{ band.name }}</h2>
        </div>
      </div>
      <div class="body">
        <button @click="addBand">Press to add test band</button>
      </div>
    </section>
  </div>
</template>

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

async function addBand() {
  //for testing
  const bandsRef = collection(db, "bands");
  let randomName = (Math.random() + 1).toString(36).substring(7);
  await setDoc(doc(bandsRef, randomName), {
    name: randomName,
    members: ["Member A", "Member B"]
  });
  console.log("Added new band")
}

onMounted(async () => {
  console.log("Connecting to Firebase");
  await getBands();
});
</script>

<style>
.dimensions {
  margin-left: 200px;
  margin-right: 200px;
}

.layout {
  width: 1366px;
  height: 768px;

  display: grid;
  grid:
    "sidebar body" 1fr
    / auto 1fr;
  gap: 8px;
}

.sidebar {
  grid-area: sidebar;
  width: 150px;
  display: flex;
  flex-direction: column;
  background-color: antiquewhite;
  border-right-width: 4px;
  border-color: blue;
}
.body {
  grid-area: body;
}

.page {
  margin-top: 50px;
}

.bands {
  display: flex;
  flex-direction: row;
}

.band-name {
  display: flex;
  justify-content: left;
  font-size: 15px;
}

.band-name :hover {
  background-color: white;
}

.join-button {
  border-radius: 10px;
  background-color: gainsboro;
  width: 25%;
  cursor: pointer;
  text-align: center;
}

.band-card {
  padding-left: 30px;
  border-radius: 0.5rem;
  border-width: 1px;
  border-color: gray;
  background-color: wheat;
  margin-bottom: 1px;
}
</style>
