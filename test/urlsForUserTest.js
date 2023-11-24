const { urlsForUser } = require('../functions');
const assert = require('chai').assert;

const testUrlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
  i4BaGe: {
    longURL: "http://www.youtube.com",
    userID : "bc634W"
  }
};

describe("#urlsForUserTest", () => {

  it("should returns the shortenURL object if the userID in shortenURL object matches with input userId", () => {
    const user = urlsForUser(testUrlDatabase, "aJ48lW");
    const expectedOutput = {
      b6UTxQ: {
        longURL: "https://www.tsn.ca",
        userID: "aJ48lW",
      },
      i3BoGr: {
        longURL: "https://www.google.ca",
        userID: "aJ48lW",
      },
    };

    assert.deepEqual(user, expectedOutput);
  });

  it("should returns the shortenURL object if the userID in shortenURL object matches with input userId", () => {
    const user = urlsForUser(testUrlDatabase, "bc634W");
    const expectedOutput = {
      i4BaGe: {
        longURL: "http://www.youtube.com",
        userID : "bc634W"
      }
    };

    assert.deepEqual(user, expectedOutput);
  });

  it("should returns null if input userId does not match with any userID in shortenURL object in database", () => {
    const user = urlsForUser(testUrlDatabase, "aJJJJJ");
    const expectedOutput = null;

    assert.strictEqual(user, expectedOutput);
  });

});