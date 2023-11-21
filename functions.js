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
const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
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

module.exports = {
  generateRandomString,
  getUserByEmail
};