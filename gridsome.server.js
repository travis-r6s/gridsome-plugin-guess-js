const { GuessPlugin } = require('guess-webpack')

function GuessJS (api, options) {
  let { viewId, period, jwt, minimumThreshold = 0.03 } = options

  if (!viewId) throw new Error('No Google Analytics View ID provided.')
  if (period) {
    period.startDate = new Date(period.startDate)
    period.endDate = new Date(period.endDate)
  } else {
    // We'll load 1 year of data if no period is being specified
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 365)
    period = {
      startDate,
      endDate: new Date()
    }
  }

  const guessOptions = {
    GA: viewId,
    minimumThreshold,
    jwt: {
      client_email: jwt.clientEmail,
      private_key: Buffer.from(jwt.privateKey, 'base64').toString()
    },
    // Hints Guess to not perform pre-fetching and delegate this logic to its consumer.
    runtime: {
      delegate: true
    },
    // Guess does not have to collect the routes and the corresponding bundle entry points.
    routeProvider: false
  }

  api.configureWebpack(config => {
    config.plugins.push(new GuessPlugin(guessOptions))
  })

  // Remove clientside options (to protect secret key)
  api.setClientOptions({})
}

module.exports = GuessJS
