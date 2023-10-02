// const encode = require('nodejs-base64-encode')
import { print } from 'graphql';
import gql from 'graphql-tag';

const state = () => ({
  reviewsList: [],
  reviewsTotal: 0,
  limit: 100,
  page: 1,
})

const mutations = {
  setReviews(state, { publisherReviews, reviewerReviews }) {
    if (publisherReviews) {
      state.reviewsList = publisherReviews;
    }

    if (reviewerReviews) {
      state.reviewsList = reviewerReviews;
    }
  },
  setReviewsTotal(state, { publisherReviewsTotal, reviewerReviewsTotal }) {
    if (publisherReviewsTotal) {
      state.reviewsTotal = publisherReviewsTotal.total;
    }

    if (reviewerReviewsTotal) {
      state.reviewsTotal = reviewerReviewsTotal.total;
    }
  },
  removeReview(state, id) {
    let newList = state.reviewsList.filter(review => review.id != id);
    state.reviewsList = newList;
    state.reviewsTotal--;
  }
}

const prepareGetReviewsQuery = (userType) => {
  let getReviewsQuery = null;

  switch (userType) {
    case 'publisher':
      getReviewsQuery = gql`
        query reviews($id: String!, $limit: Int!, $page: Int!) {
          publisherReviewsTotal(id:$id) {
            total
          },
          publisherReviews(id:$id, limit:$limit, page:$page) {
            id,
            item {
              name,
              image
            },
            publisher {
              companyName
            },
            reviewer {
              channelName
            },
            createdAt,
            status
          }
        }`;
      break;
      case 'reviewer':
        getReviewsQuery = gql`
          query reviews($id: String!, $limit: Int!, $page: Int!) {
            reviewerReviewsTotal(id:$id) {
              total
            },
            reviewerReviews(id:$id, limit:$limit, page:$page) {
              id,
              item {
                name,
                image
              },
              publisher {
                companyName
              },
              reviewer {
                channelName
              },
              createdAt,
              status
            }
          }`;
        break;
  }

  return getReviewsQuery;
}

const actions = {
  searchReviews({ commit, dispatch, getters }, { limit, page }) {
    const user = getters.user;
    const getReviewsQuery = prepareGetReviewsQuery(user.userType);

    if (getReviewsQuery) {
      return this.$axios.post(process.env.apiUrl,
        {
          query: print(getReviewsQuery),
          variables: {
            id: user.id,
            limit: limit,
            page: page
          }
        }
      )
      .then(result => {
        if (result.status === 200) {
          commit('setReviews', result.data.data)
          commit('setReviewsTotal', result.data.data);
        }
      })
      .catch(e => {
          console.log(e);
        }
      )
    }
  },
  getReviews({ commit, dispatch, getters }, { limit, page }) {
    const user = getters.user;
    const getReviewsQuery = prepareGetReviewsQuery(user.userType);

    if (getReviewsQuery) {
      return this.$axios.post(process.env.apiUrl,
        {
          query: print(getReviewsQuery),
          variables: {
            id: user.id,
            limit: limit,
            page: page
          }
        }
      )
      .then(result => {
        if (result.status === 200) {
          commit('setReviews', result.data.data);
          commit('setReviewsTotal', result.data.data);
        }
      })
      .catch(e => {
          console.log(e);
        }
      )
    }
  },
  getReview({ commit, dispatch }, { id }) {
    const getReviewQuery = gql`
    query review($id: String!) {
      review(id:$id) {
        id,
        item {
          name,
          image
        },
        publisher {
          companyName
        },
        reviewer {
          id,
          channelName
        },
        createdAt,
        status,
        deadline,
        note,
        reward
      }
    }`;

    return this.$axios.post(process.env.apiUrl,
      {
        query: print(getReviewQuery),
        variables: {
          id: id
        }
      }
    )
    .then(result => {
      if (result.status === 200) {
        return result.data.data.review;
      }
    })
    .catch(e => {
        console.log(e);
      }
    )
  },
  addReview({ commit, dispatch }, {
    itemName,
    itemImage,
    deadline,
    note,
    reward,
    publisherId,
    reviewerId,
  }) {
    const addReviewQuery = gql`
    mutation addReview(
      $itemName:String!,
      $itemImage:String!,
      $deadline:String!,
      $note:String!,
      $reward:String!,
      $publisherId:ID!,
      $reviewerId:ID!
      ) {
      addReview(
        itemName:$itemName,
        itemImage:$itemImage,
        deadline:$deadline,
        note:$note,
        reward:$reward,
        publisherId:$publisherId,
        reviewerId:$reviewerId
      ) {
        status
      }
    }`;

    return this.$axios
      .post(
        process.env.apiUrl,
        {
          query: print(addReviewQuery),
          variables: {
            itemName: itemName,
            itemImage: itemImage,
            deadline: deadline,
            note: note,
            reward: reward,
            publisherId: publisherId,
            reviewerId: reviewerId
          }
        }
      )
      .then((result) => {
        if (result.status === 200) {
          return { success: true }
        } else {
          return { success: false, error: { data: 'No result', status: 200 } }
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)

          return { success: false, error: error.response }
        } else {
          console.log(error);
          return { success: false, error: { data: 'Error: ' + error, status: 200 } }
        }
      })
  },
  updateReview({ commit, dispatch }, {
    id,
    itemName,
    itemImage,
    deadline,
    note,
    reward,
    publisherId,
    reviewerId,
  }) {
    const updateReviewQuery = gql`
    mutation updateReview(
      $id:ID!
      $itemName:String!,
      $itemImage:String!,
      $deadline:String!,
      $note:String!,
      $reward:String!,
      $publisherId:ID!,
      $reviewerId:ID!
      ) {
      updateReview(
        id:$id,
        itemName:$itemName,
        itemImage:$itemImage,
        deadline:$deadline,
        note:$note,
        reward:$reward,
        publisherId:$publisherId,
        reviewerId:$reviewerId
      ) {
        status
      }
    }`;

    return this.$axios
      .post(
        process.env.apiUrl,
        {
          query: print(updateReviewQuery),
          variables: {
            id: id,
            itemName: itemName,
            itemImage: itemImage,
            deadline: deadline,
            note: note,
            reward: reward,
            publisherId: publisherId,
            reviewerId: reviewerId
          }
        }
      )
      .then((result) => {
        if (result.status === 200) {
          return { success: true }
        } else {
          return { success: false, error: { data: 'No result', status: 200 } }
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)

          return { success: false, error: error.response }
        } else {
          console.log(error);
          return { success: false, error: { data: 'Error: ' + error, status: 200 } }
        }
      })
  },
  deleteReview({ commit, dispatch }, {
    id
  }) {
    const deleteReviewQuery = gql`
    mutation deleteReview(
      $id:ID!
      ) {
      deleteReview(
        id:$id
      ) {
        status
      }
    }`;

    return this.$axios
      .post(
        process.env.apiUrl,
        {
          query: print(deleteReviewQuery),
          variables: {
            id: id
          }
        }
      )
      .then((result) => {
        if (result.status === 200) {
          commit('removeReview', id);
          return { success: true }
        } else {
          return { success: false, error: { data: 'No result', status: 200 } }
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)

          return { success: false, error: error.response }
        } else {
          console.log(error);
          return { success: false, error: { data: 'Error: ' + error, status: 200 } }
        }
      })
  },
}

const getters = {
  allReviews: (state) => {
    return state.reviewsList;
  },
  reviewsTotal: (state) => {
    return state.reviewsTotal;
  },
  limit: (state) => {
    return state.limit;
  },
  page: (state) => {
    return state.page;
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
}
