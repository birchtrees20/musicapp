<template>
  <main class="login">
    <section class="forms">
        <form class="register">
            <h2>Register</h2>
            <input type="email" placeholder="email" v-model="register_form.email">
            <input type="password" placeholder="password" v-model="register_form.password">
            <input type="submit" value="register">
        </form>
        <form class="login">

        </form>
    </section>
  </main>
</template>

<script>
import { ref } from 'vue'
//import { useStore } from 'vuex'
export default {
    setup () {
        const login_form = ref({});
        const register_form = ref({});
        const store = useStore();

        return {
            login_form,
            register_form
        }
    }
}
</script>

<style>

</style>