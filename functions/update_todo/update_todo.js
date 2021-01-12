// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method

const faunadb = require('faunadb');
  q = faunadb.query;
require('dotenv').config();


const handler = async (event) => {
  if (process.env.REACT_APP_FAUNADB_KEY) {

  try {

    const reqObj = JSON.parse(event.body)

    console.log("REQUEST_OBJECT" , reqObj)

    const id = reqObj.id 

    console.log("ID"  ,id)

const client = new faunadb.Client({secret: process.env.REACT_APP_FAUNADB_KEY});
const result = await client.query(
  q.Update(
    q.Ref(q.Collection('posts'), id),
    {data: {todo: reqObj.todo}}
  )
)
console.log('update', id)

    return {
      statusCode: 200,
      body: JSON.stringify(result),
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
