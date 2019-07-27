const queryDB = require('../database-interactions/query-postgres');

const ADD_USER_QUERY = `INSERT INTO users (user_id, display_name, user_handle, photo_link, token, token_secret) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (user_id) DO UPDATE SET display_name = $2, user_handle = $3, photo_link = $4, token = $5, token_secret = $6 RETURNING (user_id, display_name, user_handle);`;

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
      return result.rows[0].row;
    })
    .catch((error) => {
      console.error('add user error', error);
      return null;
    });
};
