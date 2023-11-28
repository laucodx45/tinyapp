/**
 * Function generate 6 random alphanumeric string
 * @returns returns a string of 6 random alphanumeric characters
 */
const generateRandomString = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    const charactersLength = characters.length;
    const randomIndex = Math.floor(Math.random() * charactersLength);
    result += characters.charAt(randomIndex);
  }
  return result;
};

/**
 * function look up user's email if user is in database
 * @param {object} database
 * @param {string} email
 * @returns {boolean} userId if email has already been registered, undefined when the email has not been registered for an account
 */

const getUserByEmail = (database, email) => {
  for (const user in database) {
    if (database[user].email === email) {
      return database[user].id;
    }
  }
  return null;
};

// urlsForUser(id) which returns the URLs where the userID is equal to the id of the currently logged-in user
/**
 * function returns the URLs where the userID is equal to the id of the currently logged-in user
 * @param {object} urlDatabase
 * @param {string} user_id from cookie
 * @returns the URLs where the userID is equal to the id of the currently logged-in user, returns null if no URL belongs to logged in user
 */

const urlsForUser = (database, id) => {
  const matchURLobj = {};

  for (const shortendURL in database) {
    if (database[shortendURL].userID === id) {
      matchURLobj[shortendURL] = database[shortendURL];
    }
  }
  // no match, display null
  if (Object.keys(matchURLobj).length === 0) {
    return null;
  }

  return matchURLobj;
};

// console.log(urlsForUser(urlDatabase, "J48lW"));
module.exports = {
  generateRandomString,
  getUserByEmail,
  urlsForUser
};