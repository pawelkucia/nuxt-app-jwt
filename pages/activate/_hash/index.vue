<template>
  <div>
    <b-container class="my-5">
      <b-row class="text-center">
        <b-col>
          <h1 data-aos="fade-up" data-aos-easing="ease-out">Hello!</h1>
          <h2 data-aos="fade-up" data-aos-delay="50" data-aos-easing="ease-out">Welcome to PressPug.</h2>
          <h3 data-aos="fade-up" data-aos-delay="100" data-aos-easing="ease-out">Your account has been activated. You can log in now :)</h3>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="my-5" data-aos="fade-up" data-aos-delay="200">
      <b-row class="text-center">
        <b-col>
          <b-button variant="danger" v-if="!isAuthenticated" to="/login">Log in</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'ActivationPage',
    middleware: [],
    data() {
      return {

      }
    },
    async asyncData({ store, params, redirect }) {
      const activationHash = params.hash;

        let user = await store.dispatch('activate', { activationHash })
        .catch((e) => {
          return redirect('/');
        });

        if (!user) {
          return redirect('/');
        }

      return { };
    },
    methods: {
    },
    computed: {
      user() {
        return this.$store.getters.user
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
