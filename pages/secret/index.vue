<template>
  <div>
    <b-container class="my-5">
      <b-row class="text-center">
        <b-col>
          <h1 data-aos="fade-up" data-aos-easing="ease-out">Secret!</h1>
          <h2 data-aos="fade-up" data-aos-delay="50" data-aos-easing="ease-out">....</h2>
        </b-col>
      </b-row>
    </b-container>
    <b-container class="my-5" data-aos="fade-up" data-aos-delay="200">
      <b-row class="text-center">
        <b-col>
          <h3 v-if="user.userType == 'publisher'">This content is available for publishers only :)</h3>
          <h3 v-if="user.userType == 'reviewer'">This content is available for reviewers only :)</h3>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'SecretPage',
  middleware: ['auth'],
  methods: {
  },
  computed: {
    user() {
      return this.$store.getters.user
    }
  }
}
</script>
