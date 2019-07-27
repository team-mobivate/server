const queryDB = require('../database-interactions/query-postgres');

const ADD_USER_QUERY = `INSERT INTO users (user_id, display_name, user_handle, photo_link, token, token_secret) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id) DO NOTHING RETURNING (user_id, display_name, user_handle, photo_link);`;

module.exports = (userData) => {
  const userDataForQuery = [
    userData.user_id,
    userData.display_name,
    userData.user_handle,
    userData.photo_link,
    userData.token,
    userData.token_secret,
  ];

  return queryDB(ADD_USER_QUERY, userDataForQuery)
    .then((result) => {
      console.log(result);
      return result;
    })
    .catch((error) => {
      console.error('add user error', error);
      return null;
    });
};
