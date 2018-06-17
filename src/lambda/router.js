import logger from './logger'

export default (event, context, callback, routes) => {
  for (const route of routes) {
    if (route.method !== event.httpMethod) { continue }

    const path = getPath(route.path, event.pathParameters)

    if (path === event.path) {
      route.handler(logger(event, context, callback))
    }
  }
}

function getPath(path, pathVars) {
  return Object.keys(pathVars).reduce((path, key) => (path.replace(`{${key}}`, pathVars[key])), path)
}