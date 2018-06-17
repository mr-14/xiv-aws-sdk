'use strict'

const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.put = (tableName, item) => {
  const params = { TableName: tableName, Item: item }

  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => { err ? reject(err) : resolve(data) })
  })
}

exports.get = (tableName, key) => {
  const params = { TableName: tableName, Key: key }
  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => { err ? reject(err) : resolve(data) })
  })
}

exports.query = (tableName, keys) => {
  let keyClause = '',
    keyNames = {},
    keyVals = {},
    delim = ''

  keys.forEach(item => {
    const keyOp = item.op || '='
    keyNames['#' + item.key] = item.key
    keyVals[':' + item.key] = item.val
    keyClause += delim + '#' + item.key + keyOp + ':' + item.key
    delim = ' and '
  })

  const params = {
    TableName: tableName,
    KeyConditionExpression: keyClause,
    ExpressionAttributeNames: keyNames,
    ExpressionAttributeValues: keyVals
  }

  return new Promise((resolve, reject) => {
    docClient.query(params, (err, data) => { err ? reject(err) : resolve(data) })
  })
}

exports.update = (tableName, key, items) => {
  let itemClause = 'set ',
    itemVals = {},
    delim = ''

  items.forEach(item => {
    const itemOp = item.op || '='
    itemVals[':' + item.key] = item.val
    itemClause += delim + item.key + keyOp + ':' + item.key
    delim = ', '
  })

  const params = {
    TableName: tableName,
    Key: key,
    UpdateExpression: itemClause,
    ExpressionAttributeValues: itemVals,
    ReturnValues: 'ALL_NEW'
  }

  return new Promise((resolve, reject) => {
    docClient.update(params, (err, data) => { err ? reject(err) : resolve(data) })
  })
}

exports.delete = (tableName, key) => {
  const params = { TableName: tableName, Key: key }

  return new Promise((resolve, reject) => {
    docClient.delete(params, (err, data) => { err ? reject(err) : resolve(data) })
  })
}