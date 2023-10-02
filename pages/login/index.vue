<template>
  <div>
    <b-container class="my-5">
      <b-row>
        <b-col></b-col>
        <b-col sm="12" md="6" lg="4">
          <h1>Welcome back!</h1>
          <div class="note mb-4">Login into your account</div>

          <b-form class="form" @submit.stop.prevent="onSubmit">
            <b-form-group id="input-group-1" label="E-mail" label-for="input-1">
              <b-form-input
              id="input-1"
              v-model="form.email"
              type="text"
              placeholder="Enter user e-mail"
              :state="validateState('email')"
              aria-describedby="useremail-feedback"
              />

              <b-form-invalid-feedback id="useremail-feedback">
              Enter valid email
              </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="input-group-2" label="Password" label-for="input-2">
              <b-form-input
              id="input-2"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              class="password"
              placeholder="Enter password"
              :state="validateState('password')"
              aria-describedby="password-feedback"
              />

              <b-form-invalid-feedback id="password-feedback">
              <div v-if="!passErrors.minLength">
                  Password must have at least 8 letters.
              </div>
              <div v-if="!passErrors.hasUppercase">
                  Enter at least 1 uppercase letter.
              </div>
              <div v-if="!passErrors.hasLowercase">
                  Enter at least 1 lowercase letter.
              </div>
              <div v-if="!passErrors.hasNumber">Enter at least 1 digit.</div>
              <div v-if="!passErrors.hasSpecial">
                  Enter at least 1 special mark.
              </div>
              </b-form-invalid-feedback>
            </b-form-group>

            <b-alert v-model="showInvalidUserAlert" variant="danger" dismissible>Invalid user credentials</b-alert>

            <b-button type="submit" class="btn btn-form-submit" variant="primary">Log in</b-button>
          </b-form>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import { required, email } from 'vuelidate/lib/validators';

  export default {
    mixins: [validationMixin],
    middleware: ['auth-home'],
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
        showInvalidUserAlert: false,
        showPassword: false,
        passErrors: {
          hasUppercase: true,
          hasLowercase: true,
          hasNumber: true,
          hasSpecial: true,
          minLength: true,
        },
      }
    },
    validations: {
      form: {
        email: {
          required,
          email
        },
        password: {
          required,
          minLength(value) {
            if (value.length >= 8) {
              this.passErrors.minLength = true
              return true
            } else {
              this.passErrors.minLength = false
              return false
            }
          },
        },
      },
    },
    methods: {
      validateState(name) {
        const { $dirty, $error } = this.$v.form[name]
        return $dirty ? !$error : null
      },
      onSubmit() {
        this.showInvalidUserAlert = false
        this.$v.form.$touch()

        if (this.$v.form.$anyError) {
          return
        }

        this.$store
          .dispatch('login', {
            email: this.form.email,
            password: this.form.password,
          })
          .then((result) => {
            if (result) {
              if (result.success) {
                this.$router.push('/reviews')
              } else {
                this.showInvalidUserAlert = true
              }
            } else {
              this.showInvalidUserAlert = true
            }
          })
      },
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

<style lang="scss" scoped>

</style>
