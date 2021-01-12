// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb = require('faunadb');
  q = faunadb.query;
  require('dotenv').config();


const handler = async (event) => {
  if (process.env.REACT_APP_FAUNADB_KEY) {

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
}else{
  console.log('No FAUNADB_SERVER_SECRET in .env file, skipping Document Retrival');
}
}

module.exports = { handler }
