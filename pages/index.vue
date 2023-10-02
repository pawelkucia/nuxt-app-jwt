<template>
  <div>
    <b-container class="my-5">
      <b-row class="text-center">
        <b-col>
          <h1 data-aos="fade-up" data-aos-easing="ease-out">Hello!</h1>
          <h2 data-aos="fade-up" data-aos-delay="50" data-aos-easing="ease-out">Welcome to PressPug.</h2>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="my-5" data-aos="fade-up" data-aos-delay="200">
      <b-row class="text-center">
        <b-col>
          <b-button variant="primary" v-if="isAuthenticated" to="/reviews">Open reviews section</b-button>
          <b-button variant="dark" v-if="!isAuthenticated" to="/login">Log in</b-button>
          <b-button variant="primary" v-if="!isAuthenticated" to="/signup">Sign up</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'IndexPage',
    middleware: [],
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
