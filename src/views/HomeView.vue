<template>
    <SideBar @show="buttonClicked" />
    <div class="body">
      <h1>Home {{ userEmail }}</h1>
    </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { auth } from "../firebase";
import SideBar from "@/components/SideBar.vue";

const userEmail = ref("");

onMounted(() => {
  // Add an authentication state observer
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      userEmail.value = user.email;
    } else {
      // User is signed out
      userEmail.value = "";
    }
  });
});
</script>