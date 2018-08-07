module.exports = async ({ event, context }) => {
  try {
    const handlers = []

    getHandlers(event.Records, context.dbEvents).forEach(({record, handler}) => {
      console.log('DBEvent =', JSON.stringify(record, null, 2))
      handlers.push(handler({ event: record, context }))
    })

    return Promise.all(handlers)
  } catch (err) {
    console.error(err)
  }
}

function getHandlers(records, dbEvents) {
  const matches = []

  for (const record of records) {
    let matched = false

    for (const dbEvent of dbEvents) {
      if (record.eventName !== dbEvent.type) { continue }

      const table = getTableName(record.eventSourceARN)
      if (table !== dbEvent.table) { continue }

      matched = true
      matches.push({ record, handler: dbEvent.handler })
    }

    if (!matched) {
      console.log('DBEvent handler not found:', JSON.stringify(record, null, 2))
    }
  }

  return matches
}

function getTableName(eventSourceARN) {
  const regex = /^arn:aws:dynamodb:.*:table\/(\w+)\/stream\/.*$/
  const match = regex.exec(eventSourceARN)
  return match[1]
}