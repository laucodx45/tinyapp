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
 * @returns {boolean} true if email has already been registered, false when the email has not been registered for an account
 */

const getUserByEmail = (object, email) => {
  for (const user in object) {
    if (object[user].email === email) {
      return true;
    }
  }
  return false;
};

module.exports = {
  generateRandomString,
  getUserByEmail
};