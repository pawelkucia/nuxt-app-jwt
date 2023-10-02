// const encode = require('nodejs-base64-encode')
import { print } from 'graphql';
import gql from 'graphql-tag';

const state = () => ({
  reviewersList: []
})

const mutations = {
  setReviewers(state, { reviewers }) {
    if (reviewers) {
      state.reviewersList = reviewers;
    }
  },
}

const actions = {
  searchReviewers({ commit, dispatch }, { keyword }) {
    const getReviewersQuery = gql`
      query reviewers($keyword: String!) {
        reviewers(keyword:$keyword) {
          _id,
          channelName
        }
      }`;

      return this.$axios.post(process.env.apiUrl,
        {
          query: print(getReviewersQuery),
          variables: {
            keyword: keyword
          }
        }
      )
      .then(result => {
        if (result.status === 200) {
          commit('setReviewers', result.data.data)
          return result.data.data;
        }
      })
      .catch(e => {
          console.log(e);
        }
      )
  },
}

const getters = {
  allReviewers: (state) => {
    return state.reviewersList;
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
}
