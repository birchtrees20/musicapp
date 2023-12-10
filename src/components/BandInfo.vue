<script setup>
const props = defineProps(["band"]);

</script>

<template>
  <div class="band-info-card">
    <div class="band-header">
      <h2 class="band-info-name">{{ props.band.name }}</h2>
      <div class="join-button">Join</div>
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
  justify-content: space-between;
}

.band-info-name {
  margin: 0;
}

.join-button {
  margin: 0;
  font-size: large;
  cursor: pointer;
  height: 25px;
  width: 8%;
  border: 2px;
  border-style: solid;
  border-color: ghostwhite;
  border-radius: 6px;
  border-width: 2px;
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
