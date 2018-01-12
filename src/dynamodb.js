const AWS = require('aws-sdk')
const docClient = new AWS.DynamoDB.DocumentClient()

exports.put = (tableName, item) => {
  const params = { TableName: tableName, Item: item }

  return new Promise((resolve, reject) => {
    docClient.put(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

exports.get = (tableName, key) => {
  const params = { TableName: tableName, Key: key }

  return new Promise((resolve, reject) => {
    docClient.get(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}