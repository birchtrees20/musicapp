<script setup>
import { ref, watchEffect } from "vue";
import { db } from "@/firebase/index.js";
import { collection, getDoc, getDocs, doc, setDoc } from "firebase/firestore";

const props = defineProps(["band"]);

</script>

<template>
  <div class="band-info-card">
    <div class="band-header">
      <h2 class=".band-info-name">{{ props.band.name }}</h2>
    </div>
    <div class="band-info">
      <p>
        {{ props.band.info }}
      </p>
    </div>
    <div class="band-members">
      <h3>Band Members</h3>
      <ul>
        <li v-for="member in props.band.members" :key="member.id">
          {{ member }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.band-info-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  width: 100%;
}

.band-header {
  background-color: #3498db;
  color: #fff;
  padding: 20px;
  text-align: center;
  display: flex;
  align-items: start;
}

.band-info-name {
  margin: 0;
}

.band-info {
  padding: 20px;
}

.band-members {
  padding: 20px;
}

.band-members h3 {
  margin-top: 0;
}

.band-members ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.band-members li {
  margin-bottom: 5px;
}
</style>
