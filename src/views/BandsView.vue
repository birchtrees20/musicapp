<script setup>
import { ref, reactive, onBeforeMount, watchEffect } from "vue";
import { db } from "@/firebase/index.js";
import { collection, getDoc, getDocs, doc, setDoc } from "firebase/firestore";
import SideBar from "@/components/SideBar.vue";
import BandInfo from "@/components/BandInfo.vue";
import { useRoute } from "vue-router";

const bandName = ref();
const bandInfo = ref();
const band = reactive({
  name: String,
  members: [],
});

const route = useRoute();
const searchQuery = ref(route.query.search);

const selected = ref("created");

async function buttonClicked(newValue) {
  if (newValue !== "created") {
    await getBand(newValue);
  } else {
    selected.value = newValue;
  }
}

async function getBand(id) {
  const docRef = doc(db, "bands", id);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    band.name = docSnap.data().name;
    band.info = docSnap.data().info;
    band.members = docSnap.data().members;
    selected.value = id;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

async function createBand() {
  const bandsRef = collection(db, "bands");
  await setDoc(doc(bandsRef, bandName.value), {
    name: bandName.value,
    members: ["Member A", "Member B"],
    info: bandInfo.value,
  });
  console.log("Added new band");
}

watchEffect(() => {
  const newSearchQuery = route.query.search;
  if (newSearchQuery !== searchQuery.value) {
    searchQuery.value = newSearchQuery;
    getBand(newSearchQuery);
  }
});

onBeforeMount(() => {
  if (searchQuery.value) {
    selected.value = searchQuery.value;
    getBand(selected.value);
  }
});
</script>

<template>
  <div class="layout">
    <SideBar @show="buttonClicked" />
    <div class="body">
      <div v-if="selected === 'created'" class="create">
        <div class="create-card">
          <h2 class="card-title">
            <font-awesome-icon class="create-icon" :icon="['fas', 'hammer']" />
            Create a New Band
          </h2>
          <form @submit.prevent="createBand">
            <div class="input-container">
              <label for="bandName">Band Name:</label>
              <input v-model="bandName" type="text" class="input" required />
            </div>
            <div class="input-container">
              <label for="bandInfo">Band Information:</label>
              <textarea v-model="bandInfo" class="input" rows="4"></textarea>
            </div>

            <div class="form-buttons">
              <button class="reset-button" type="reset" value="Reset">
                Reset
              </button>
              <button class="create-button" type="submit">Create</button>
            </div>
          </form>
        </div>
      </div>
      <div v-else class="create">
        <BandInfo :key="band.id" :band="band" />
      </div>
    </div>
    <div class="emptybar"></div>
  </div>
</template>

<style>
.layout {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.body {
  padding-left: 20px;
  display: flex;
  width: 70%;
}

.create {
  display: flex;
  width: 100%;
  justify-content: center;
}

.card-title {
  display: flex;
  align-self: start;
}

form {
  width: 100%;
}

.input-container {
  display: flex;
  flex-direction: column;
  padding-bottom: 14px;
}

.create-card {
  height: 40%;
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 50px 40px 20px 40px;
  box-shadow: 0px 106px 42px rgba(0, 0, 0, 0.01),
    0px 59px 36px rgba(0, 0, 0, 0.05), 0px 26px 26px rgba(0, 0, 0, 0.09),
    0px 7px 15px rgba(0, 0, 0, 0.1), 0px 0px 0px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  padding-bottom: 100px;
}

.create-icon {
  padding-right: 15px;
}

.input {
  height: 40px;
  border-radius: 7px;
  outline: none;
  border: 1px solid #e5e5e5;
  filter: drop-shadow(0px 1px 0px #efefef)
    drop-shadow(0px 1px 0.5px rgba(239, 239, 239, 0.5));
  transition: all 0.3s cubic-bezier(0.15, 0.83, 0.66, 1);
}

.input:focus {
  border: 1px solid transparent;
  box-shadow: 0px 0px 0px 2px #242424;
  background-color: transparent;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.form-buttons {
  display: flex;
  justify-content: end;
}

.reset-button {
  border-radius: 5px;
  border-width: 1px;
  cursor: pointer;
  width: 20%;
  height: 40px;
  border: 0;
  background-color: red;
  border-radius: 6px;
  color: #ffffff;
}

.create-button {
  border-radius: 5px;
  border-width: 1px;
  cursor: pointer;
  margin-left: 5px;
  width: 20%;
  height: 40px;
  border: 0;
  background-color: blue;
  border-radius: 6px;
  color: #ffffff;
}

.emptybar {
  height: 100vh;
  width: 15%;
  display: flex;
}
</style>
