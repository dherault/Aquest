const graphqlHTTP = require('express-graphql');
const express = require('express');
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');

const schema = require('./schema');
const { jwtSecret } = require('./auth');
const { findResource } = require('./db');

/* Welcome to the back-end! */

const isDevelopment = process.env.NODE_ENV !== 'production';
const formatError = error => console.error(error) || error;

const server = express()
.use(cors())
.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json())
.use(jwt({
  secret: jwtSecret,
  requestProperty: 'auth',
  credentialsRequired: false,
}))
/*
Swallow JWT errors, typically expired token and invalid token
Express uses `Function.length` to adapt the passed args (4 args <==> error handler)
Without a 4 args middleware to swallow errors, Express throws them, game over.
NOTE: what about upper middleware errors ?
TODO: log it
*/
.use((err, req, res, next) => next())
.use('/graphql', (req, res) => {

  /* Log query */

  if (req.body && req.body.query) {
    console.log('\n__________\nNew query:\n', req.body.query);

    if (req.body.variables && Object.keys(req.body.variables).length) {
      console.log('\nVariables:\n', JSON.stringify(req.body.variables, null, 2));
    }
  }
  else {
    console.log('body:', req.body);
  }

  /* Fetch viewer data */

  const viewerPromise = req.auth && req.auth.userId ? findResource(req.auth.userId) : Promise.resolve(null);

  /* Execute query */

  viewerPromise.then(viewer => {
    graphqlHTTP({
      schema,
      pretty: true,
      graphiql: isDevelopment,
      context: { viewer },
      formatError,
    })(req, res);
  });
})
.listen(3001, err => console.log(err || 'GraphQL endpoint listening on port 3001\n'));

process.on('SIGINT', () => {
  console.log('Terminating GraphQL service.');
  server.close();
  process.exit();
});
