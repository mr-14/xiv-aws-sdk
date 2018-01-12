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
