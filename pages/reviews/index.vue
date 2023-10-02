<template>
  <div>
    <b-container class="my-5">
      <b-row>
        <b-col>
          <h1>Reviews:</h1>
        </b-col>
        <b-col>
          <nuxt-link v-if="user.userType == 'publisher'" to="/reviews/new" tag="a" class="btn btn-primary float-right">
            Add new review
          </nuxt-link>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div v-if="numberOfPages > 0" class="pagination-row">
            <span>Total: <b>{{ reviewsTotal }}</b></span>
            <b-pagination-nav :link-gen="linkGen" :number-of-pages="numberOfPages" last-number use-router></b-pagination-nav>
          </div>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-table striped hover :items="reviewsRows">
            <template #cell(itemImage)="data">
              <span v-html="data.value"></span>
            </template>
            <template v-slot:cell(actions)="{ item }">
              <span><b-btn @click="showItem(item)" class="btn-primary">Show</b-btn></span>
              <span v-if="user.userType=='publisher'"><b-btn @click="deleteItem(item)" class="btn-danger">Delete</b-btn></span>
            </template>
          </b-table>
          <b-modal
            ref="delete-modal"
            id="delete-modal"
            title="Confirmation"
            @cancel="deleteItemCancelled"
            @ok="deleteItemConfirmed"
            >Are you sure?</b-modal>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <div v-if="numberOfPages > 0" class="pagination-row">
            <span>Total: <b>{{ reviewsTotal }}</b></span>
            <b-pagination-nav :link-gen="linkGen" :number-of-pages="numberOfPages" last-number use-router></b-pagination-nav>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
  export default {
    name: 'ReviewsPage',
    middleware: ['auth'],
    data() {
      return {
        search: {
            limit: this.$store.getters.limit,
            page: this.$store.getters.page
        },
        reviewsTotal: this.$store.getters.reviewsTotal,
      }
    },
    async asyncData({ store, query }) {
      console.log('Loading reviews from DB');

      await store.dispatch('getReviews', { limit: 100, page: 1 })
      .catch((e) => {
        error({statusCode: 404});
      });

      let reviews = store.getters.allReviews;

      return { reviews };
    },
    methods: {
      onSearch() {
        this.$store
        .dispatch('searchReviews', {
            limit: this.search.limit,
            page: this.search.page
        })
        .then((result) => {
            this.reviews = this.$store.getters.allReviews;
            this.reviewsTotal = this.$store.getters.reviewsTotal;
        });
      },
      reviewUrl(id) {
        return `/reviews/${id}`;
      },
      linkGen(pageNum) {
        return {
          path: '/reviews/',
          query: { page: pageNum }
        }
      },
      showItem(item) {
        this.$router.push(this.reviewUrl(item.id));
      },
      deleteItem(item) {
        this.itemToDelete = item.id;
        this.$refs['delete-modal'].show();
      },
      deleteItemCancelled() {
        this.itemToDelete = null;
      },
      deleteItemConfirmed() {
        if (this.itemToDelete) {
          this.$store
            .dispatch('deleteReview', {
              id: this.itemToDelete
            })
            .then((result) => {
              if (result && result.success) {
                this.reviews = this.$store.getters.allReviews;
                this.reviewsTotal = this.$store.getters.reviewsTotal;
              }
            })
        }
      },
    },
    computed: {
      numberOfPages() {
        return Math.ceil(this.reviewsTotal / this.search.limit);
      },
      reviewsRows() {
        let rows = this.reviews.map(review => {
          return {
            id: review.id,
            itemName: review.item.name,
            itemImage: review.item.image != '' ? `<img src="${review.item.image}" class="item-img" loading="lazy">` : '<img src="/temp-cover.jpg" class="item-img" loading="lazy">',
            publisher: review.publisher.companyName,
            reviewer: review.reviewer.channelName,
            actions: '',
          }
        })

        return rows;
      },
      user() {
        return this.$store.getters.user
      }
    },
    mounted() {
      // console.log(this.$route.fullPath)
    },
    watch: {
      '$route.query'() {
        if (this.$route.query.page) {
          this.search.page = parseInt(this.$route.query.page);
          this.onSearch();
        }
      }
    },
  }
  </script>

  <style lang="scss">
    .pagination-row {
      display: flex;
      justify-content: end;
      align-items: baseline;

      span {
        margin-right: 1rem;
      }
    }

    .item-img {
      height: 60px;
    }

    @media (max-width: 767px) {
      .pagination-row {
        justify-content: center;
        flex-direction: column;
        align-items: center;

        span {
          margin-right: 0;
        }
      }

    }
  </style>
