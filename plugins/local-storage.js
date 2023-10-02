import createPersistedState from 'vuex-persistedstate'
import * as Cookies from 'js-cookie'
import cookie from 'cookie'

// access the store, http request and environment from the Nuxt context
// https://nuxtjs.org/api/context/
export default ({ store, req, isDev }) => {
  createPersistedState({
    key: 'authentication-cookie',
    paths: [
      // persist the accessToken and refreshToken values from the "auth" store module
      'auth.accessToken',
      'auth.refreshToken'
    ],
    storage: {
      // if on the browser, parse the cookies using js-cookie otherwise parse from the raw http request
      getItem: (key) => {

        if (process.client) {
          let c = Cookies.get(key);
          return c;
        } else {
          let c = cookie.parse(req.headers.cookie || '')[key];
          return c;
        }
      },
      // js-cookie can handle setting both client-side and server-side cookies with one method
      // use isDev to determine if the cookies is accessible via https only (i.e. localhost likely won't be using https)
      setItem: (key, value) => {
        Cookies.remove(key);
        // uncomment on PROD - SSL needed
        // Cookies.set(key, value, { expires: 14, secure: !isDev });
        Cookies.set(key, value, { expires: 14, secure: false });
      },
      // also allow js-cookie to handle removing cookies
      removeItem: (key) => Cookies.remove(key),
    }
  })(store)
}
