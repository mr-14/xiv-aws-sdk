const jwt = require('xiv-js-sdk/token/jwt')

module.exports = middleware => async ({ event, context }) => {
  const config = context.config
  const token = event.headers.Token ? event.headers.Token : event.headers.token

  try {
    context.token = jwt.validateToken(config.tokenKey, token)
    return await middleware({ event, context })
  } catch (err) {
    return {
      statusCode: 401,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: err.message })
    }
  }
}