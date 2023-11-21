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
 * @param {string} userId
 * @returns {string} userID's email, it returns undefined when the userId is not in input object database
 */

const getUserByEmail = (object, userId) => {
  if (!object[userId]) {
    return;
  }
  return object[userId].email;
};

module.exports = {
  generateRandomString,
  getUserByEmail
};