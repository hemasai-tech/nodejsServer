const { MongoClient } = require( 'mongodb' );

let dbConnection;
let url = 'mongodb+srv://sirichinnu790:sirichinnu790@cluster0.rqoscby.mongodb.net/?retryWrites=true&w=majority'
module.exports = {
  connectToDb: ( cb ) => {
    MongoClient.connect( url ).then( ( client ) => {
      dbConnection = client.db()
      return cb()
    } ).catch( err => {
      console.log(err);
      return cb(err)
    } )
  },
  getDb: () => dbConnection
}