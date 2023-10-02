// expose the store, axios client and redirect method from the Nuxt context
// https://nuxtjs.org/api/context/
export default function ({ store, app: { $axios }, redirect }) {
    const IGNORED_PATHS = [
      'mutation login',
      'mutation refresh',
      'mutation signup',
      'query gamesTitles'
    ];

    $axios.onRequest((config) => {
      // check if the user is authenticated
      if (store.state.auth.accessToken ) {
        // set the Authorization header using the access token

        // ignore certain paths (i.e. paths relating to authentication)
        const isIgnored = IGNORED_PATHS.some((path) => {
          // config.url.includes(path)

          if (typeof(config.data) == 'object') {
            return config.data.query.indexOf(path) >= 0
          } else {
            return config.data.indexOf(path) >= 0
          }
        })

        if (!isIgnored) {
          config.headers.Authorization = 'Bearer ' + store.state.auth.accessToken
        }
      }

      return config
    });

    $axios.onError((error) => {
      return new Promise(async (resolve, reject) => {
        // get the status code from the response
        const statusCode = error.response ? error.response.status : -1
        const message = error.response ? error.response.data : ''

        // only handle authentication errors or errors involving the validity of the token
        // determine if the error is a result of an expired access token
        if (statusCode === 401 && message === 'Invalid token') {
          // get the refresh token from the state if it exists
          const refreshToken = store.state.auth.refreshToken

          if (refreshToken) {
            // see below - consider the refresh process failed if this is a 2nd attempt at the request
            if (error.config.hasOwnProperty('retryAttempts')) {
              delete error.config.retryAttempts;

              // immediately logout if already attempted refresh
              await store.dispatch('logoutNow')

              // redirect the user home
              return redirect('/')
            } else {
              // merge a new retryAttempts property into the original request config to prevent infinite-loop if refresh fails
              const config = { retryAttempts: 1, ...error.config }

              try {
                // attempt to refresh access token using refresh token
                await store.dispatch('refresh')

                // re-run the initial request using the new request config after a successful refresh
                // this response will be returned to the initial calling method
                return resolve($axios(config))
              } catch (e) {
                console.log(e);
                delete error.config.retryAttempts;

                // catch any error while refreshing the token
                await store.dispatch('logoutNow')

                // redirect the user home
                return redirect('/')
              }
            }
          } else if (message === 'Invalid token') {
            // console.log('catch any other JWT-related error (i.e. malformed token) and logout the user');

            if (error.config.hasOwnProperty('retryAttempts')) {
              delete error.config.retryAttempts;
            }
            // catch any other JWT-related error (i.e. malformed token) and logout the user
            await store.dispatch('logoutNow')

            // redirect the user home
            return redirect('/')
          }
        }

        // ignore all other errors, let component or other error handlers handle them
        return reject(error)
      })
    })
  }
