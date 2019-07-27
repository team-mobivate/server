const pg = require('pg');

const client = new pg.Client(process.env.DATABASE_URL);

client.connect();
client.on('error', (error) => console.error(error));

module.exports = (query, values) => {
  return client
    .query(query, values)
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error(error);
    });
};
