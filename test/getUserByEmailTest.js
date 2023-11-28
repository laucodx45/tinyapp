const assert = require('chai').assert;
const {getUserByEmail} = require('../functions');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('# getUserByEmail', function() {
  it('should returns a user with valid email', function() {
    const user = getUserByEmail(testUsers, "user@example.com");
    const expectedUserID = "userRandomID";

    assert.strictEqual(user, expectedUserID);
  });

  it("should return null if the input email is not found in any user object", () => {
    const user = getUserByEmail(testUsers, "user444@gmail.com");
    const expectedUserID = null;

    assert.strictEqual(user, expectedUserID);
  });

});
