module.exports = (event, context, callback) => {
  console.log('Request =', JSON.stringify(event, null, 2))
  const req = Object.assign({}, event, { body: event.body ? JSON.parse(event.body) : null })

  const resp = (err, data) => {
    if (err) {
      console.error(err)
      callback(err)
    } else {
      console.log('Response =', JSON.stringify(data, null, 2))

      if (!data.headers) {
        data.headers = {}
      }

      if (!data.headers['Access-Control-Allow-Origin']) {
        data.headers['Access-Control-Allow-Origin'] = '*'
      }

      if (data.body && typeof data.body !== 'string') {
        data.body = JSON.stringify(data.body)
      }

      callback(null, data)
    }
  }

  return { req, resp, context }
}