const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

const handleResponse = (action, resolve, reject, dataParser) => (err, data) => {
  if (err) {
    console.log(`Dynamodb ${action} error:`, err)
    reject(err)
  } else {
    console.log(`Dynamodb ${action} result:`, data)
    resolve(dataParser ? dataParser(data) : data)
  }
}

exports.put = ({ tableName, item, conditions = [] }) => {
  let conditionClause = ''
  let conditionNames = {}
  let conditionVals = {}
  let delim = ''

  conditions.forEach(item => {
    if (item.func) {
      conditionNames['#' + item.val] = item.val
      conditionClause += `${delim} ${item.func}(#${item.val})`
    }

    if (item.key) {
      const op = item.op || '='
      conditionNames['#' + item.key] = item.key
      conditionVals[':' + item.key] = item.val
      conditionClause += `${delim} #${item.key} ${op} :${item.key}`
    }

    delim = ' AND '
  })

  const params = { TableName: tableName, Item: item }

  if (conditionClause) {
    params.ConditionExpression = conditionClause
  }

  if (Object.keys(conditionNames).length > 0) {
    params.ExpressionAttributeNames = conditionNames
  }

  if (Object.keys(conditionVals).length > 0) {
    params.ExpressionAttributeValues = conditionVals
  }

  return new Promise((resolve, reject) => {
    docClient.put(params, handleResponse('PUT', resolve, reject))
  })
}

exports.get = ({ tableName, key }) => {
  const params = { TableName: tableName, Key: key }

  return new Promise((resolve, reject) => {
    docClient.get(params, handleResponse('GET', resolve, reject, data => data.Item))
  })
}

exports.query = ({ tableName, indexName, items }) => {
  let queryClause = ''
  const queryNames = {}
  const queryVals = {}
  let delim = ''

  items.forEach(item => {
    const op = item.op || '='
    queryNames['#' + item.key] = item.key
    queryVals[':' + item.key] = item.val
    queryClause += ` ${delim} #${item.key} ${op} :${item.key}`
    delim = 'AND'
  })

  const params = {
    TableName: tableName,
    KeyConditionExpression: queryClause,
    ExpressionAttributeNames: queryNames,
    ExpressionAttributeValues: queryVals
  }

  if (indexName) {
    params.IndexName = indexName
  }

  return new Promise((resolve, reject) => {
    docClient.query(params, handleResponse('QUERY', resolve, reject, data => data.Items))
  })
}

exports.update = ({ tableName, key, item, conditions = [] }) => {
  let updateClause = 'SET '
  const updateNames = {}
  const updateVals = {}
  let updateDelim = ''

  Object.keys(item).forEach(key => {
    updateNames['#' + key] = key
    updateVals[':' + key] = item[key]
    updateClause += `${updateDelim} #${key} = :${key}`
    updateDelim = ','
  })

  let conditionClause = ''
  let conditionNames = {}
  let conditionVals = {}
  let conditionDelim = ''

  conditions.forEach(item => {
    if (item.func) {
      conditionNames['#' + item.val] = item.val
      conditionClause += `${conditionDelim} ${item.func}(#${item.val})`
    }

    if (item.key) {
      const op = item.op || '='
      conditionNames['#' + item.key] = item.key
      conditionVals[':' + item.key] = item.val
      conditionClause += `${conditionDelim} #${item.key} ${op} :${item.key}`
    }

    conditionDelim = ' AND '
  })

  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: updateClause,
    ExpressionAttributeNames: updateNames,
    ExpressionAttributeValues: updateVals,
    ReturnValues: 'ALL_NEW'
  }

  if (conditionClause) {
    params.ConditionExpression = conditionClause
  }

  if (Object.keys(conditionNames).length > 0) {
    params.ExpressionAttributeNames = Object.assign(params.ExpressionAttributeNames, conditionNames)
  }

  if (Object.keys(conditionVals).length > 0) {
    params.ExpressionAttributeValues = Object.assign(params.ExpressionAttributeValues, conditionVals)
  }

  return new Promise((resolve, reject) => {
    docClient.update(params, handleResponse('UPDATE', resolve, reject, data => data.Attributes))
  })
}

exports.delete = ({ tableName, key }) => {
  const params = { TableName: tableName, Key: key }

  return new Promise((resolve, reject) => {
    docClient.delete(params, handleResponse('DELETE', resolve, reject))
  })
}