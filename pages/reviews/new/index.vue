<template>
  <div>
    <b-container class="my-5">
      <b-row>
        <b-col></b-col>
        <b-col sm="12" md="6" lg="4">
          <h1>New review</h1>
          <div class="note mb-4">Fill in the review form.</div>

          <b-form class="form" @submit.stop.prevent="onSubmit">
            <input-game
              name="gameTitle"
              label="Review item (game)"
              placeholder="Type the game title"
              ref="game"
              @selected="onGameSelected">
            </input-game>

            <!--
            <b-form-group id="input-group-1" label="Review item (game)" label-for="input-1">
                <b-form-input
                id="input-1"
                v-model="form.itemName"
                type="text"
                placeholder="Enter game name"
                :state="validateState('itemName')"
                aria-describedby="itemName-feedback"
                />

                <b-form-invalid-feedback id="itemName-feedback">
                Select valid game name
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="input-group-2" label="Reviewer" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="form.reviewerName"
                type="text"
                placeholder="Select reviewer"
                :state="validateState('reviewerName')"
                aria-describedby="reviewer-feedback"
                @input="onReviewerChange"
                @focus="showOptions()"
                @blur="exit()"
              />

              <div class="dropdown-content"
                v-show="optionsShown">
                <div
                  class="dropdown-item"
                  @mousedown="selectOption(option)"
                  v-for="(option, index) in reviewersList"
                  :key="index">
                    {{ option.channelName || option._id || '-' }}
                </div>
              </div>

              <b-form-invalid-feedback id="reviewer-feedback">
                Select reviewer
              </b-form-invalid-feedback>
            </b-form-group>
            -->
            <input-reviewer
              name="reviewer"
              label="Reviewer"
              placeholder="Type the reviewer channel name"
              ref="reviewer"
              @selected="onReviewerSelected">
            </input-reviewer>

            <b-form-group id="input-group-3" label="Deadline" label-for="input-3">
              <b-form-datepicker
                id="input-3"
                v-model="form.deadline"
                :state="validateState('deadline')"
                class="mb-2">
              </b-form-datepicker>
            </b-form-group>

            <b-form-group id="input-group-5" label="Note" label-for="input-5">
              <b-form-textarea
                id="input-5"
                v-model="form.note"
                type="text"
                placeholder="Enter your note"
                :state="validateState('note')"
                aria-describedby="note-feedback"
                rows="3"
              ></b-form-textarea>

                <b-form-invalid-feedback id="note-feedback">
                Required
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="input-group-5" label="Reward" label-for="input-5">
                <b-form-input
                id="input-5"
                v-model="form.reward"
                type="text"
                placeholder="Enter reward"
                :state="validateState('reward')"
                aria-describedby="reward-feedback"
                />

                <b-form-invalid-feedback id="reward-feedback">
                Required
                </b-form-invalid-feedback>
            </b-form-group>

            <nuxt-link to="/reviews" tag="a" class="btn btn-secondary">Cancel</nuxt-link>
            <b-button type="submit" class="btn btn-form-submit" variant="primary">Save</b-button>
          </b-form>
        </b-col>
        <b-col></b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  import { validationMixin } from 'vuelidate';
  import { required } from 'vuelidate/lib/validators';
  import InputReviewer from '~/components/InputReviewer';
  import InputGame from '~/components/InputReviewItem';

  export default {
    name: 'NewReviewPage',
    mixins: [validationMixin],
    middleware: ['auth'],
    components: {
      InputReviewer,
      InputGame
    },
    data() {
      return {
        form: {
          itemName: '',
          itemImage: '',
          reviewerId: null,
          reviewerName: '',
          deadline: '',
          note: '',
          reward: '',
        },
      }
    },
    validations: {
      form: {
        itemName: {
          required,
        },
        reviewerId: {
          required,
        },
        reviewerName: {
          required,
        },
        deadline: {},
        note: {},
        reward: {},
      },
    },
    methods: {
      validateState(name) {
        const { $dirty, $error } = this.$v.form[name];
        return $dirty ? !$error : null;
      },
      onReviewerSelected(selected) {
        if (selected) {
          this.form.reviewerId = selected._id;
          this.form.reviewerName = selected.channelName;
        }
      },
      onGameSelected(selected) {
        if (selected) {
          this.form.itemName = selected.title;
          this.form.itemImage = selected.image;
        }
      },
      onSubmit() {
        console.log(this.form);
        this.$v.form.$touch();
        this.$refs.reviewer.$v.$touch();
        this.$refs.game.$v.$touch();

        console.log(this.$v.form);
        console.log(this.$v.form.$anyError);
        console.log(this.$refs.reviewer.$v.$anyError);
        console.log(this.$refs.game.$v.$anyError);

        if (this.$v.form.$anyError || this.$refs.reviewer.$v.$anyError || this.$refs.game.$v.$anyError) {
          return
        }

        this.$store
          .dispatch('addReview', {
            itemName: this.form.itemName,
            itemImage: this.form.itemImage,
            deadline: this.form.deadline,
            note: this.form.note,
            reward: this.form.reward,
            publisherId: this.user.id,
            reviewerId: this.form.reviewerId,
          })
          .then((result) => {
            console.log(result);

            if (result) {
              if (result.success) {
                this.$router.push('/reviews')
              } else {
                this.showError = true;
              }
            } else {
              this.showError = true;
            }
          })
      },
    },
    computed: {
      user() {
        return this.$store.getters.user
      },
    }
  }
</script>

<style lang="scss" scoped>

</style>
