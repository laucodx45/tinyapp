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
 * @param {object} object
 * @param {string} email
 * @returns {boolean} userId if email has already been registered, false when the email has not been registered for an account
 */

const getUserByEmail = (object, email) => {
  for (const user in object) {
    if (object[user].email === email) {
      return object[user].id;
    }
  }
  return false;
};

// urlsForUser(id) which returns the URLs where the userID is equal to the id of the currently logged-in user
/**
 * function returns the URLs where the userID is equal to the id of the currently logged-in user
 * @param {object} urlDatabase
 * @param {string} user_id from cookie
 * @returns the URLs where the userID is equal to the id of the currently logged-in user
 */


// const urlDatabase = {
//   b6UTxQ: {
//     longURL: "https://www.tsn.ca",
//     userID: "aJ48lW",
//   },
//   i3BoGr: {
//     longURL: "https://www.google.ca",
//     userID: "aJ48lW",
//   },
// };

const urlsForUser = (object, id) => {
  const matchURLobj = {};

  for (const shortendURL in object) {
    if (object[shortendURL].userID === id) {
      matchURLobj[shortendURL] = object[shortendURL];
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