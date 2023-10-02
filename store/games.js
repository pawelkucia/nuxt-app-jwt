// const encode = require('nodejs-base64-encode')
import { print } from 'graphql';
import gql from 'graphql-tag';

const state = () => ({
  gamesTitlesList: []
})

const mutations = {
  setGamesTitles(state, { gamesTitles }) {
    if (gamesTitles) {
      state.gamesTitlesList = gamesTitles;
    }
  },
}

const actions = {
  searchGamesTitles({ commit, dispatch }, { keyword }) {
    const getGamesTitlesQuery = gql`
      query gamesTitles($keyword: String!) {
        gamesTitles(keyword:$keyword) {
          title,
          cover
        }
      }`;

      return this.$axios.post(process.env.gamesApiUrl,
        {
          query: print(getGamesTitlesQuery),
          variables: {
            keyword: keyword
          }
        }
      )
      .then(result => {
        if (result.status === 200) {
          commit('setGamesTitles', result.data.data)
          console.log(result.data.data);
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
  allGamesTitles: (state) => {
    return state.gamesTitlesList;
  },
}

export default {
  state,
  actions,
  mutations,
  getters,
}
