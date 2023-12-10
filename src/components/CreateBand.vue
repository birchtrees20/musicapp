<template>
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
        <button class="reset-button" type="reset" value="Reset">Reset</button>
        <button class="create-button" type="submit">Create</button>
      </div>
    </form>
  </div>
</template>
