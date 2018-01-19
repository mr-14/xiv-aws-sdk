exports.handler = handler => ctx => (event, context, callback) => {
  if (ctx.authorize) {
    const result = ctx.authorize(event)
    if (result.err) {
      callback(result.err)
      return
    }
    event = result
  }

  console.log('Request =', JSON.stringify(event, null, 2))
  const req = Object.assign({}, event, { body: event.body ? JSON.parse(event.body) : null })

  const resp = (err, data) => {
    if (err) {
      console.error(err)
      callback(err)
    } else {
      console.log('Response =', JSON.stringify(data, null, 2))
      callback(null, data)
    }
  }

  handler(req, resp, ctx)
}