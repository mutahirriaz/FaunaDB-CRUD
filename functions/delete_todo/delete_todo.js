// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb = require('faunadb');
  q = faunadb.query;
  var dotenv = require('dotenv');
  dotenv.config()


const handler = async (event) => {
  try {

    const id = JSON.parse(event.body)
    
    const client = new faunadb.Client({secret: process.env.REACT_APP_FAUNADB_KEY})
    const result = await client.query(
      q.Delete(q.Ref(q.Collection('posts'), id)),
      console.log('todos', id)
    )

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Delete ${result}` }),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
