const db = require('.');

const run = query => new Promise((resolve, reject) => {
  console.log('Running query');
  db.runQuery(query, (err, result) => err ? reject(err) : resolve(result));
});

const vocationsQuery = db.createQuery('http://foo.com#Vocation').order('createdAt');


module.exports = {
  run,
  vocationsQuery,
};
