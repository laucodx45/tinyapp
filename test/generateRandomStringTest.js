const assert = require('chai').assert;
const {generateRandomString} = require('../functions');

describe("#generateRandomString", () => {

  it("should return a random alphanumeric string that contain 6 characters", () => {
    const otuputLength = generateRandomString().length;
    assert.strictEqual(otuputLength, 6);
  });
  
});