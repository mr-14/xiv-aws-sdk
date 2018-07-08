module.exports = async (event, context, routes) => {
  try {
    const handler = getHandler(event, routes)

    const req = formatRequest(event)
    console.log('Request =', JSON.stringify(req, null, 2))

    const raw = await handler({ req, context })
    const resp = formatResponse(raw)
    console.log('Response =', JSON.stringify(resp, null, 2))

    return resp
  } catch (err) {
    console.error(err)

    return {
      statusCode: err.statusCode ? err.statusCode : 500,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        message: err.message ? err.message : 'error.internal',
      })
    }
  }
}

function getHandler(event, routes) {
  for (const route of routes) {
    if (route.method !== event.httpMethod) { continue }

    const path = getPath(route.path, event.pathParameters)

    if (path !== event.path) { continue }

    return route.handler
  }

  throw new Error('error.route.notFound')
}

function getPath(path, pathVars) {
  if (!pathVars) { return path }

  return Object.keys(pathVars).reduce((path, key) => (path.replace(`{${key}}`, pathVars[key])), path)
}

function formatRequest(req) {
  if (req.body) {
    req.body = JSON.parse(req.body)
  }

  return req
}

function formatResponse(resp) {
  if (!resp.headers) {
    resp.headers = {}
  }

  if (!resp.headers['Access-Control-Allow-Origin']) {
    resp.headers['Access-Control-Allow-Origin'] = '*'
  }

  if (resp.body && typeof resp.body !== 'string') {
    resp.body = JSON.stringify(resp.body)
  }

  return resp
}