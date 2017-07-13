const db = require('.');

const run = query => new Promise((resolve, reject) => {
  console.log('Running query');
  db.runQuery(query, (err, result) => err ? reject(err) : resolve(result));
});

const skillsQuery = db.createQuery('http://foo.com#Skill').order('createdAt');


module.exports = {
  run,
  skillsQuery,
};
