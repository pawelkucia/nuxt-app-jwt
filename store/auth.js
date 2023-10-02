// const encode = require('nodejs-base64-encode')
import { print } from 'graphql';
import gql from 'graphql-tag';
import jwt from 'jsonwebtoken';

const state = () => ({
  accessToken: null, // JWT access token
  refreshToken: null, // JWT refresh token
  user: {
    id: null, // user id
    email: null, // user email address
    userType: null // publisher or reviewer
  }
})

const mutations = {
  // store the logged in user in the state
  setUser(state, { id, email, userType }) {
    state.user.id = id;
    state.user.email = email;
    state.user.userType = userType;
  },

  // store new or updated token fields in the state
  setTokens(state, { accessToken, refreshToken = null }) {
    state.accessToken = accessToken

    // refresh token is optional, only set it if present
    if (refreshToken) {
      state.refreshToken = refreshToken
    }
  },

  // clear out the state, essentially logging out the user
  logout(state) {
    state.user = {
      id: null, // user id
      email: null, // user email address
      userType: null // publisher or reviewer
    }

    state.accessToken = null
    state.refreshToken = null
  },
}

const actions = {
  login({ commit, dispatch }, { email, password }) {
    const credentials = ""; //encode.encode(`${username}:${password}`, 'base64')

    const loginUserQuery = gql`
    mutation login($email:String!, $password:String!) {
      login(email:$email, password:$password) {
        accessToken,
        refreshToken
      }
    }`;

    return this.$axios
      .post(
        process.env.apiUrl,
        {
          query: print(loginUserQuery),
          variables: {
            email: email,
            password: password
          }
        }
      )
      .then((result) => {
        if (result.status === 200) {
          if (!result.data.data.login) {
            return { success: false, error: { data: 'No result', status: 200 } }
          }

          // commit the user and tokens to the state
          const user = jwt.decode(result.data.data.login.accessToken);

          commit('setUser', user)
          commit('setTokens', result.data.data.login)

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

  signup({ commit, dispatch }, {
    firstName,
    lastName,
    companyName,
    channelName,
    userType,
    email,
    password
  }) {
    const signupUserQuery = gql`
    mutation signup(
      $firstName:String!,
      $lastName:String!,
      $companyName:String!,
      $channelName:String!,
      $userType:String!,
      $email:String!,
      $password:String!
      ) {
      signup(
        firstName:$firstName,
        lastName:$lastName,
        companyName:$companyName,
        channelName:$channelName,
        userType:$userType,
        email:$email,
        password:$password
      ) {
        userType,
        email
      }
    }`;

    return this.$axios
      .post(
        process.env.apiUrl,
        {
          query: print(signupUserQuery),
          variables: {
            firstName: firstName,
            lastName: lastName,
            companyName: companyName,
            channelName: channelName,
            userType: userType,
            email: email,
            password: password
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

  // given the current refresh token, refresh the user's access token to prevent expiry
  refresh({ commit, state }) {
    const refreshToken = state.refreshToken;

    const refreshTokenQuery = gql`
    mutation refresh($refreshToken:String!) {
      refresh(refreshToken:$refreshToken) {
        accessToken,
        refreshToken
      }
    }`;

    // make an API call using the refresh token to generate a new access token
    return this.$axios
      .post(
        process.env.apiUrl,
        {
          query: print(refreshTokenQuery),
          variables: {
            refreshToken: refreshToken
          }
        }
      )
      .then((result) => {
        if (result.status === 200) {
          commit('setTokens', result.data.data.refresh)

          return { success: true }
        } else {
          return { success: false, error: { data: 'No result', status: 200 } }
        }
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data)
          console.log(error.response.status)

          return { success: false, error: error.response }
        } else {
          console.log(error);
          return { success: false, error: { data: 'Error: ' + error, status: 200 } }
        }
      })
  },

  // logout the user
  logout({ commit, state }) {
    const email = state.user.email;
    const logoutQuery = gql`
    mutation logout($email:String!) {
      logout(email:$email) {
        id
      }
    }`;

    if (email) {
      return this.$axios
        .post(
          process.env.apiUrl,
          {
            query: print(logoutQuery),
            variables: {
              email: email
            }
          },
        )
        .then((result) => {
          if (result.status === 200) {
            commit('logout')

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
      } else {
        // commit('logout');
      }
  },

  activate({ commit, dispatch }, { activationHash }) {
    const activateUserQuery = gql`
    mutation activate($activationHash:String!) {
      activate(activationHash:$activationHash) {
        id,
        email
      }
    }`;

    return this.$axios
      .post(
        process.env.apiUrl,
        {
          query: print(activateUserQuery),
          variables: {
            activationHash: activationHash,
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

  // clear user data
  logoutNow({ commit, state }) {
    commit('logout');
  }
}

const getters = {
  // determine if the user is authenticated based on the presence of the access token
  isAuthenticated: (state) => {
    return state.accessToken && state.accessToken !== ''
  },
  user: (state) => {
    return state.user;
  }
}

export default {
  state,
  actions,
  mutations,
  getters,
}
