<script setup>
import { ref, reactive, onBeforeMount, onMounted, watchEffect } from "vue";
import { db } from "@/firebase/index.js";
import router from "@/router/index.js";
import {
  collection,
  getDoc,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import SideBar from "@/components/SideBar.vue";
import BandInfo from "@/components/BandInfo.vue";
import { useRoute } from "vue-router";
import { auth } from "@/firebase/index.js";

const currentUserAuthID = ref("");
const user = reactive({});
const name = ref("");
const authenticated = ref(false);

const bandName = ref();
const bandInfo = ref();
const bandMembers = ref([]);

const band = reactive({
  name: String,
  info: String,
  members: [],
});

const route = useRoute();
const searchQuery = ref(route.query.search);
const selected = ref("created");

auth.onAuthStateChanged((user) => {
  if (user) {
    currentUserAuthID.value = user.uid;
    getUser();
  } else {
    currentUserAuthID.value = "";
  }
});

async function getUser() {
  const docRef = doc(db, "users", currentUserAuthID.value);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    user.value = docSnap.data();
    name.value = user.value.firstName;
    authenticated.value = true;
  } else {
    // docSnap.data() will be undefined in this case
    console.log("No such document!");
  }
}

async function loginRedirect() {
  router.push("/login");
}

async function buttonClicked(newValue) {
  if (newValue !== "created") {
    await getBand(newValue);
  } else {
    selected.value = newValue;
  }
}

async function joinBand(id) {
  console.log("joining new band");

  const bandRef = doc(db, "bands", id);
  const bandSnapshot = await getDoc(bandRef);
  const currentMembers = bandSnapshot.data().members;

  if (!currentMembers.some((member) => member.userID === user.value.userID)) {
    await updateDoc(bandRef, {
      members: arrayUnion(user.value),
    });
  } else {
    console.log("User already in band");
  }

  const userRef = doc(db, "users", currentUserAuthID.value);

  await updateDoc(userRef, {
    bands: arrayUnion(id),
  });
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
  bandMembers.value.push(user.value);
  await setDoc(doc(bandsRef, bandName.value), {
    name: bandName.value,
    members: bandMembers.value,
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
      <div class="landing" v-if="!authenticated && selected === 'created'">
        <div class="col">
          <h1 class="hello">Hello!</h1>
          <div>
            <font-awesome-icon class="create-icon" :icon="['fas', 'hammer']" />
            Create a new band or join one!
          </div>
          <button @click="loginRedirect" class="cta-button">
            Login to start
          </button>
        </div>
      </div>
      <div v-else-if="authenticated && selected === 'created'" class="dis">
        <div class="create-band">
          <h1 class="hello">Hello {{ name }}</h1>
          <div class="extra-text">
            <font-awesome-icon class="create-icon" :icon="['fas', 'hammer']" />
            Create a new band or join one!
          </div>
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
      <div v-else class="dis">
        <BandInfo
          @joinBand="joinBand"
          :key="band.id"
          :band="band"
          :authenticated="authenticated"
        />
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
  display: flex;
  width: 70%;
}

.hello {
  font-size: 40px;
}

.extra-text {
  font-size: x-large;
  margin-bottom: 15px;
}

.cta-button {
  margin-top: 30px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  background-color: var(--primary);
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.cta-button:hover {
  background-color: #d89868;
}

.dis {
  display: flex;
  width: 100%;
  justify-content: center;
  padding-left: 20px;
  padding-right: 20px;
}

.landing {
  width: 100%;
  font-size: x-large;
  display: flex;
  justify-content: center;
}

.col {
  display: flex;
  flex-direction: column;
}

.create-band {
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: start;
}

form {
  width: 100%;
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
  background-color: var(--secondary);
  border-radius: 6px;
  color: white;
}

.reset-button:hover {
  background-color: burlywood;
}

.create-button {
  border-radius: 5px;
  border-width: 1px;
  cursor: pointer;
  margin-left: 5px;
  width: 20%;
  height: 40px;
  border: 0;
  background-color: var(--primary);
  border-radius: 6px;
  color: white;
}

.create-button:hover {
  background-color: var(--accent);
}

.emptybar {
  height: 100vh;
  width: 15%;
  display: flex;
}
</style>
