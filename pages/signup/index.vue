<template>
  <div>
    <b-container class="my-5">
      <b-row v-if="!isAccountAdded">
        <b-col></b-col>
        <b-col sm="12" md="6" lg="4">
          <h1>Hello stranger!</h1>
          <div class="note mb-4">Create your account</div>

          <b-form class="form" @submit.stop.prevent="onSubmit">
            <b-form-group label="Who are you?">
              <b-form-radio-group
                v-model="form.userType"
                :options="userTypeOptions"
                aria-describedby="user-type"
                name="userType"
                size="lg"
              ></b-form-radio-group>
            </b-form-group>

            <b-form-group id="input-group-5" label="First name" label-for="input-5">
                <b-form-input
                id="input-5"
                v-model="form.firstName"
                type="text"
                placeholder="Enter your first name"
                :state="validateState('firstName')"
                aria-describedby="first-name-feedback"
                />

                <b-form-invalid-feedback id="first-name-feedback">
                Required
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="input-group-6" label="Last name" label-for="input-6">
                <b-form-input
                id="input-6"
                v-model="form.lastName"
                type="text"
                placeholder="Enter your last name"
                :state="validateState('lastName')"
                aria-describedby="last-name-feedback"
                />

                <b-form-invalid-feedback id="last-name-feedback">
                Required
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group v-if="isPublisher" id="input-group-7" label="Company name" label-for="input-7">
                <b-form-input
                id="input-7"
                v-model="form.companyName"
                type="text"
                placeholder="Enter company name"
                :state="validateState('companyName')"
                aria-describedby="company-name-feedback"
                />

                <b-form-invalid-feedback id="company-name-feedback">
                Required
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group v-if="!isPublisher" id="input-group-8" label="Channel name" label-for="input-8">
                <b-form-input
                id="input-8"
                v-model="form.channelName"
                type="text"
                placeholder="Enter your channel name"
                :state="validateState('channelName')"
                aria-describedby="channel-name-feedback"
                />

                <b-form-invalid-feedback id="channel-name-feedback">
                Required
                </b-form-invalid-feedback>
            </b-form-group>

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

            <b-form-group id="input-group-3" label="Password repeat" label-for="input-3">
                <b-form-input
                id="input-3"
                v-model="form.passwordRepeat"
                :type="showPassword ? 'text' : 'password'"
                class="password"
                placeholder="Repeat password"
                :state="validateState('passwordRepeat')"
                aria-describedby="passwordRepeat-feedback"
                />

                <b-form-invalid-feedback id="passwordRepeat-feedback">
                <div v-if="!passErrors.passwordMatch">
                    Passwords must match.
                </div>
                <div v-if="!passErrors.minLengthRepeat">
                    Password must have at least 8 letters.
                </div>
                </b-form-invalid-feedback>
            </b-form-group>

            <b-button type="submit" class="btn btn-form-submit" variant="primary">Sign up</b-button>
          </b-form>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row v-if="isAccountAdded">
        <b-col></b-col>
        <b-col sm="12" md="6" lg="4">
          <b-alert show variant="success">
            <h4 class="alert-heading">Well done!</h4>
            <p>
              Your account is almost ready! Check your email for the account activation link.
            </p>
          </b-alert>
        </b-col>
        <b-col></b-col>
      </b-row>
      <b-row v-if="isSignupError">
        <b-col></b-col>
        <b-col sm="12" md="6" lg="4">
          <b-alert show variant="danger" class="mt-3">
            <h4 class="alert-heading">Something went wrong!</h4>
            <p>
              Your account was not created. Please, try again.
            </p>
          </b-alert>
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
          firstName: '',
          lastName: '',
          companyName: '',
          channelName: '',
          userType: 'publisher',
          email: '',
          password: '',
          passwordRepeat: '',
        },
        showValidUserAlert: false,
        showInvalidUserAlert: false,
        showPassword: false,
        passErrors: {
            hasUppercase: true,
            hasLowercase: true,
            hasNumber: true,
            hasSpecial: true,
            minLength: true,
            passwordMatch: true,
            minLengthRepeat: true,
        },
        userTypeOptions: [
          { text: 'Publisher', value: 'publisher'},
          { text: 'Reviewer', value: 'reviewer'},
        ]
      }
    },
    validations: {
      form: {
        firstName: {
          required,
        },
        lastName: {
          required,
        },
        companyName: {
          isRequired(value) {
            if (value == '' && this.form.userType == 'publisher') {
              return false;
            } else {
              return true;
            }
          },
        },
        channelName: {
          isRequired(value) {
            if (value == '' && this.form.userType == 'reviewer') {
              return false;
            } else {
              return true;
            }
          },
        },
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
        passwordRepeat: {
          required,
          minLength(value) {
            if (value.length >= 8) {
              this.passErrors.minLengthRepeat = true
              return true;
            } else {
              this.passErrors.minLengthRepeat = false
              return false;
            }
          },
          passwordMatch(value) {
            if (value == this.form.password) {
              this.passErrors.passwordMatch = true;
              return true;
            } else {
              this.passErrors.passwordMatch = false;
              return false;
            }
          }
        },
      },
    },
    methods: {
      validateState(name) {
        const { $dirty, $error } = this.$v.form[name];
        return $dirty ? !$error : null;
      },
      onSubmit() {
        this.showInvalidUserAlert = false;
        this.$v.form.$touch();

        if (this.$v.form.$anyError) {
          return
        }

        // cleaning
        switch (this.form.userType) {
          case 'publisher':
            this.form.channelName = '';
            break;

          case 'reviewer':
            this.form.companyName = '';
            break;
        }

        this.$store
          .dispatch('signup', {
            firstName: this.form.firstName,
            lastName: this.form.lastName,
            companyName: this.form.companyName,
            channelName: this.form.channelName,
            userType: this.form.userType,
            email: this.form.email,
            password: this.form.password,
            passwordRepeat: this.form.passwordRepeat,
          })
          .then((result) => {
            if (result) {
              if (result.success) {
                // this.$router.push('/')
                this.showValidUserAlert = true;
                this.showInvalidUserAlert = false;
              } else {
                this.showValidUserAlert = false;
                this.showInvalidUserAlert = true;
              }
            } else {
              this.showValidUserAlert = false;
              this.showInvalidUserAlert = true;
            }
          })
      },
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
      isPublisher() {
        return this.form.userType == 'publisher';
      },
      isAccountAdded() {
        return this.showValidUserAlert;
      },
      isSignupError() {
        return this.showInvalidUserAlert;
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
