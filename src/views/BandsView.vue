<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase/index.js";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import SideBar from "@/components/SideBar.vue";

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
    members: ["Member A", "Member B"],
  });
  console.log("Added new band");
}

onMounted(async () => {
  console.log("Connecting to Firebase");
  await getBands();
});
</script>

<template>
  <div class="dimensions">
    <div class="layout">
      <SideBar />
      <div class="body">
        <div>
          All the bands. . 
          <br>
          Dunno what to put here ?
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.dimensions {
  margin-left: 200px;
  margin-right: 200px;
  overflow: hidden;
}

.layout {
  display: flex;
  flex-direction: row;
}

.body {
  padding-left: 20px;
}

.join-button {
  border-radius: 10px;
  background-color: gainsboro;
  width: 25%;
  cursor: pointer;
  text-align: center;
}
</style>
