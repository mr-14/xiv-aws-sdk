import logger from './logger'

export default (event, context, callback, routes) => {
  for (const route of routes) {
    if (route.method !== event.httpMethod) { continue }

    const path = getPath(route.path, event.pathParameters)

    if (path !== event.path) { continue }

    try {
      route.handler(logger(event, context, callback))
    } catch (err) {
      console.error(err)
      callback(err)
    }
  }
}

function getPath(path, pathVars) {
  if (!pathVars) { return path }

  return Object.keys(pathVars).reduce((path, key) => (path.replace(`{${key}}`, pathVars[key])), path)
}