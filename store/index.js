import Vuex from 'vuex'
import auth from './auth'
import reviews from './reviews'
import reviewers from './reviewers'
import games from './games'
import jwt from 'jsonwebtoken';

const store = () => {
  return new Vuex.Store({
    namespaced: true,
    modules: {
      auth,
      reviews,
      reviewers,
      games
    },
    state: () => ({

    }),
    mutations: {
      setPersistedState(state, persistedState) {
        state.auth.accessToken = persistedState.auth.accessToken;
        state.auth.refreshToken = persistedState.auth.refreshToken;
      },
      setUser(state, user) {
        state.auth.user.id = user.id;
        state.auth.user.email = user.email;
      },
    },
    actions: {
      // get data once and commit to store
      async nuxtServerInit({ dispatch, commit, state },  { req }) {
        if (req.headers.cookie) {
          const cookieEntry = req.headers.cookie.split(";").find(c => c.trim().startsWith("authentication-cookie="));

          if (cookieEntry) {
            const cookieValue = decodeURIComponent(cookieEntry.split("=")[1]);
            const persistedState = JSON.parse(cookieValue);

            commit('setPersistedState', persistedState);

            if (persistedState.auth.accessToken) {
              const user = jwt.decode(persistedState.auth.accessToken);
              commit('setUser', user);
            }
          }
        }

        if (state.auth) {
          const { accessToken, refreshToken } = state.auth

          if (accessToken && refreshToken) {
            try {
              return;
            } catch (e) {
              // catch any errors and automatically logout the user
              console.log(e)
              await dispatch('logoutNow')
              return;
            }
          } else {
            // console.log('nuxtServerInit - logout - no accessToken')
            await dispatch('logoutNow')
            return;
          }
        } else {
          // console.log('nuxtServerInit - logout - no state.auth')
          await dispatch('logoutNow')
          return;
        }
      },
    },
    getters: {

    },
  })
}

export default store
