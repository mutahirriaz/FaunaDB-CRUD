// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require('faunadb');
  q = faunadb.query;
  var dotenv = require('dotenv');
  dotenv.config()



const handler = async (event) => {
  try {

    const client = new faunadb.Client({secret: process.env.REACT_APP_FAUNADB_KEY});
    var result = await client.query(
      q.Map(
        q.Paginate(
          q.Documents(q.Collection('posts'))
        ),
        q.Lambda(x => q.Get(x))
      )
    )

    return {
      statusCode: 200,
      body: JSON.stringify(result.data),
      // // more keys you can return:
      // headers: { "headerName": "headerValue", ... },
      // isBase64Encoded: true,
    }
  } catch (error) {
    return { statusCode: 500, body: error.toString() }
  }
}

module.exports = { handler }
