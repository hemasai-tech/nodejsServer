const express = require( "express" );
const { connectToDb, getDb } = require( "./db" )
const app = express();
const cors = require( "cors" );
app.use( cors() );
app.use( express.json() );
const { ObjectId } = require( 'mongodb' )

//dbConnection
let db


connectToDb( ( err ) => {
  if ( !err ) {
    // Start the server
    app.listen( 3000, () => {
      console.log( "Server is running on port 3000" );
    } );
    db = getDb()
  }
} )

app.get( "/food", ( req, res ) => {
  let foods = []
  const pages = req.query.p || 0;
  const boosPerPage = 3;
  db.collection( 'Menu' )
  .find()
  .skip(pages * boosPerPage)
  .limit(boosPerPage)
  .sort( { price: 1 } )
  .forEach( element => {
    foods.push( element )
  } ).then( () => {
    res.status( 200 ).json( foods )
  } ).catch( ( err ) => {
    res.status( 500 ).json( { error: "Could Not Fetch Data" } )
  } )
} );
app.get( "/food/:id", ( req, res ) => {
  if ( ObjectId.isValid( req.params.id ) ) {
    db.collection( 'Menu' ).findOne( { _id: new ObjectId( req.params.id ) } )
      .then( ( doc ) => {
        res.status( 200 ).json( doc )
      } )
      .catch( err => {
        res.status( 500 ).json( { error: "COuldn't fetch" } )
      } )

  } else {
    res.status( 500 ).json( { error: "Not Valid" } )
  }

} );

app.delete( "/food/:id", ( req, res ) => {
  if ( ObjectId.isValid( req.params.id ) ) {
    db.collection( 'Menu' ).deleteOne( { _id: new ObjectId( req.params.id ) } )
      .then( ( result ) => {
        res.status( 200 ).json( result )
      } )
      .catch( err => {
        res.status( 500 ).json( { error: "COuldn't fetch" } )
      } )

  } else {
    res.status( 500 ).json( { error: "Not Valid" } )
  }

} );
app.patch( "/food/:id", ( req, res ) => {
  const foodUpdate = req.body
  if ( ObjectId.isValid( req.params.id ) ) {
    db.collection( 'Menu' ).updateOne( { _id: new ObjectId( req.params.id ) }, { $set: foodUpdate } )
      .then( ( result ) => {
        res.status( 200 ).json( result )
      } )
      .catch( err => {
        res.status( 500 ).json( { error: "COuldn't fetch" } )
      } )

  } else {
    res.status( 500 ).json( { error: "Not Valid" } )
  }

} );

app.post( '/food', ( req, res ) => {
  const food = req.body;
  db.collection( 'Menu' ).insertOne( food ).then( ( result ) => {
    res.status( 201 ).json( result )
  } ).catch( ( err ) => res.status( 500 ).json( { err: "Could not insert the book" } ) )
} )


