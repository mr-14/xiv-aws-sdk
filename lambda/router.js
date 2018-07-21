const httpRouter = require('./httpRouter')
const dbRouter = require('./dbRouter')

module.exports = async ({ event, context }) => {
  if (event.Records) {
    return dbRouter({ event, context })
  } 

  return httpRouter({ event, context })
}