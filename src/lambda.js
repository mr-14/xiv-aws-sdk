exports.handler = handler => ctx => (event, context, callback) => {
  console.log('Request:', JSON.stringify(event, null, 2))

  if (ctx.authorize) {
    const result = ctx.authorize(event)
    if (result.err) {
      callback(result.err)
      return
    }
    event.auth = result.data
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