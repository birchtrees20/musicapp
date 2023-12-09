<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase/index.js";
import { collection, getDoc, doc, setDoc } from "firebase/firestore";

const search = ref();
const band = ref();

async function getBand() {
  const bandRef = doc(db, "bands", search.value);
  const docSnap = await getDoc(bandRef);

  if (docSnap.exists()) {
    band.value = docSnap.data();
    console.log("Document data:", docSnap.data());
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }

  // memberRef = doc(db, "members", search.value);
  // docSnap = await getDoc(memberRef);
  
  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } else {
  //   // docSnap.data() will be undefined in this case
  //   console.log("No such document!");
  // }

  search.value = "";
}

</script>

<template>
  <input
    v-model="search"
    @keyup.enter="getBand"
    class="search-bar"
    placeholder="Search for members or bands"
  />
</template>

<style>
.search-bar {
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 5px;
  border-width: 1px;
  border-color: #d1d5db;
  width: 100%;
  height: 40px;
  font-size: 14px;
  color: #111827;
  background-color: #f9fafb;
}
</style>
