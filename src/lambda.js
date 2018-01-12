const jwt = require('jsonwebtoken')

exports.handler = handler => ctx => (event, context, callback) => {
  console.log('Request:', JSON.stringify(event, null, 2))

  const config = ctx.config
  const authType = config.app.authType || 'jwt'

  if (authType === 'jwt') {
    const result = decodeJsonWebToken(event.headers.token, config.app.tokenKey)
    if (!result.ok) {
      callback(new Error('jwt.invalid'))
    } else {
      event.vars = { token: result.claim }
    }
  }

  const req = Object.assign({}, event, { body: event.body ? JSON.parse(event.body) : null })

  const resp = (err, data) => {
    if (err) {
      console.log('Error:', err)
      callback(err)
    } else {
      console.log('Response:', JSON.stringify(data, null, 2))
      callback(null, data)
    }
  }

  handler(req, resp, ctx)
}

function decodeJsonWebToken(token, key) {
  try {
    const claim = jwt.verify(token, key)
    return { claim, ok: true }
  } catch (e) {
    return { claim: null, ok: false }
  }
}