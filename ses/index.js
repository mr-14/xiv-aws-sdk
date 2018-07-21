const AWS = require('aws-sdk')

exports.send = function ({ from, to, subject, htmlBody, textBody }) {
  const params = {
    Destination: {
      ToAddresses: (to instanceof Array) ? to : [to]
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: htmlBody
        },
        Text: {
          Charset: 'UTF-8',
          Data: textBody
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      }
    },
    ReturnPath: from,
    Source: from,
  }

  AWS.config.update({ region: 'us-west-2' })
  const ses = new AWS.SES({ apiVersion: '2010-12-01' })
  return new Promise((resolve, reject) => {
    ses.sendEmail(params, (err, data) => { err ? reject(err) : resolve(data) })
  })
}