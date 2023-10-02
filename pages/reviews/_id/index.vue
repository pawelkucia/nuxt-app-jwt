<template>
  <div>
    <b-container class="my-5" v-if="review">
      <b-row class="mb-4" v-if="user.userType=='reviewer'">
        <b-col sm="12" md="4" lg="4">
          <b-img-lazy v-if="review.item.image" :src="review.item.image" class="img-game-cover"></b-img-lazy>
          <b-img-lazy v-if="!review.item.image" src="/temp-cover.jpg" class="img-game-cover"></b-img-lazy>
        </b-col>
        <b-col>
          <div class="review-info-short bg-light">
            <h1>{{ review.item.name }}</h1>
            <p>Created: {{ $frogTools.formatDateTime(review.createdAt, true) }}</p>
            <p>Status: {{ review.status }}</p>

            <hr/>
            <p class="mb-3">Publisher: {{ review.publisher.companyName }}</p>
            <p class="mb-3">Reviewer: {{ review.reviewer.channelName }}</p>
            <p class="mb-3">Deadline: {{ $frogTools.formatDateTime(review.deadline, false) }}</p>
            <p class="mb-3">Note: {{ review.note }}</p>
            <p class="mb-3">Reward: {{ review.reward }}</p>
          </div>
        </b-col>
      </b-row>
      <b-row class="mb-4" v-if="user.userType=='publisher'">
        <b-col></b-col>
        <b-col sm="12" md="6" lg="4">
          <h1>Review</h1>
          <div class="note mb-4">You can change the review data here.</div>

          <b-form class="form" @submit.stop.prevent="onSubmit">
            <input-game
              name="gameTitle"
              label="Review item (game)"
              placeholder="Type the game title"
              ref="game"
              :valueName="form.itemName"
              :valueImage="form.itemImage"
              @selected="onGameSelected">
            </input-game>

            <input-reviewer
              name="reviewer"
              label="Reviewer"
              placeholder="Type the reviewer channel name"
              ref="reviewer"
              :valueId="form.reviewerId"
              :valueName="form.reviewerName"
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
            <b-button type="submit" class="btn btn-primary btn-form-submit" variant="primary">Save</b-button>
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
    name: 'ReviewPage',
    mixins: [validationMixin],
    middleware: ['auth'],
    components: {
      InputReviewer,
      InputGame
    },
    data() {
      return {

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
    async asyncData({ store, params, redirect, $frogTools }) {
      const id = params.id;

      let review = await store.dispatch('getReview', { id: id })
      .catch((e) => {
          error({statusCode: 404});
      });

      if (!review) {
          return redirect('/reviews');
      }

      let form = {
        itemName: review.item.name,
        itemImage: review.item.image,
        reviewerId: review.reviewer.id,
        reviewerName: review.reviewer.channelName,
        deadline: $frogTools.formatDateTime(review.deadline, false),
        note: review.note,
        reward: review.reward,
      }

      return { review, form };
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

        if (this.$v.form.$anyError || this.$refs.reviewer.$v.$anyError || this.$refs.game.$v.$anyError) {
          return
        }

        this.$store
          .dispatch('updateReview', {
            id: this.review.id,
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
      }
    }
  }
</script>

<style lang="scss" scoped>
    .img-game-cover {
      width: 100%;
    }

    .review-info-short {
      padding: 1rem;

      span {
        display: inline-block;
      }
    }
</style>
