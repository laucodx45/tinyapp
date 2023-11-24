const assert = require('chai').assert;
const {generateRandomString} = require('../functions');

describe("#generateRandomString", () => {

  it("should returns a random alphanumeric string that contain 6 characters", () => {
    const outputLength = generateRandomString().length;
    assert.strictEqual(outputLength, 6);
  });

});