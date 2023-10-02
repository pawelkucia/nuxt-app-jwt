<template>
  <b-container fluid class="my-3">
    <b-navbar toggleable="sm" type="light" variant="light">
      <b-navbar-toggle target="nav-text-collapse"></b-navbar-toggle>

      <b-navbar-brand>
      <nuxt-link to="/" tag="a">
        <img src="https://www.frogriot.com/wp-content/themes/semplice-child/img/logo-frog.svg" height="30" alt="" loading="lazy">
      </nuxt-link>
      </b-navbar-brand>

      <b-collapse id="nav-text-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/">Home</b-nav-item>
        <b-nav-item to="/reviews">Reviews</b-nav-item>
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item v-if="!isAuthenticated" to="/login">Log in</b-nav-item>
        <b-nav-item v-if="!isAuthenticated" to="/signup">Sign up</b-nav-item>
        <b-nav-item-dropdown v-if="isAuthenticated" :text="user.email" right>
        <b-dropdown-item href="#" @click="logout">Log out</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </b-container>
</template>

<script>
  export default {
    components: {
    },
    data() {
        return {

        }
    },
    methods: {
    logout() {
      this.$store.dispatch('logout').then((result) => {
          if (result) {
            if (result.success) {
              this.$router.push('/login')
            }
          }
        });
      }
    },
    computed: {
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      user() {
        return this.$store.getters.user
      }
    }
  }
</script>
