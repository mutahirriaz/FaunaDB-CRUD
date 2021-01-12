// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
const faunadb = require('faunadb')
 q = faunadb.query;
 require('dotenv').config();

const handler = async (event) => {
  if (process.env.REACT_APP_FAUNADB_KEY) {
  try {

    // only allowed http method
    if(event.httpMethod!=='POST'){
      return {staticCode:405, body:'Method not allowed'}
    }

    const reqObj = JSON.parse(event.body)
    const client = new faunadb.Client({secret: process.env.REACT_APP_FAUNADB_KEY});
    var result = await client.query(

      q.Create(
        q.Collection('posts'),
        {data:{
          todo: reqObj.todo
        }}
      )

    )
        console.log('result',result);
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
