const graphqlHTTP = require('express-graphql');
const express = require('express');
const jwt = require('express-jwt');
const cors = require('cors');
const bodyParser = require('body-parser');
const schema = require('./schema');
const db = require('./db');
const { jwtSecret } = require('./auth');

const isDevelopment = process.env.NODE_ENV !== 'production';

const formatError = isDevelopment ?
  error => console.error(error) || { message: error.message, locations: error.locations } :
  error => console.error(error) || { message: 'Internal server error' };

const server = express()
.use(cors())
.use(bodyParser.urlencoded({ extended: false }))
.use(bodyParser.json())
.use(jwt({
  secret: jwtSecret,
  requestProperty: 'auth',
  credentialsRequired: false,
}))
// Swallow errors
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

  /* Fetch user data */

  const userPromise = req.auth && req.auth.userId ?
    db.readResourceById(req.auth.userId)
    : Promise.resolve(null);

  /* Execute query */

  userPromise.then(user => {
    graphqlHTTP({
      schema,
      formatError,
      pretty: true,
      graphiql: isDevelopment,
      context: { user },
    })(req, res);
  });
})
.listen(3001, err => console.log(err || 'GraphQL endpoint listening on port 3001\n'));

process.on('SIGINT', () => {
  console.log('Terminating GraphQL service.');
  server.close();
  process.exit();
});
