<template>
  <main>
    <section class="forms">
      <form class="register" @submit.prevent="register">
        <h2>Register</h2>
        <input 
          type="text"
          placeholder="First Name"
          v-model="register_form.firstName">
        <input 
          type="text"
          placeholder="Last Name"
          v-model="register_form.lastName">
        <input 
          type="email" 
          placeholder="Email"
          v-model="register_form.email">
        <input 
          type="password" 
          placeholder="Password"
          v-model="register_form.password">
        <input 
          type="submit"
          value="Register">
      </form>

      <form class="login" @submit.prevent="login">
        <h2>Login</h2>
        <input 
          type="email" 
          placeholder="Email"
          v-model="login_form.email">
        <input 
          type="password" 
          placeholder="Password"
          v-model="login_form.password">
        <input 
          type="submit"
          value="Login">
      </form>
    </section>
  </main>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'

export default {
  setup () {
    const login_form = ref({});
    const register_form = ref({});
    const store = useStore();

    const login = () => {
      store.dispatch('login', login_form.value);
    }
    
    const register = () => {
      // Pass the registration data to the store action
      store.dispatch('register', {
        email: register_form.value.email,
        password: register_form.value.password,
        firstName: register_form.value.firstName,
        lastName: register_form.value.lastName,
      });
    }

    return {
      login_form,
      register_form,
      login,
      register
    }
  }
}
</script>


<style>

</style>